import { ToolsSchemas } from "../schemas/index.js";
import { gitHubOperations } from "../github/operations.js";
import { ValidationError } from "../errors/index.js";

export const getFileContentTool = {
  name: "get_file_content",
  description: "Lee el contenido de un archivo específico desde un repositorio remoto de GitHub.",
  inputSchema: {
    type: "object",
    properties: {
      owner: { type: "string", description: "Propietario del repositorio." },
      repo: { type: "string", description: "Nombre del repositorio." },
      path: { type: "string", description: "Ruta completa del archivo dentro del repositorio. Ej: src/index.js" },
      branch: { type: "string", description: "(Opcional) Rama de la cual leer. Si no se indica, usa la rama por defecto." }
    },
    required: ["owner", "repo", "path"]
  },

  handler: async (args: unknown) => {
    const parsed = ToolsSchemas.GetFileContentSchema.safeParse(args);
    if (!parsed.success) throw new ValidationError(parsed.error.errors.map(e => e.message).join(", "));

    const fileData = await gitHubOperations.getFileContent(parsed.data);

    return {
      content: [{
        type: "text",
        text: `--- Archivo: ${fileData.path} ---\n${fileData.content}`
      }]
    };
  }
};
