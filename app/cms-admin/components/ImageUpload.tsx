
'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    label?: string;
}

export default function ImageUpload({ value, onChange, label }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [localPreview, setLocalPreview] = useState(value);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync localPreview with value if value changes (e.g. initial load or parent update)
    // But ONLY if we are not currently showing a base64 preview that correlates to the new value
    // Actually, simple sync is fine. If parent passes new value, we show it.
    // The "preview" trick works because parent updates 'value' to '/uploads/foo.jpg'.
    // We want to show 'base64' INSTEAD of '/uploads/foo.jpg' if we just uploaded it.
    // So:
    useEffect(() => {
        // If value matches the "remote" url of our local preview, keep local preview.
        // But how do we know?
        // Let's just say: only update localPreview from value if value is NOT empty.
        // And if we just uploaded, we manually set localPreview to data.preview (base64).
        // The issue is: React Strict Mode or re-renders might reset it.
        // Let's try: If value differs from the URL version of localPreview... tough.

        // Simpler: If we have a base64 localPreview, keep it.
        if (localPreview && localPreview.startsWith('data:')) {
            // Keep it?
            // What if user navigates away and back?
            // It will reset to 'value'.
        } else {
            setLocalPreview(value);
        }
    }, [value]);

    // Better logic: 
    // We want to display `localPreview` if it exists, otherwise `value`.
    // When upload finishes, `localPreview` = base64. `onChange` = /path.
    // Parent passes back `value` = /path.
    // `useEffect` sees `value` changed. Sets `localPreview` = /path? NO.
    // We want `localPreview` to STAY base64.

    // Revised approach:
    // Render `src={localPreview || value}`.
    // `useEffect` updates `localPreview` = `value` ONLY if `value` changes AND `value` is not the same as what we just uploaded?
    // This is getting complicated.

    // Simplest working Vercel fix:
    // 1. Upload.
    // 2. setLocalPreview(base64).
    // 3. onChange(path).
    // 4. Component renders. value is path. localPreview is base64.
    // 5. Render logic: use localPreview.

    // When does localPreview get reset?
    // When `value` changes to something completely different?
    // Let's use `key` on the component in parent? No.

    // Let's just rely on: 
    // Initial state: `localPreview = value`.
    // If `value` changes, we update `localPreview` UNLESS `localPreview` is a data URL?
    // No, if `value` changes because we navigated to a DIFFERENT record, we must update.

    // Let's trying removing the useEffect and just initializing state.
    // If parent updates `value` (e.g. network refresh), we might be out of sync.
    // But for this "Single Page App" form, it should be fine.
    // Wait, if `value` comes from `use('params')` async fetch... initial value is null/empty.
    // Then it populates.
    // So we need useEffect.

    // Correct logic:
    // useEffect(() => { if (value !== localPreview && !localPreview?.startsWith('data:')) setLocalPreview(value); }, [value]);
    // This prevents overwriting the base64 preview with the (broken) path url.

    useEffect(() => {
        // If we have a Base64 image, assume it's the fresh upload and don't overwrite it with the 404 URL
        const isBase64 = localPreview?.startsWith('data:');
        if (!isBase64) {
            setLocalPreview(value);
        }
    }, [value]); // Remove localPreview from deps to avoid loop

    const handleUpload = async (file: File) => {
        setUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/admin/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Upload failed');
            }

            const data = await response.json();

            // Should we set preview here? 
            // We need a local state for preview that overrides 'value' until value changes externally?
            // Actually, we can just assume if we have a preview, we show it.
            // But 'value' prop might update.
            // Let's simplify: onChange(url) will update the parent. Parent re-renders this component with new value.
            // PROB: On Vercel, 'url' is 404.
            // FIX: We need internal state 'localPreview' initialized to 'value', but updated with 'data.preview'.

            setLocalPreview(data.preview || data.url);
            onChange(data.url);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleUpload(file);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            handleUpload(file);
        } else {
            setError('Please drop an image file');
        }
    };

    const handleRemove = () => {
        onChange('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-2">
            {label && <label className="block text-sm font-medium text-foreground">{label}</label>}

            {localPreview || value ? (
                <div className="relative inline-block group">
                    <div className="relative rounded-lg overflow-hidden border border-border shadow-sm">
                        <img
                            src={localPreview || value}
                            alt="Uploaded"
                            className="max-w-xs max-h-64 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="bg-red-500/90 text-white rounded-full p-2 hover:bg-red-600 hover:scale-110 transition-all shadow-lg"
                                title="Remove image"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`
                        border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200
                        ${dragActive
                            ? 'border-primary bg-primary/5 scale-[1.02]'
                            : 'border-border hover:border-primary/50 hover:bg-muted/30'
                        }
                        ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={uploading}
                    />

                    {uploading ? (
                        <div className="flex flex-col items-center gap-3">
                            <div className="p-3 bg-primary/10 rounded-full">
                                <Loader2 className="w-6 h-6 text-primary animate-spin" />
                            </div>
                            <p className="text-sm font-medium text-muted-foreground">Uploading image...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-3">
                            <div className={`p-3 rounded-full transition-colors ${dragActive ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'}`}>
                                <Upload className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-foreground">
                                    Click or drag image to upload
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    PNG, JPG, WEBP (max 5MB)
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {error && (
                <p className="text-sm font-medium text-red-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                    {error}
                </p>
            )}
        </div>
    );
}
