
import { NextResponse } from "next/server";
import { generateTSContent } from "@/lib/files";
// import { gitCheckout, gitCommit, gitPush } from "@/lib/git"; // Fully removed local git usage
import { isAuthenticated } from "@/lib/auth";

export async function POST(request: Request) {
    if (!await isAuthenticated()) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const data = await request.json();
        const { slug, ...contentData } = data; // contentData is the actual content object
        const branchName = "development";

        if (!slug) {
            return NextResponse.json({ error: "Slug is required" }, { status: 400 });
        }

        // 1. Generate Content
        // We use a generic name or derived from slug
        const interfaceName = `${slug.charAt(0).toUpperCase() + slug.slice(1)}Content`;
        const fileContent = generateTSContent(interfaceName, contentData);

        // 2. Write directly to GitHub (Vercel Compatible)
        // We use the 'content/[slug].ts' path relative to repo root
        const { updateFileInBranch, createPullRequest } = await import("@/lib/github");

        await updateFileInBranch(
            `content/${slug}.ts`,
            fileContent,
            `Update ${slug} content via CMS`,
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
    } catch (error: unknown) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    }
}
