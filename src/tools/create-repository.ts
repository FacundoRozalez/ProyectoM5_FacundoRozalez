import { ToolsSchemas } from "../schemas/index.js";
import { gitHubOperations } from "../github/operations.js";
import { ValidationError } from "../errors/index.js";
import type { MCPToolDefinition } from "../utils/types.js";

export const createRepositoryTool: MCPToolDefinition = {
  name: "create_repository",
  description: "Crea un nuevo repositorio en la cuenta del usuario autenticado de GitHub.",
  inputSchema: {
    type: "object",
    properties: {
      name: { type: "string", description: "Nombre único del repositorio (3-100 caracteres, sin espacios)." },
      description: { type: "string", description: "Breve descripción opcional sobre el proyecto." },
      private: { type: "boolean", description: "Define si el repositorio será privado. Por defecto es falso." }
    },
    required: ["name"]
  },
  handler: async (args: unknown) => {
    const parsed = ToolsSchemas.CreateRepositorySchema.safeParse(args);

    if (!parsed.success) {
      const isNameInvalid = parsed.error.errors.some(err => err.path.includes("name"));
      if (isNameInvalid) {
        throw new Error("SUGGESTION: El nombre del repositorio es obligatorio y debe tener entre 3 y 100 caracteres (sin espacios). ¿Qué nombre te gustaría usar?");
      }
      throw new ValidationError(parsed.error.errors.map(e => e.message).join(", "));
    }

    const res = await gitHubOperations.createRepository(parsed.data);
    return { content: [{ type: "text", text: `¡Éxito! Repositorio creado exitosamente: ${res.data.html_url}` }] };
  }
};