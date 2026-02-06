
import { NextResponse } from "next/server";
import { writeContent, generateTSContent } from "@/lib/files";
import { gitCheckout, gitCommit, gitPush } from "@/lib/git"; // Unused but kept for reference if needed, or remove.
// Actually, let's remove it to avoid confusion since we are 100% serverless now.
import { isAuthenticated } from "@/lib/auth";

export async function POST(request: Request) {
    if (!await isAuthenticated()) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const data = await request.json();
        const branchName = "development";

        // 1. Generate Content
        const fileContent = generateTSContent("HomePageContent", data);

        // 2. Write directly to GitHub (Vercel Compatible)
        // We use the 'content/home.ts' path relative to repo root
        const { updateFileInBranch, createPullRequest } = await import("@/lib/github");

        await updateFileInBranch(
            "content/home.ts",
            fileContent,
            "Update home page content via CMS",
            branchName
        );

        // 3. Create PR
        const prUrl = await createPullRequest(
            "Content Update from CMS",
            "This PR was automatically created by the CMS. Please review the changes.",
            branchName,
            "main"
        );

        return NextResponse.json({ success: true, branch: branchName, prUrl });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
