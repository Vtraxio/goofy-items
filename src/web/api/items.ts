import { Hono } from "hono";

const app = new Hono()
  .get("/", (c) => {
    return c.json("bruh");
  })

export default app;
