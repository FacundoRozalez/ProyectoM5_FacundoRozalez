import { Octokit } from "@octokit/rest";
import { AuthenticationError } from "../errors/index.js";
import dotenv from "dotenv";

dotenv.config();
const token = process.env.GITHUB_TOKEN;
if (!token) throw new AuthenticationError("Falta la variable GITHUB_PERSONAL_ACCESS_TOKEN");

export const octokit = new Octokit({ auth: token });