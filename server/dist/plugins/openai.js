import fp from "fastify-plugin";
import OpenAI from "openai";
async function openAiConnector(fastify) {
    const openai = new OpenAI({ apiKey: fastify.config.OPENAI_KEY });
    fastify.decorate("openai", openai);
}
export default fp(openAiConnector);
//# sourceMappingURL=openai.js.map