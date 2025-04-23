import { Hono } from "hono";
import { context } from "../../index";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { Storage } from "../../models/storage";
import items from "./items";
import { HTTPException } from "hono/http-exception";

const app = new Hono()
  .get("/", (c) => {
    const warehouses = context.warehouses.map((x) => {
      return {
        id: x.cuid,
        name: x.name,
        capacity: x.capacity,
        items: x.itemCount,
        max_weight: x.maxWeight,
        average_weirdness: x.averageWeirdness(),
        weight: x.items.reduce((acc, v) => acc + v.weightKg, 0),
      };
    });

    return c.json(warehouses);
  })
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        name: z.string().nonempty(),
        capacity: z.number().finite().positive(),
        max_weight: z.number().finite().positive(),
      }),
    ),
    (c) => {
      const body = c.req.valid("json");

      const warehouse = new Storage(body.name, body.capacity, body.max_weight);
      context.warehouses.push(warehouse);

      return c.json({
        id: warehouse.cuid,
        name: warehouse.name,
        capacity: warehouse.capacity,
        items: warehouse.itemCount,
        max_weight: warehouse.maxWeight,
        average_weirdness: warehouse.averageWeirdness(),
        weight: warehouse.items.reduce((acc, v) => acc + v.weightKg, 0),
      });
    },
  )
  .get(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.string().nonempty(),
      }),
    ),
    (c) => {
      const params = c.req.valid("param");

      const warehouse = context.warehouses.find((x) => x.cuid === params.id);

      if (!warehouse) {
        throw new HTTPException(404);
      }

      return c.json({
        id: warehouse.cuid,
        name: warehouse.name,
        capacity: warehouse.capacity,
        items: warehouse.itemCount,
        max_weight: warehouse.maxWeight,
        average_weirdness: warehouse.averageWeirdness(),
        weight: warehouse.items.reduce((acc, v) => acc + v.weightKg, 0),
      });
    },
  )
  .delete(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.string().nonempty(),
      }),
    ),
    (c) => {
      const params = c.req.valid("param");

      const idx = context.warehouses.findIndex((x) => x.cuid === params.id);
      const warehouse = context.warehouses.at(idx);

      if (!idx || !warehouse) {
        throw new HTTPException(404);
      }

      context.warehouses.splice(idx, 1);

      return c.json({
        id: warehouse.cuid,
        name: warehouse.name,
        capacity: warehouse.capacity,
        items: warehouse.itemCount,
        max_weight: warehouse.maxWeight,
        average_weirdness: warehouse.averageWeirdness(),
        weight: warehouse.items.reduce((acc, v) => acc + v.weightKg, 0),
      });
    },
  )
  .route("/", items);

export default app;
