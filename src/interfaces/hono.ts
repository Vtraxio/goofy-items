import { Hono } from "hono";
import warehouses from "../web/api/warehouses";
import { serve } from "@hono/node-server";

const app = new Hono().route("/api/warehouses", warehouses);

serve(app);