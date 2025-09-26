import fastify from "../dist/index";

export default async function hander(req, reply) {
    await fastify.ready();
    fastify.server.emit("request", req, reply);
}
