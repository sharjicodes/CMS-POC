
import fs from "fs/promises";
import path from "path";
// import { runGitCommand } from "./git"; // Removed unused dependency

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
export function generateTSContent(interfaceName: string, data: unknown) {
  // format data as JSON
  const json = JSON.stringify(data, null, 2);

  // We export the object directly and infer the type to allow dynamic fields without manual interface updates.
  return `
const content = ${json};

export type PageContent = typeof content;
export default content;
`;
}
