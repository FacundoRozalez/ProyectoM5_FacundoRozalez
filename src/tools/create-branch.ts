import { ToolsSchemas } from "../schemas/index.js";
import { gitHubOperations } from "../github/operations.js";
import { ValidationError } from "../errors/index.js";
import type { MCPToolDefinition } from "../utils/types.js";

export const createBranchTool: MCPToolDefinition = {
  name: "create_branch",
  description: "Extra Credit: Crea una nueva rama (branch) de desarrollo a partir de otra existente para aislar código.",
  inputSchema: {
    type: "object",
    properties: {
      owner: { type: "string", description: "Dueño del repositorio." },
      repo: { type: "string", description: "Nombre del repositorio donde crear la rama." },
      branch_name: { type: "string", description: "Nombre de la rama nueva a crear. Ej: feature/auth-fix" },
      from_branch: { type: "string", description: "Nombre de la rama origen. Por defecto 'main'." }
    },
    required: ["owner", "repo", "branch_name"]
  },
  handler: async (args: unknown) => {
    const parsed = ToolsSchemas.CreateBranchSchema.safeParse(args);
    if (!parsed.success) throw new ValidationError(parsed.error.errors.map(e => e.message).join(", "));
    await gitHubOperations.createBranch(parsed.data);
    return { content: [{ type: "text", text: `¡Extra Credit! Rama \`${parsed.data.branch_name}\` creada exitosamente.` }] };
  }
};