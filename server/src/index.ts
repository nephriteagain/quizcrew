
// Require the framework and instantiate it

// ESM
import Fastify from 'fastify'
import { config } from "dotenv"
import fastifySensible from '@fastify/sensible';
import fastifyEnv from '@fastify/env';
import openAiConnector from "./plugins/openai.js"
import { OpenAiPromptDto, openAiPromptSchema } from './schema/ai.js';

config();

const fastify = Fastify({
  logger: true
})

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
        }
    }
}
const options = {
    schema,
    dotenv: true
}

declare module 'fastify' {
  interface FastifyInstance {
    config: {
      PORT: string;
      OPENAI_KEY : string;
    }
  }
}

fastify.register(fastifySensible);

fastify.register(fastifyEnv, options).after((err) => {
    if (err) {
        fastify.log.error(err, "ENV error");
        return;
    }
    fastify.register(openAiConnector);
})


// Declare a route
fastify.get('/', function (request, reply) {
  reply.send({ hello: 'world' })
})

fastify.post<{Body: OpenAiPromptDto}>('/', {
  schema: {
    body: openAiPromptSchema
  }
}, async (request, reply) => {
    const prompt =request.body.prompt
    const response = await fastify.openai.responses.create({
        model: "gpt-5-mini",
        // reasoning: {effort: "low"},
        input: [
            {
            role: "developer",
            content: "Use 3 words or less."
          },
          {
            role: "user",
            content: prompt
          },
        
        ]
    })
    console.log(response)
    return reply.send(response.output_text)
})

fastify.post<{Body: OpenAiPromptDto}>('/image', {
  schema: {
    body: openAiPromptSchema
  }
}, async (request, reply) => {
    const prompt =request.body.prompt
    const response = await fastify.openai.responses.create({
        model: "gpt-4.1-mini",
        input: prompt,
        tools: [{
          type: "image_generation",
          quality: "low",
        }],
    })
    console.log(response)
    // Extract base64 image data from the response
    const imageData = response.output
      .filter((output) => output.type === "image_generation_call")
      .map((output) => output.result)
    
    if (imageData.length === 0) {
      return reply.code(500).send({ error: "No image generated" })
    }

    const imageBase64 = imageData[0]
    if (!imageBase64) {
      return reply.code(500).send({ error: "No image generated" })
    }
    const imageBuffer = Buffer.from(imageBase64, "base64")

    return reply
      .header("Content-Type", "image/png")
      .send(imageBuffer)

})

// Run the server!
fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  // Server is now listening on ${address}
})