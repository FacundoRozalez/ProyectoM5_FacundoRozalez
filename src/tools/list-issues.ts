import { ToolsSchemas } from "../schemas/index.js";
import { gitHubOperations } from "../github/operations.js";
import { ValidationError } from "../errors/index.js";

export const listIssuesTool = {
  name: "list_issues",
  description: "Lista los reportes de error o tareas actuales asociados a un repositorio en base a su estado (open, closed, all).",
  inputSchema: {
    type: "object",
    properties: {
      owner: { type: "string", description: "Dueño del repositorio." },
      repo: { type: "string", description: "Nombre del repositorio." },
      state: { type: "string", enum: ["open", "closed", "all"], description: "Filtro de estado de los issues. Por defecto 'open'." }
    },
    required: ["owner", "repo"]
  },
  
  handler: async (args: unknown) => {
    
    const parsed = ToolsSchemas.ListIssuesSchema.safeParse(args);
    
    if (!parsed.success) throw new ValidationError(parsed.error.errors.map(e => e.message).join(", "));

    const res = await gitHubOperations.listIssues(parsed.data);
    
    const issues = res.data.map((i: any) => `* [#${i.number}] ${i.title} - Estado: *${i.state}*`).join("\n");
    
    return { content: [{ type: "text", text: issues || "No se encontraron issues en este repositorio." }] };
  }
};