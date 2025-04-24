import { Hono } from "hono";
import warehouses from "../web/api/warehouses";
import { cors } from "hono/cors";

export const api = new Hono().use("*", cors()).route("/api/warehouses", warehouses);
export type MyApp = typeof api;
