import fastify from "./index.js";
// Run the server
fastify.listen({ port: parseInt(process.env.PORT || "3000"), host: "0.0.0.0" }, function (err, address) {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    // Server is now listening on ${address}
});
