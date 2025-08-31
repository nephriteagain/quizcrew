// Require the framework and instantiate it

// ESM
import fastifyEnv from "@fastify/env";
import fastifySensible from "@fastify/sensible";
import { config } from "dotenv";
import Fastify from "fastify";
import { QUIZ } from "./constants/quiz.js";
import openAiConnector from "./plugins/openai.js";
import { OpenAiPromptDto, openAiPromptSchema } from "./schema/ai.js";

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
        const { images, type, prompt: additionalPrompt } = request.body;

        // Validate base64 images
        for (const image of images) {
            if (!image || typeof image !== "string") {
                return fastify.httpErrors.badRequest("Invalid image data provided");
            }
        }

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

        const DNDQSchema = {
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
        let description: string;
        let structuredSchema;

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
                throw fastify.httpErrors.badRequest("invalid_type");
        }

        // Prepare the content array for the OpenAI API
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
        for (const base64Image of images) {
            messageContent.push({
                type: "image_url",
                image_url: {
                    url: `data:image/jpeg;base64,${base64Image}`,
                    detail: "high", // Use high detail for better text extraction
                },
            });
        }

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

        console.log("Image-based quiz generation response:", response);
        return reply.send(response.output_parsed);
    }
);

// Optional: Keep the original text-based endpoint
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

        const DNDQSchema = {
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
        let description: string;
        let structuredSchema;

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
                return fastify.httpErrors.badRequest("invalid_type");
        }

        try {
            const response = await fastify.openai.responses.parse({
                model: "gpt-4o-mini",
                input: [
                    {
                        role: "system",
                        content: `You are a ${outputName} quiz generator. You will be given a prompt and will create a quiz based from it.
                        Additional description: ${description}`,
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
        } catch (error) {
            console.error("Error generating text-based quiz:", error);
            return fastify.httpErrors.internalServerError("Failed to generate quiz");
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
