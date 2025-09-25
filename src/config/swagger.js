// src/config/swagger.js
import pkg from "swagger-jsdoc";
const swaggerJsdoc = pkg; // safe interop for CJS default export
import swaggerUi from "swagger-ui-express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Adjust host/port if you use envs
const PORT = process.env.PORT || 3020;
const HOST = process.env.BASE_URL_SWAGGER || `localhost:${PORT}`;

const options = {
  swaggerDefinition: {
    swagger: "2.0",
    info: {
      title: "Appointement System",
      version: "1.0.0",
      description: "API documentation for Appointemnt System",
    },
    host: HOST,
    basePath: "/api",
    schemes: ["http"],
    consumes: ["application/json"],
    produces: ["application/json"],
    securityDefinitions: {
      bearerAuth: {
        type: "apiKey",
        name: "Authorization",
        in: "header",
      },
    },
  },

  // IMPORTANT: this glob must point to your swagger js files.
  // Path below goes two levels up from src/config -> project-root/swagger/**/*.js
  apis: [path.join(__dirname, "../../swagger/**/*.js")],
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
