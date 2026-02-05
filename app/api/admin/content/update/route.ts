
import { NextResponse } from "next/server";
import { writeContent, generateTSContent } from "@/lib/files";
import { gitCheckout, gitCommit, gitPush } from "@/lib/git";
import { isAuthenticated } from "@/lib/auth";

export async function POST(request: Request) {
    if (!await isAuthenticated()) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const data = await request.json();
        const branchName = `content-update-${Date.now()}`;

        // 1. Create/Checkout Branch
        await gitCheckout(branchName);

        // 2. Write File
        const fileContent = generateTSContent("HomePageContent", data);
        await writeContent("home.ts", fileContent);

        // 3. Commit
        await gitCommit("Update home page content via CMS");

        // 4. Push
        await gitPush(branchName);

        // 5. Checkout back to main/dev? 
        // Usually we stay on the branch or reset. 
        // For a running server, switching branches underneath might be risky for hot-reload.
        // But this is a POC.

        return NextResponse.json({ success: true, branch: branchName });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
