import { Octokit } from "@octokit/rest";
import { AuthenticationError } from "../errors/index.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "../../.env");

dotenv.config({ path: envPath });

const token = process.env.GITHUB_TOKEN;
if (!token) throw new AuthenticationError("Falta la variable GITHUB_TOKEN en el archivo .env");

export const octokit = new Octokit({ auth: token });