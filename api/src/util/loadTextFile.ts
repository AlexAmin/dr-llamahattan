import path from "node:path";
import fs from "fs";

const APP_ROOT = path.resolve(__dirname, "../");

export function loadTextFile(filePath: string): string {
    const resolvedPath = path.join(APP_ROOT, 'prompts', filePath);
    return fs.readFileSync(resolvedPath).toString();
}