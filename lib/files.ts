
import fs from "fs/promises";
import path from "path";
import { runGitCommand } from "./git";

const CONTENT_DIR = path.join(process.cwd(), "content");

export async function readContent(filename: string) {
    // In a real app we might dynamic import, but for editing we need the raw string
    const filePath = path.join(CONTENT_DIR, filename);
    return await fs.readFile(filePath, "utf-8");
}

export async function writeContent(filename: string, content: string) {
    const filePath = path.join(CONTENT_DIR, filename);
    await fs.writeFile(filePath, content, "utf-8");
}

// Helper to update the content object in the file
// This is a naive implementation that replaces the whole object definition.
// In a real production builder, we might use AST to preserve comments/structure better.
export function generateTSContent(interfaceName: string, data: any) {
    // format data as JSON but verify it's valid JS object syntax for the file
    const json = JSON.stringify(data, null, 2);

    return `
export interface ${interfaceName} {
  heroTitle: string;
  heroDescription: string;
  features: {
    title: string;
    description: string;
  }[];
}

const content: ${interfaceName} = ${json};

export default content;
`;
}
