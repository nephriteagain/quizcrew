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
