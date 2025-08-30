

import { FastifyInstance } from "fastify";
import fp from "fastify-plugin"
import OpenAI from "openai";

async function openAiConnector(fastify: FastifyInstance) {
    const openai = new OpenAI(
        {apiKey: fastify.config.OPENAI_KEY}
    );
    fastify.decorate("openai", openai);
}

export default fp(openAiConnector)

declare module "fastify" {
    interface FastifyInstance {
        openai: OpenAI
    }
}