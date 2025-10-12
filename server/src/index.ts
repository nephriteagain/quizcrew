// Require the framework and instantiate it

// ESM
import fastifyCors from "@fastify/cors";
import fastifyEnv from "@fastify/env";
import fastifySensible from "@fastify/sensible";
import { config } from "dotenv";
import Fastify from "fastify";
import { v4 as uuidv4 } from "uuid";
import { getImageDataUrl } from "./lib/utils/getImageDataUrl.js";
import { getImageInstructions } from "./lib/utils/getImageInstructions.js";
import openAiConnector from "./plugins/openai.js";
import { OpenAiImagePromptDto, openAiImagePromptSchema, QUIZSchema } from "./schema/ai.js";

config();

const fastify = Fastify({
    logger: true,
    bodyLimit: 30 * 1024 * 1024, // 30MB limit for image uploads
});

const schema = {
    type: "object",
    required: ["PORT", "OPENAI_KEY"],
    properties: {
        OPENAI_KEY: {
            type: "string",
        },
        PORT: {
            type: "string",
            default: 3000,
        },
    },
};
const options = {
    schema,
    dotenv: true,
};

declare module "fastify" {
    interface FastifyInstance {
        config: {
            PORT: string;
            OPENAI_KEY: string;
        };
    }
}

// Register CORS plugin
fastify.register(fastifyCors, {
    // Option 1: Allow all origins (for development)
    origin: true,

    // Option 2: Specify allowed origins (recommended for Expo development)
    // origin: [
    //   'http://localhost:19006', // Expo web
    //   'http://localhost:8081',  // Metro bundler
    //   /^exp:\/\/.*/, // Expo app protocol
    //   /^http:\/\/192\.168\..*/, // Local network IPs
    // ],

    // Option 3: Dynamic origin based on request
    // origin: (origin, callback) => {
    //   const hostname = new URL(origin).hostname;
    //   if (hostname === 'localhost' || hostname === '127.0.0.1') {
    //     callback(null, true);
    //     return;
    //   }
    //   callback(new Error('Not allowed by CORS'), false);
    // },

    methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS", "*"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // If you need to send cookies/auth headers
});

fastify.register(fastifySensible);

fastify.register(fastifyEnv, options).after((err) => {
    if (err) {
        fastify.log.error(err, "ENV error");
        return;
    }
    fastify.register(openAiConnector);
});

// Declare a route
fastify.get("/", function (request, reply) {
    reply.send({ hello: "world" });
});

fastify.post<{ Body: OpenAiImagePromptDto }>(
    "/quiz/from-images",
    {
        schema: {
            body: openAiImagePromptSchema,
        },
    },
    async (request, reply) => {
        const requestId = Date.now().toString().slice(-6); // Simple request ID for tracking
        fastify.log.info(`[${requestId}] Starting quiz generation from images`);

        const { images, type, prompt: additionalPrompt } = request.body;
        fastify.log.info(
            `[${requestId}] Processing ${images.length} image(s) for quiz type: ${type}`
        );

        // Validate base64 images
        fastify.log.info(`[${requestId}] Validating image data...`);
        for (const image of images) {
            if (!image || typeof image !== "string") {
                fastify.log.error(`[${requestId}] Invalid image data provided`);
                return fastify.httpErrors.badRequest("Invalid image data provided");
            }
        }
        fastify.log.info(`[${requestId}] Image validation completed successfully`);

        const { outputName, description, structuredSchema } = getImageInstructions(
            type,
            fastify,
            requestId
        );

        // Prepare the content array for the OpenAI API
        fastify.log.info(`[${requestId}] Preparing message content for OpenAI API...`);

        // Add text instruction
        const baseInstruction = `Analyze the provided image(s) and extract all educational content, notes, diagrams, and text. 
            Based on this content, create a comprehensive ${type} quiz that tests understanding of the material shown in the image(s).
            
            Focus on:
            - Key concepts and definitions
            - Important facts and figures
            - Relationships between ideas
            - Any diagrams or visual elements
            - Mathematical formulas or equations if present
            
            Make sure the quiz questions are relevant to the actual content visible in the image(s).`;

        const finalInstruction = additionalPrompt
            ? `${baseInstruction}\n\nAdditional instructions: ${additionalPrompt}`
            : baseInstruction;

        const messageContent: any[] = [];
        // Add all images
        for (let i = 0; i < images.length; i++) {
            const base64Image = images[i];
            messageContent.push({
                type: "input_image",
                image_url: getImageDataUrl(base64Image), // string only
                detail: "high",
            });
            fastify.log.info(`[${requestId}] Added image ${i + 1}/${images.length}`);
        }

        fastify.log.info(`[${requestId}] Sending request to OpenAI API...`);
        const startTime = Date.now();

        let interval = setInterval(() => {
            console.log("openai processing request...");
        }, 1_000);

        try {
            const response = await fastify.openai.responses.parse({
                model: "gpt-4.1-mini", // Use gpt-4o for better image analysis
                input: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "input_text",
                                text: `You are a ${outputName} quiz generator that creates quizzes from educational content found in images. 
                                You will analyze images of notes, textbooks, diagrams, or other educational materials and create relevant quiz questions.
                            
                                Additional description: ${description}
                                
                                Instructions:
                                1. Carefully read and understand all text, diagrams, and visual content in the provided images
                                2. Extract key educational concepts, facts, and relationships
                            3. Create quiz questions that test comprehension of the material shown
                            4. Ensure questions are clear, accurate, and based on the actual content visible
                            5. For multiple choice questions, make distractors plausible but clearly incorrect
                            6. For true/false questions, focus on specific factual claims from the content
                            7. For drag-and-drop questions, use concepts that have clear relationships visible in the material,
                            
                            ${finalInstruction}
                            `,
                            },
                            ...messageContent,
                        ],
                    },
                ],
                text: {
                    format: {
                        type: "json_schema",
                        name: outputName,
                        schema: structuredSchema,
                        strict: true,
                    },
                },
            });

            const endTime = Date.now();
            const duration = (endTime - startTime) / 1000;

            fastify.log.info(`[${requestId}] OpenAI API request completed in ${duration}s`);
            fastify.log.info(
                `[${requestId}] Generated quiz with ${response.output || "unknown"} questions`
            );

            console.log("Image-based quiz generation response:", response);

            fastify.log.info(`[${requestId}] Sending response to client`);
            const parsedOutput = response.output_parsed as null | QUIZSchema;
            if (!parsedOutput) {
                return reply.internalServerError("Quiz failed to parse.");
            }
            return reply.send({
                ...parsedOutput,
                type,
                createdAt: Date.now(),
                quiz_id: uuidv4(),
            });
        } catch (error) {
            const endTime = Date.now();
            const duration = (endTime - startTime) / 1000;

            fastify.log.error(`[${requestId}] OpenAI API request failed after ${duration}s:`);
            console.error(error);
            clearInterval(interval);
            throw error;
        } finally {
            clearInterval(interval);
        }
    }
);

export default fastify;
