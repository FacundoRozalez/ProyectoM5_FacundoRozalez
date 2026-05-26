import { ToolsSchemas } from "../schemas/index.js";
import { gitHubOperations } from "../github/operations.js";
import { ValidationError } from "../errors/index.js";
import type { MCPToolDefinition } from "../utils/types.js";

export const listRepositoriesTool: MCPToolDefinition = {
  name: "list_repositories",
  description: "Lista los repositorios personales que pertenecen al usuario autenticado (Optimizado con caché).",
  inputSchema: {
    type: "object",
    properties: {
      per_page: { type: "number", description: "Resultados por página (1-100). Por defecto: 30." },
      page: { type: "number", description: "Número de página a recuperar (Mínimo 1). Por defecto: 1." }
    }
  },
   handler: async (args: unknown) => {
    const parsed = ToolsSchemas.ListRepositoriesSchema.safeParse(args);
    if (!parsed.success) throw new ValidationError(parsed.error.errors.map(e => e.message).join(", "));
    
    // Ahora res contiene { data, hasNextPage } gracias al cambio anterior
    const { data, hasNextPage } = await gitHubOperations.listRepositories(parsed.data);
    
    if (!data || data.length === 0) {
      const currentPage = parsed.data.page;
      if (currentPage > 1) {
        return { 
          content: [{ 
            type: "text", 
            text: `No hay más repositorios para mostrar en la página ${currentPage}. Probá consultando una página anterior.` 
          }] 
        };
      }
      return { content: [{ type: "text", text: "No se encontraron repositorios en tu cuenta de GitHub." }] };
    }

    const mdList = data.map((r: any) => `- **${r.name}**: ${r.description || "Sin descripción"}`).join("\n");
    const currentPage = parsed.data.page;
    
    // Construimos una ayuda visual dinámica basada en si hay más páginas o no
    let footerMessage = `\n\n📌 *Fin de la lista. No hay más páginas disponibles.*`;
    if (hasNextPage) {
      footerMessage = `\n\n💡 *Hay más repositorios disponibles. Podés verlos consultando la página ${currentPage + 1}.*`;
    }

    return { 
      content: [{ 
        type: "text", 
        text: `Acá tenés la lista de tus repositorios (Página ${currentPage}):\n\n${mdList}${footerMessage}` 
      }] 
    };
  }
}