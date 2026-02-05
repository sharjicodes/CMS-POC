
import { NextResponse } from "next/server";
import { readContent } from "@/lib/files";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
    if (!await isAuthenticated()) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // For this POC we only support home.ts
        const content = await readContent("home.ts");

        // Check if we need to parse it or send raw string
        // Sending raw string allows the frontend to parse it or just regex extract
        // But since our `readContent` returns the file string, we'll send that.
        // Ideally we might want to send the JSON object.
        // But since the file is a TS file, parsing it in Node without `eval` is tricky implies we should import it?
        // Dynamic import might be cached. 
        // For this POC, let's try to extract the JSON part via Regex or just import it if Next.js allows.

        // Better approach:
        // We can import the content directly if we want the current build state.
        // But if we want the *file on disk* possibly changed by another process?
        // Let's stick to importing for reading current state.

        const { default: contentObj } = await import("@/content/home");
        return NextResponse.json(contentObj);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to read content" }, { status: 500 });
    }
}
