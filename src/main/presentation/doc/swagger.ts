import swaggerUi from "swagger-ui-express"
import { PORT } from "../config/config"
import fs from "fs"
import path from "path"
import YAML from "yaml"

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Auth API",
      version: "1.0.0",
      description: "API de autenticação JWT",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/main/presentation/**/*.ts"],
}

const swaggerDocument = YAML.parse(fs.readFileSync(path.join(__dirname, "./swagger.yaml"), "utf8"))

export const swaggerSetup = (app: any) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))
}