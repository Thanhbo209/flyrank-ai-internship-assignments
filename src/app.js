import express from "express";
import swaggerUi from "swagger-ui-express";
import taskRoutes from "./routes/tasks.routes.js";
import metaRoutes from "./routes/meta.routes.js";
import { readFile } from "node:fs/promises";

const openapiDocument = JSON.parse(
  await readFile(new URL("../openapi.json", import.meta.url)),
);

export default function createApp(app) {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiDocument));
  app.use("/", metaRoutes);
  app.use("/", taskRoutes);
}
