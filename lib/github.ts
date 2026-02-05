
import { Octokit } from "octokit";

// Initialize Octokit with the token from env
const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});

// Helper to get owner/repo
function getRepoInfo() {
    if (process.env.GITHUB_REPOSITORY) {
        const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
        return { owner, repo };
    }
    // Fallback for local testing or custom setup
    return { owner: "sharjicodes", repo: "CMS-POC" };
}

export async function createPullRequest(title: string, body: string, head: string, base: string) {
    const { owner, repo } = getRepoInfo();

    try {
        // 1. Check if a PR already exists
        const { data: existingPrs } = await octokit.rest.pulls.list({
            owner,
            repo,
            head: `${owner}:${head}`,
            base,
            state: "open",
        });

        if (existingPrs.length > 0) {
            return existingPrs[0].html_url;
        }

        // 2. Create new PR
        const { data: newPr } = await octokit.rest.pulls.create({
            owner,
            repo,
            title,
            body,
            head,
            base,
        });

        return newPr.html_url;
    } catch (error: any) {
        console.error("Failed to create PR:", error);
        return null;
    }
}

export async function updateFileInBranch(
    filePath: string,
    content: string,
    commitMessage: string,
    branch: string
) {
    const { owner, repo } = getRepoInfo();

    try {
        // 1. Get the current SHA of the file (if it exists)
        let sha: string | undefined;
        try {
            const { data: fileData } = await octokit.rest.repos.getContent({
                owner,
                repo,
                path: filePath,
                ref: branch,
            });

            if (Array.isArray(fileData)) {
                throw new Error("Path is a directory");
            }

            sha = fileData.sha;
        } catch (e) {
            // File might not exist yet, which is fine
        }

        // 2. Create or Update file
        // Content must be Base64 encoded
        const contentEncoded = Buffer.from(content).toString("base64");

        await octokit.rest.repos.createOrUpdateFileContents({
            owner,
            repo,
            path: filePath,
            message: commitMessage,
            content: contentEncoded,
            branch: branch,
            sha: sha, // Required if updating
        });

        return true;
    } catch (error: any) {
        console.error("GitHub File Update Failed:", error);
        throw new Error(`Failed to update file on GitHub: ${error.message}`);
    }
}
