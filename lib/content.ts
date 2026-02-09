
import { notFound } from 'next/navigation';
import path from 'path';
import fs from 'fs';

// Helper type matching the content structure
export interface PageContent {
    title: string;
    description: string;
    heroImage?: string;
    sections: {
        title: string;
        description: string;
    }[];
}

/**
 * Loads content for a given slug dynamically.
 * Uses native dynamic import() which works in Next.js Server Components.
 */
export async function getContentBySlug(slug: string): Promise<PageContent> {
    try {
        // Prevent directory traversal
        const safeSlug = slug.replace(/[^a-zA-Z0-9-_]/g, '');

        // Check if file exists first to avoid module not found error crashing everything
        // Note: import() would throw MODULE_NOT_FOUND, we can catch that too.
        // But let's be explicit.
        const filePath = path.join(process.cwd(), 'content', `${safeSlug}.ts`);
        if (!fs.existsSync(filePath)) {
            notFound(); // Next.js 404
        }

        const mod = await import(`@/content/${safeSlug}`);
        return mod.default;
    } catch (e: any) {
        if (e.code === 'ENOENT' || e.message.includes('Cannot find module')) {
            notFound();
        }
        console.error(`Error loading content for slug ${slug}:`, e);
        throw e;
    }
}
