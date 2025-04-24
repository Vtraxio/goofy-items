import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { context } from "../../index";
import { Item } from "../../models/item";

const app = new Hono()
  .get(
    "/:id/items",
    zValidator(
      "param",
      z.object({
        id: z.string().nonempty(),
      }),
    ),
    zValidator(
      "query",
      z.object({
        min: z.coerce.number().nonnegative().optional(),
      }),
    ),
    (c) => {
      const params = c.req.valid("param");
      const query = c.req.valid("query");
      const warehouse = context.warehouses.find((x) => x.cuid === params.id);

      if (!warehouse) {
        throw new HTTPException(404);
      }

      if (!query.min) {
        return c.json(warehouse.items);
      } else {
        const items = warehouse.items.filter((x) => x.fragile || x.weightKg > (query.min ?? 0));
        return c.json(items);
      }
    },
  )
  .get(
    "/:id/items/:iid",
    zValidator(
      "param",
      z.object({
        id: z.string().nonempty(),
        iid: z.string().nonempty(),
      }),
    ),
    (c) => {
      const params = c.req.valid("param");
      const warehouse = context.warehouses.find((x) => x.cuid === params.id);

      if (!warehouse) {
        throw new HTTPException(404);
      }

      const item = warehouse.items.find((x) => x.cuid === params.iid);

      if (!item) {
        throw new HTTPException(404);
      }

      return c.json(item);
    },
  )
  .post(
    "/:id/items",
    zValidator(
      "json",
      z.object({
        name: z.string().nonempty(),
        weight_kg: z.number().positive(),
        weirdness: z.number().int().min(1).max(10),
        fragile: z.boolean(),
      }),
    ),
    zValidator(
      "param",
      z.object({
        id: z.string().nonempty(),
      }),
    ),
    (c) => {
      const body = c.req.valid("json");
      const params = c.req.valid("param");
      const warehouse = context.warehouses.find((x) => x.cuid === params.id);

      if (!warehouse) {
        throw new HTTPException(404);
      }

      const item = new Item(body.name, body.weight_kg, body.weirdness, body.fragile);
      const [success, error] = warehouse.addItem(item);

      if (!success) {
        return c.json({ message: error ?? "Unknown error" }, 400);
      }

      return c.json(item, 200);
    },
  )
  .delete(
    "/:id/items/:iid",
    zValidator(
      "param",
      z.object({
        id: z.string().nonempty(),
        iid: z.string().nonempty(),
      }),
    ),
    (c) => {
      const params = c.req.valid("param");
      const warehouse = context.warehouses.find((x) => x.cuid === params.id);

      if (!warehouse) {
        throw new HTTPException(404);
      }

      const item = warehouse.items.find((x) => x.cuid === params.iid);

      if (!item) {
        throw new HTTPException(404);
      }

      warehouse.deleteItem(item.name);

      return c.json(item);
    },
  );
export default app;
