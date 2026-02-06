
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function runGitCommand(command: string) {
    try {
        const { stdout, stderr } = await execAsync(`git ${command}`);
        if (stderr && !stderr.includes("Already on")) {
            console.warn("Git warning:", stderr);
        }
        return stdout.trim();
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : "Unknown error";
        console.error("Git command failed:", command, msg);
        throw new Error(`Git command failed: ${msg}`);
    }
}

export async function gitCheckout(branch: string) {
    // Check if branch exists
    try {
        await runGitCommand(`checkout ${branch}`);
    } catch {
        // If checkout fails, try creating it
        await runGitCommand(`checkout -b ${branch}`);
    }
}

export async function gitCommit(message: string) {
    await runGitCommand("add .");
    try {
        await runGitCommand(`commit -m "${message}"`);
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        if (msg.includes("nothing to commit")) {
            return "Nothing to commit";
        }
        throw e;
    }
}

export async function gitPush(branch: string) {
    // In a real scenario with auth, we might need to inject the token into the remote URL
    // For this POC, we assume the environment has access or we dry-run
    // In a real scenario with auth, we might need to inject the token into the remote URL
    // For this POC, we assume the environment has access via SSH/HTTPS or we dry-run
    // if (process.env.NODE_ENV === "development" && !process.env.GITHUB_TOKEN) {
    //     console.log("Mocking Git Push in local development");
    //     return;
    // }

    // Example of using a token if provided
    // const remote = `https://${process.env.GITHUB_TOKEN}@github.com/user/repo.git`;
    // await runGitCommand(`push ${remote} ${branch}`);

    if (branch === 'main' || branch === 'master') {
        throw new Error("Direct push to protected branches is not allowed by CMS policy.");
    }

    await runGitCommand(`push origin ${branch}`);
}

export async function gitStatus() {
    return await runGitCommand("status --porcelain");
}

export async function gitCurrentBranch() {
    return await runGitCommand("rev-parse --abbrev-ref HEAD");
}
