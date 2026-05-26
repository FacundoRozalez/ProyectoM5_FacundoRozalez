import { ToolsSchemas } from "../schemas/index.js";
import { gitHubOperations } from "../github/operations.js";
import { ValidationError } from "../errors/index.js";
import type { MCPToolDefinition } from "../utils/types.js";

export const createPullRequestTool: MCPToolDefinition = {
  name: "create_pull_request",
  description: "Extra Credit: Abre una propuesta de cambio (Pull Request) para fusionar el código de una rama secundaria hacia la principal.",
  inputSchema: {
    type: "object",
    properties: {
      owner: { type: "string", description: "Dueño del repositorio." },
      repo: { type: "string", description: "Nombre del repositorio." },
      title: { type: "string", description: "Título claro sobre el cambio introducido." },
      head: { type: "string", description: "La rama que contiene tus cambios. Ej: feature/login" },
      base: { type: "string", description: "La rama destino a donde querés impactar. Por defecto 'main'." },
      body: { type: "string", description: "Descripción de los cambios para los revisores." }
    },
    required: ["owner", "repo", "title", "head"]
  },
  handler: async (args: unknown) => {
    const parsed = ToolsSchemas.CreatePullRequestSchema.safeParse(args);
    if (!parsed.success) throw new ValidationError(parsed.error.errors.map(e => e.message).join(", "));
    const res = await gitHubOperations.createPullRequest(parsed.data);
    return { content: [{ type: "text", text: `¡Extra Credit! Pull Request abierto correctamente: ${res.data.html_url}` }] };
  }
};