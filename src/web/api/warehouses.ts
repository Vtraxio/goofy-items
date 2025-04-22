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

      return c.json("OK");
    },
  )
  .get(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.coerce.number().nonnegative(),
      }),
    ),
    (c) => {
      const params = c.req.valid("param");

      const warehouse = context.warehouses[params.id];

      if (!warehouse) {
        throw new HTTPException(404);
      }

      return c.json({
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
        id: z.coerce.number().nonnegative(),
      }),
    ),
    (c) => {
      const params = c.req.valid("param");

      const warehouse = context.warehouses[params.id];

      if (!warehouse) {
        throw new HTTPException(404);
      }

      context.warehouses.splice(params.id, 1);

      return c.json({
        name: warehouse.name,
        capacity: warehouse.capacity,
        items: warehouse.itemCount,
        maxWeight: warehouse.maxWeight,
        weight: warehouse.items.reduce((acc, v) => acc + v.weightKg, 0),
      });
    },
  )
  .route("/", items);

export default app;
