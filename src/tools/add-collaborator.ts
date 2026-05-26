import { ToolsSchemas } from "../schemas/index.js";
import { gitHubOperations } from "../github/operations.js";
import { ValidationError } from "../errors/index.js";
import type { MCPToolDefinition } from "../utils/types.js";

export const addCollaboratorTool: MCPToolDefinition = {
  name: "add_collaborator",
  description: "Extra Credit: Agrega a otro usuario de GitHub como colaborador invitado a un repositorio dándole permisos a elección.",
  inputSchema: {
    type: "object",
    properties: {
      owner: { type: "string", description: "Dueño del repositorio (ej. usuario u organización)." },
      repo: { type: "string", description: "Nombre exacto del repositorio." },
      username: { type: "string", description: "Nombre exacto del usuario en GitHub a invitar." },
      permission: { type: "string", enum: ["pull", "push", "admin"], description: "Rol asignado. Por defecto 'push'." }
    },
    required: ["owner", "repo", "username"]
  },
  handler: async (args: unknown) => {
    const parsed = ToolsSchemas.AddCollaboratorSchema.safeParse(args);
    if (!parsed.success) throw new ValidationError(parsed.error.errors.map(e => e.message).join(", "));
    await gitHubOperations.addCollaborator(parsed.data);
    return { content: [{ type: "text", text: `¡Extra Credit! Se envió la invitación al usuario \`${parsed.data.username}\`.` }] };
  }
};