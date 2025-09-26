import { QUIZ } from "../../constants/quiz.js";
import { DNDQSchema, MCQSchema, TOFQSchema } from "../../schema/ai.js";
export function getImageInstructions(type, fastify, requestId) {
    let outputName;
    let description;
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
    return { outputName, description, structuredSchema };
}
//# sourceMappingURL=getImageInstructions.js.map