import { Hono } from "hono";
import warehouses from "../web/api/warehouses";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";

const app = new Hono().use("*", cors()).route("/api/warehouses", warehouses);
export type MyApp = typeof app;

serve(app);
