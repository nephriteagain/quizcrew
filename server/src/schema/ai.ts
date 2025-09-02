import { FromSchema } from "json-schema-to-ts";

export const openAiPromptSchema = {
    type: "object",
    required: ["prompt", "type"],
    additionalProperties: false,
    properties: {
        prompt: { type: "string" },
        type: { enum: ["MCQ", "TOFQ", "DNDQ"] },
    },
} as const;

export type OpenAiPromptDto = FromSchema<typeof openAiPromptSchema>;

export const MCQSchema = {
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

export const TOFQSchema = {
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

export const DNDQSchema = {
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
