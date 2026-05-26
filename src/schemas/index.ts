import { z } from "zod";

export const repoNameSchema = z.string()
  .min(3, "Mínimo 3 caracteres")
  .max(100, "Máximo 100 caracteres")
  .regex(/^[a-zA-Z0-9._-]+$/, "Solo alfanuméricos, guiones, puntos y guiones bajos");

// Sub-esquema para validar cada archivo de la lista
const fileItemSchema = z.object({
  path: z.string().min(1, "La ruta del archivo no puede estar vacía"),
  content: z.string().min(1, "El contenido no puede estar vacío")
});

export const ToolsSchemas = {
  CreateRepositorySchema: z.object({ 
    name: repoNameSchema, 
    description: z.string().optional(), 
    private: z.boolean().default(false) }),

  CreateIssueSchema: z.object({ 
    owner: z.string().min(1), 
    repo: repoNameSchema, 
    title: z.string().min(1), 
    body: z.string().optional() }),
  
  ListRepositoriesSchema: z.object({ 
    per_page: z.number().min(1).max(100).default(30), 
    page: z.number().min(1).default(1) 
  }),
  
  CreateCommitSchema: z.object({ 
    owner: z.string().min(1), 
    repo: repoNameSchema, 
    message: z.string().min(1),
    branch: z.string().default("main"),
    files: z.array(fileItemSchema).min(1, "Debés incluir al menos un archivo") // 👈 Arreglo multi-archivo
  }),
  
  ListIssuesSchema: z.object({ 
    owner: z.string().min(1), 
    repo: repoNameSchema, 
    state: z.enum(["open", "closed", "all"]).default("open") }),
  
  CreateBranchSchema: z.object({ 
    owner: z.string().min(1), 
    repo: repoNameSchema, 
    branch_name: z.string().min(1), 
    from_branch: z.string().default("main") }),

  CreatePullRequestSchema: z.object({ 
    owner: z.string().min(1), 
    repo: repoNameSchema, 
    title: z.string().min(1), 
    head: z.string().min(1), 
    base: z.string().default("main"), 
    body: z.string().optional() }),
  
  AddCollaboratorSchema: z.object({ 
    owner: z.string().min(1), 
    repo: repoNameSchema, 
    username: z.string().min(1), 
    permission: z.enum(["pull", "push", "admin"]).default("push") }),
    
  GetFileContentSchema: z.object({
    owner: z.string().min(1),
    repo: repoNameSchema,
    path: z.string().min(1, "La ruta del archivo no puede estar vacía"),
    branch: z.string().optional().describe("Rama opcional. Si se omite, usa la rama por defecto.")
  })
};

export type CreateRepositoryInput = z.infer<typeof ToolsSchemas.CreateRepositorySchema>;
export type CreateIssueInput = z.infer<typeof ToolsSchemas.CreateIssueSchema>;
export type ListRepositoriesInput = z.infer<typeof ToolsSchemas.ListRepositoriesSchema>;
export type CreateCommitInput = z.infer<typeof ToolsSchemas.CreateCommitSchema>; // 👈 Tipo actualizado automáticamente
export type ListIssuesInput = z.infer<typeof ToolsSchemas.ListIssuesSchema>;
export type CreateBranchInput = z.infer<typeof ToolsSchemas.CreateBranchSchema>;
export type CreatePullRequestInput = z.infer<typeof ToolsSchemas.CreatePullRequestSchema>;
export type AddCollaboratorInput = z.infer<typeof ToolsSchemas.AddCollaboratorSchema>;
export type GetFileContentInput = z.infer<typeof ToolsSchemas.GetFileContentSchema>;