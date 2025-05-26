import {
  createHedgehog,
  getAllHedgehogs,
  getHedgehogById,
} from "@server/application/hedgehog";
import { hedgehogSchema } from "@shared/hedgehog";
import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { ZodError } from "zod";

export const hedgehogRouter = (
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions,
  done: () => void,
) => {
  fastify.get("/", async (_request, reply) => {
    const hedgehogs = (await getAllHedgehogs()) ?? [];

    return reply.code(200).send({
      hedgehogs,
    });
  });

  fastify.get("/:id", async (req, res) => {
    const id = (req.params as { id: string }).id;

    if (!Number.isInteger(Number(id))) {
      return res.code(400).send({
        error: "Invalid id",
      });
    }

    const hedgehog = await getHedgehogById(Number(id));

    if (hedgehog === null) {
      return res.code(404).send();
    }

    return res.code(200).send({
      hedgehog,
    });
  });

  fastify.post("/", async (req, res) => {
    try {
      const hedgehog = hedgehogSchema.omit({ id: true }).parse(req.body);

      const newHedgehog = await createHedgehog(hedgehog);

      return res.code(201).send(newHedgehog);
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).send({
          error: "Validation failed",
          details: err.errors,
        });
      }

      return res.status(400).send({ error: "Bad request" });
    }
  });

  done();
};
