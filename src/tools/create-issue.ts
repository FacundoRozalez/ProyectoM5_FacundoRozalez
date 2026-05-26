import { ToolsSchemas } from "../schemas/index.js";
import { gitHubOperations } from "../github/operations.js";
import { ValidationError } from "../errors/index.js";

export const createIssueTool = {
  name: "create_issue",
  description: "Abre una nueva tarea, bug o reporte de error dentro de un repositorio existente de GitHub.",
  inputSchema: {
    type: "object",
    properties: {
      owner: { type: "string", description: "Usuario o nombre de la organización dueña del repositorio." },
      repo: { type: "string", description: "Nombre exacto del repositorio donde se abrirá el issue." },
      title: { type: "string", description: "Título descriptivo del problema o feature requerida." },
      body: { type: "string", description: "Detalles o cuerpo del ticket explicando el problema." }
    },
    required: ["owner", "repo", "title"]
  },
  handler: async (args: unknown) => {
    const parsed = ToolsSchemas.CreateIssueSchema.safeParse(args);
    if (!parsed.success) throw new ValidationError(parsed.error.errors.map(e => e.message).join(", "));
    const res = await gitHubOperations.createIssue(parsed.data);
    return { content: [{ type: "text", text: `¡Éxito! Issue #${res.data.number} abierto: ${res.data.html_url}` }] };
  }
};