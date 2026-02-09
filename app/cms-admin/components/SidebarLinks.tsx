
import Link from 'next/link';
import { FileText } from 'lucide-react';
import fs from 'fs/promises';
import path from 'path';

// This component runs on the server, so we can access fs directly to build the menu
export default async function SidebarLinks() {
    let slugs: string[] = [];
    try {
        const contentDir = path.join(process.cwd(), "content");
        const files = await fs.readdir(contentDir);
        slugs = files
            .filter(file => file.endsWith(".ts") || file.endsWith(".tsx"))
            .map(file => file.replace(/\.tsx?$/, ""));
    } catch (e) {
        console.error("Failed to read content dir for sidebar", e);
    }

    return (
        <div className="space-y-1">
            {slugs.map(slug => (
                <Link
                    key={slug}
                    href={`/cms-admin/edit/${slug}`}
                    className="flex items-center gap-3 p-2 bg-slate-800 rounded hover:bg-slate-700 transition capitalize"
                >
                    <FileText className="w-5 h-5" />
                    <span>{slug}</span>
                </Link>
            ))}
        </div>
    );
}
