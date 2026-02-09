
'use client';

import { useState, useRef } from 'react';
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
    const fileInputRef = useRef<HTMLInputElement>(null);

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
            {label && <label className="block text-sm font-medium text-slate-700">{label}</label>}

            {value ? (
                <div className="relative inline-block">
                    <img
                        src={value}
                        alt="Uploaded"
                        className="max-w-xs max-h-48 rounded-lg border border-slate-200"
                    />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`
                        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition
                        ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-slate-400'}
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
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                            <p className="text-sm text-slate-600">Uploading...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <Upload className="w-8 h-8 text-slate-400" />
                            <p className="text-sm text-slate-600">
                                Click or drag image to upload
                            </p>
                            <p className="text-xs text-slate-400">
                                PNG, JPG, WEBP, GIF (max 5MB)
                            </p>
                        </div>
                    )}
                </div>
            )}

            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}
