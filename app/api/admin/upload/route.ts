
import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { isAuthenticated } from '@/lib/auth';
import { validateImageFile, generateUniqueFilename } from '@/lib/upload';

export async function POST(request: Request) {
    // Check authentication
    if (!await isAuthenticated()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Validate file
        const validation = validateImageFile(file);
        if (!validation.valid) {
            return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        // Generate unique filename
        const filename = generateUniqueFilename(file.name);
        const uploadPath = path.join(process.cwd(), 'public', 'uploads', filename);

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Save locally ONLY in development (Vercel file system is read-only/ephemeral)
        if (process.env.NODE_ENV === 'development') {
            try {
                await writeFile(uploadPath, buffer);
            } catch (fsError) {
                console.warn('Failed to save file locally:', fsError);
                // Continue, as we mainly care about Git persistence
            }
        }

        // Commit to Git using GitHub API
        const { updateFileInBranch } = await import('@/lib/github');
        const branchName = 'development';

        try {
            await updateFileInBranch(
                `public/uploads/${filename}`,
                buffer.toString('base64'),
                `Upload image: ${filename}`,
                branchName,
                true // isBase64
            );
        } catch (gitError) {
            console.error('Git commit failed:', gitError);
            throw new Error('Failed to save to GitHub');
        }

        // Return public URL and base64 preview
        const url = `/uploads/${filename}`;
        const preview = `data:${file.type};base64,${buffer.toString('base64')}`;

        return NextResponse.json({ url, filename, preview }, { status: 200 });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: `Failed to upload file: ${error instanceof Error ? error.message : String(error)}` },
            { status: 500 }
        );
    }
}
