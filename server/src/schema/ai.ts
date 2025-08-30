import { FromSchema } from "json-schema-to-ts";


export const openAiPromptSchema = {
    type: "object",
    properties: {
        prompt: {type: "string"}
    },
    required: ["prompt"],
    additionalProperties: false
} as const;

export type OpenAiPromptDto = FromSchema<typeof openAiPromptSchema>;