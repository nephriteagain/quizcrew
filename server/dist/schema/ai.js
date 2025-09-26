export const openAiPromptSchema = {
    type: "object",
    required: ["prompt", "type"],
    additionalProperties: false,
    properties: {
        prompt: { type: "string" },
        type: { enum: ["MCQ", "TOFQ", "DNDQ"] },
    },
};
export const openAiImagePromptSchema = {
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
};
export const MCQSchema = {
    type: "object",
    required: ["questions", "title", "description"],
    additionalProperties: false,
    properties: {
        questions: {
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
            minItems: 10,
            maxItems: 10,
        },
        title: { type: "string" },
        description: { type: "string" },
    },
};
export const TOFQSchema = {
    type: "object",
    required: ["questions", "title", "description"],
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
                    answer: { type: "boolean" },
                },
            },
            minItems: 10,
            maxItems: 10,
        },
        title: { type: "string" },
        description: { type: "string" },
    },
};
export const DNDQSchema = {
    type: "object",
    required: ["questions", "answers", "title", "description"],
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
            minItems: 10,
            maxItems: 10,
        },
        answers: {
            type: "array",
            items: {
                type: "string",
            },
            minItems: 10,
            maxItems: 10,
        },
        title: { type: "string" },
        description: { type: "string" },
    },
};
//# sourceMappingURL=ai.js.map