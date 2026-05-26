/**
 * Interfaces globales y tipos de datos compartidos de AutomateHub MCP
 */

// 1. Tipos relacionados al sistema de Logging estructurado
export type LogLevelString = "DEBUG" | "INFO" | "WARN" | "ERROR";

export interface LogEntry {
  timestamp: string;
  level: LogLevelString;
  message: string;
  meta?: Record<string, any>;
}

// 2. Interfaces relacionadas con la capa de Caché interna (Extra Credit)
export interface CacheEntry<T = any> {
  data: T;
  expiry: number;
}

// 3. Estructuras de datos comunes de la API de GitHub que consume tu lógica
export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
}

export interface GitHubRepositorySummary {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  owner: GitHubUser;
  html_url: string;
  description: string | null;
  created_at: string;
}

export interface GitHubIssueSummary {
  id: number;
  number: number;
  title: string;
  state: "open" | "closed";
  user: GitHubUser;
  html_url: string;
  body: string | null;
  comments: number;
}

// 4. Tipo de retorno unificado que espera el SDK de Model Context Protocol (MCP)
export interface MCPTextContent {
  type: "text";
  text: string;
}

export interface MCPResponse {
  content: MCPTextContent[];
  isError?: boolean;
}

// 5. Contrato base que debe cumplir cada archivo de la carpeta /tools
export interface MCPToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, { type: string; description?: string; enum?: string[] }>;
    required?: string[];
  };
  handler: (args: unknown) => Promise<MCPResponse>;
}