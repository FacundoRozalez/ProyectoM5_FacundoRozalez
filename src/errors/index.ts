export class ValidationError extends Error { name = "ValidationError"; }
export class GitHubAPIError extends Error { name = "GitHubAPIError"; }
export class AuthenticationError extends Error { name = "AuthenticationError"; }

function extractGithubMessage(error: any): string | undefined {
  return error?.response?.data?.message || error?.message || error?.error?.message;
}

export function formatErrorForLLM(error: any, context: string): string {
  if (error instanceof ValidationError) {
    return `Error de validación al ${context}: ${error.message}`;
  }

  if (error instanceof AuthenticationError) {
    return "Error de autenticación. Comprobá que tu GITHUB_PERSONAL_ACCESS_TOKEN sea válido y posea los scopes necesarios.";
  }

  if (error.status === 401 || error.status === 403) {
    return "Error de autenticación o permisos insuficientes. Verificá tu token y que tenga los scopes de GitHub correctos.";
  }

  if (error.status === 404) {
    return `El recurso para ${context} no existe. Verificá los nombres del dueño, del repositorio, o de los elementos involucrados (ramas, usuarios, etc.).`;
  }

  if (error.status === 422) {
    const githubMessage = extractGithubMessage(error);
    return `Error lógico de GitHub al ${context}: ${githubMessage || "La acción es inválida (ej. la rama ya existe, el pull request ya está abierto, etc)."}`;
  }

  if (error.status === 429) {
    return `GitHub está limitando las solicitudes al ${context}. Esperá unos segundos e intentá de nuevo.`;
  }

  if (error.status >= 500 && error.status < 600) {
    return `GitHub está teniendo un problema temporal al ${context}. Intentá de nuevo en unos minutos.`;
  }

  if (error.code === "ENOTFOUND" || error.code === "ECONNREFUSED" || error.code === "ECONNRESET") {
    return `Error de red al ${context}: ${error.message}. Verificá tu conexión e intentá nuevamente.`;
  }

  if (error.request && !error.response) {
    return `No se recibió respuesta de GitHub al ${context}. Puede ser un problema de conexión o de red.`;
  }

  const githubMessage = extractGithubMessage(error);
  if (githubMessage) {
    return `Error al ${context}: ${githubMessage}`;
  }

  return `Error inesperado al ${context}: ${error?.message || String(error)}`;
}