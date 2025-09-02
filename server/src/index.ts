// Require the framework and instantiate it

// ESM
import fastifyCors from "@fastify/cors";
import fastifyEnv from "@fastify/env";
import fastifySensible from "@fastify/sensible";
import { config } from "dotenv";
import Fastify from "fastify";
import { QUIZ } from "./constants/quiz.js";
import openAiConnector from "./plugins/openai.js";
import {
    DNDQSchema,
    MCQSchema,
    OpenAiPromptDto,
    openAiPromptSchema,
    TOFQSchema,
} from "./schema/ai.js";

config();

const fastify = Fastify({
    logger: true,
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

fastify.post<{ Body: OpenAiPromptDto }>(
    "/",
    {
        schema: {
            body: openAiPromptSchema,
        },
    },
    async (request, reply) => {
        const prompt = request.body.prompt;
        const response = await fastify.openai.responses.create({
            model: "gpt-5-mini",
            // reasoning: {effort: "low"},
            input: [
                {
                    role: "developer",
                    content: "Use 3 words or less.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });
        console.log(response);
        return reply.send(response.output_text);
    }
);

fastify.post<{ Body: OpenAiPromptDto }>(
    "/image",
    {
        schema: {
            body: openAiPromptSchema,
        },
    },
    async (request, reply) => {
        const prompt = request.body.prompt;
        const response = await fastify.openai.responses.create({
            model: "gpt-4.1-mini",
            input: prompt,
            tools: [
                {
                    type: "image_generation",
                    quality: "low",
                },
            ],
        });
        console.log(response);
        // Extract base64 image data from the response
        const imageData = response.output
            .filter((output) => output.type === "image_generation_call")
            .map((output) => output.result);

        if (imageData.length === 0) {
            return reply.code(500).send({ error: "No image generated" });
        }

        const imageBase64 = imageData[0];
        if (!imageBase64) {
            return reply.code(500).send({ error: "No image generated" });
        }
        const imageBuffer = Buffer.from(imageBase64, "base64");

        return reply.header("Content-Type", "image/png").send(imageBuffer);
    }
);

fastify.post<{ Body: OpenAiPromptDto }>(
    "/quiz",
    {
        schema: {
            body: openAiPromptSchema,
        },
    },
    async (request, reply) => {
        const prompt = request.body.prompt;
        const type = request.body.type;

        const MCQSchema = {
            type: "object",
            required: ["quiz"],
            additionalProperties: false,
            properties: {
                quiz: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            question: { type: "string" },
                            answer: { type: "string" },
                            choices: {
                                type: "array",
                                items: {
                                    type: "string",
                                },
                            },
                        },
                        required: ["question", "answer", "choices"],
                        additionalProperties: false,
                    },
                },
            },
        } as const;

        const TOFQSchema = {
            type: "object",
            required: ["quiz"],
            additionalProperties: false,
            properties: {
                quiz: {
                    type: "array",
                    items: {
                        type: "object",
                        required: ["question", "answer"],
                        additionalProperties: false,
                        properties: {
                            question: { type: "string" },
                            answer: { type: "boolean" },
                        },
                    },
                },
            },
        } as const;

        const DNDQShema = {
            type: "object",
            required: ["quiz"],
            additionalProperties: false,
            properties: {
                quiz: {
                    type: "object",
                    required: ["questions", "answers"],
                    additionalProperties: false,
                    properties: {
                        questions: {
                            type: "array",
                            items: {
                                type: "object",
                                required: ["question", "answer"],
                                additionalProperties: false,
                                properties: {
                                    question: { type: "string" },
                                    answer: { type: "string" },
                                },
                            },
                        },
                        answers: {
                            type: "array",
                            items: {
                                type: "string",
                            },
                        },
                    },
                },
            },
        } as const;

        let outputName: string;
        let desription: string;
        let structuredSchema;
        switch (type) {
            case "MCQ":
                outputName = QUIZ.MCQ.name;
                structuredSchema = MCQSchema;
                desription = QUIZ.MCQ.description;
                break;
            case "TOFQ":
                outputName = QUIZ.TOFQ.name;
                structuredSchema = TOFQSchema;
                desription = QUIZ.TOFQ.description;

                break;
            case "DNDQ":
                outputName = QUIZ.DNDQ.name;
                structuredSchema = DNDQShema;
                desription = QUIZ.DNDQ.description;

                break;
            default:
                return fastify.httpErrors.badRequest("invalid_type");
        }

        const response = await fastify.openai.responses.parse({
            model: "gpt-4o-mini",
            input: [
                {
                    role: "system",
                    content: `You are a ${outputName} quiz generator. You will be given a prompt and will create a quiz based from it.
                    Additional description: ${desription}`,
                },
                {
                    role: "user",
                    content: prompt,
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
        console.log(response);
        return reply.send(response.output_parsed);
    }
);

interface OpenAiImagePromptDto {
    images: string[]; // Array of base64 encoded images
    type: "MCQ" | "TOFQ" | "DNDQ";
    prompt?: string; // Optional additional context/instructions
}

const openAiImagePromptSchema = {
    type: "object",
    required: ["images", "type"],
    additionalProperties: false,
    properties: {
        images: {
            type: "array",
            items: { type: "string" },
            minItems: 1,
            maxItems: 10, // Reasonable limit for performance
        },
        type: {
            type: "string",
            enum: ["MCQ", "TOFQ", "DNDQ"],
        },
        prompt: { type: "string" },
    },
} as const;

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

        let outputName: string;
        let description: string;
        let structuredSchema;

        fastify.log.info(`[${requestId}] Setting up quiz configuration for type: ${type}`);
        switch (type) {
            case "MCQ":
                outputName = QUIZ.MCQ.name;
                structuredSchema = MCQSchema;
                description = QUIZ.MCQ.description;
                break;
            case "TOFQ":
                outputName = QUIZ.TOFQ.name;
                structuredSchema = TOFQSchema;
                description = QUIZ.TOFQ.description;
                break;
            case "DNDQ":
                outputName = QUIZ.DNDQ.name;
                structuredSchema = DNDQSchema;
                description = QUIZ.DNDQ.description;
                break;
            default:
                fastify.log.error(`[${requestId}] Invalid quiz type: ${type}`);
                throw fastify.httpErrors.badRequest("invalid_type");
        }
        fastify.log.info(`[${requestId}] Quiz configuration set: ${outputName}`);

        // Prepare the content array for the OpenAI API
        fastify.log.info(`[${requestId}] Preparing message content for OpenAI API...`);
        const messageContent: any[] = [];

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

        messageContent.push({
            type: "text",
            text: finalInstruction,
        });

        // Add all images to the message content
        fastify.log.info(`[${requestId}] Adding ${images.length} images to message content...`);
        for (let i = 0; i < images.length; i++) {
            const base64Image = images[i];
            messageContent.push({
                type: "image_url",
                image_url: {
                    url: `data:image/jpeg;base64,${base64Image}`,
                    detail: "high", // Use high detail for better text extraction
                },
            });
            fastify.log.info(
                `[${requestId}] Added image ${i + 1}/${images.length} to message content`
            );
        }

        fastify.log.info(`[${requestId}] Sending request to OpenAI API...`);
        const startTime = Date.now();

        try {
            let interval = setInterval(() => {
                console.log("openai processing request...");
            }, 1_000);
            const response = await fastify.openai.responses.parse({
                model: "gpt-4o", // Use gpt-4o for better image analysis
                input: [
                    {
                        role: "system",
                        content: `You are a ${outputName} quiz generator that creates quizzes from educational content found in images. 
                            You will analyze images of notes, textbooks, diagrams, or other educational materials and create relevant quiz questions.
                            
                            Additional description: ${description}
                            
                            Instructions:
                            1. Carefully read and understand all text, diagrams, and visual content in the provided images
                            2. Extract key educational concepts, facts, and relationships
                            3. Create quiz questions that test comprehension of the material shown
                            4. Ensure questions are clear, accurate, and based on the actual content visible
                            5. For multiple choice questions, make distractors plausible but clearly incorrect
                            6. For true/false questions, focus on specific factual claims from the content
                            7. For drag-and-drop questions, use concepts that have clear relationships visible in the material`,
                    },
                    {
                        role: "user",
                        content: messageContent,
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
            clearInterval(interval);

            const endTime = Date.now();
            const duration = (endTime - startTime) / 1000;

            fastify.log.info(`[${requestId}] OpenAI API request completed in ${duration}s`);
            fastify.log.info(
                `[${requestId}] Generated quiz with ${
                    response.output_parsed || "unknown"
                } questions`
            );

            console.log("Image-based quiz generation response:", response);

            fastify.log.info(`[${requestId}] Sending response to client`);
            return reply.send(response.output_parsed);
        } catch (error) {
            const endTime = Date.now();
            const duration = (endTime - startTime) / 1000;

            fastify.log.error(`[${requestId}] OpenAI API request failed after ${duration}s:`);
            console.error(error);
            throw error;
        }
    }
);

// Run the server
fastify.listen({ port: 3000 }, function (err, address) {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    // Server is now listening on ${address}
});
