
import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import fs from "fs";
import path from "path";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    if (!await isAuthenticated()) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { slug } = await params;
        const filePath = path.join(process.cwd(), "content", `${slug}.ts`);

        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: "Content not found" }, { status: 404 });
        }

        // Dynamic import
        const contentModule = await import(`@/content/${slug}`);
        const contentObj = contentModule.default;

        return NextResponse.json(contentObj);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to read content" }, { status: 500 });
    }
}
