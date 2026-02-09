
import { NextResponse } from "next/server";
import { readdir } from "fs/promises";
import path from "path";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
    if (!await isAuthenticated()) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const contentDir = path.join(process.cwd(), "content");
        const files = await readdir(contentDir);

        const slugs = files
            .filter(file => file.endsWith(".ts") || file.endsWith(".tsx"))
            .map(file => file.replace(/\.tsx?$/, ""));

        return NextResponse.json(slugs);
    } catch (error) {
        console.error("Failed to list content files:", error);
        return NextResponse.json({ error: "Failed to list content" }, { status: 500 });
    }
}
