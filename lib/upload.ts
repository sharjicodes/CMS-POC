
import path from 'path';

// Allowed image types
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB (Vercel limit is ~4.5MB)

export interface UploadValidationResult {
    valid: boolean;
    error?: string;
}

/**
 * Validate uploaded image file
 */
export function validateImageFile(file: File): UploadValidationResult {
    // Check file type
    if (!ALLOWED_TYPES.includes(file.type)) {
        return {
            valid: false,
            error: `Invalid file type. Allowed: ${ALLOWED_TYPES.join(', ')}`
        };
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
        return {
            valid: false,
            error: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`
        };
    }

    return { valid: true };
}

/**
 * Generate unique filename with timestamp
 */
export function generateUniqueFilename(originalName: string): string {
    const timestamp = Date.now();
    const sanitized = originalName
        .toLowerCase()
        .replace(/[^a-z0-9.-]/g, '-')
        .replace(/-+/g, '-');

    const ext = path.extname(sanitized);
    const nameWithoutExt = path.basename(sanitized, ext);

    return `${timestamp}-${nameWithoutExt}${ext}`;
}

/**
 * Get file extension from mimetype
 */
export function getExtensionFromMimeType(mimeType: string): string {
    const map: Record<string, string> = {
        'image/jpeg': '.jpg',
        'image/jpg': '.jpg',
        'image/png': '.png',
        'image/webp': '.webp',
        'image/gif': '.gif'
    };
    return map[mimeType] || '.jpg';
}
