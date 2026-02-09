'use client';

import { use, useEffect, useState } from 'react';
import { Loader2, Send, FileText } from 'lucide-react';
import ImageUpload from '@/app/cms-admin/components/ImageUpload';
// import type { HomePageContent } from '@/content/home'; // Type is dynamic now

export default function EditContentPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [content, setContent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetch(`/api/admin/content/${slug}`)
            .then(res => {
                if (!res.ok) throw new Error("Failed to load content");
                return res.json();
            })
            .then(data => {
                if (data.error) throw new Error(data.error);
                setContent(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setMessage({ type: 'error', text: err.message });
                setLoading(false);
            });
    }, [slug]);

    const handleUpdate = (field: string, value: any) => {
        if (!content) return;
        setContent({ ...content, [field]: value });
    };

    const handleNestedUpdate = (parentField: string, index: number, childField: string, value: string) => {
        if (!content) return;
        const list = [...content[parentField]];
        list[index] = { ...list[index], [childField]: value };
        setContent({ ...content, [parentField]: list });
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        setMessage(null);
        try {
            const res = await fetch('/api/admin/content/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slug, ...content }),
            });
            const data = await res.json();

            if (data.success) {
                setMessage({
                    type: 'success',
                    text: `Changes saved! PR Created: ${data.prUrl || 'Check GitHub'}`
                });
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to update' });
            }
        } catch {
            setMessage({ type: 'error', text: 'Network error' });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-slate-400" /></div>;
    if (!content) return <div className="p-8 text-red-500">Error: {message?.text || "Could not load content"}</div>;

    // Helper to render fields dynamically based on type
    const renderFields = () => {
        return Object.keys(content).map((key) => {
            const value = content[key];
            const type = typeof value;

            if (Array.isArray(value)) {
                // Assume array of objects for features/sections
                return (
                    <section key={key} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
                        <h2 className="text-xl font-semibold mb-4 text-slate-800 capitalize">{key}</h2>
                        <div className="grid gap-6">
                            {value.map((item: any, idx: number) => (
                                <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    {Object.keys(item).map((subKey) => (
                                        <div key={subKey} className="mb-3">
                                            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">{subKey}</label>
                                            <input
                                                type="text"
                                                value={item[subKey]}
                                                onChange={(e) => handleNestedUpdate(key, idx, subKey, e.target.value)}
                                                className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none text-slate-900 bg-white"
                                            />
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </section>
                );
            }

            if (type === 'string') {
                // Check if this is an image field (contains 'image', 'icon', 'photo', or starts with /uploads/)
                const isImageField = key.toLowerCase().includes('image') ||
                    key.toLowerCase().includes('icon') ||
                    key.toLowerCase().includes('photo') ||
                    value.startsWith('/uploads/');

                if (isImageField) {
                    return (
                        <div key={key} className="mb-6">
                            <ImageUpload
                                label={key.replace(/([A-Z])/g, ' $1').trim()}
                                value={value}
                                onChange={(url) => handleUpdate(key, url)}
                            />
                        </div>
                    );
                }

                const isLong = value.length > 50;
                return (
                    <div key={key} className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                        {isLong ? (
                            <textarea
                                value={value}
                                onChange={(e) => handleUpdate(key, e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none h-24 text-slate-900"
                            />
                        ) : (
                            <input
                                type="text"
                                value={value}
                                onChange={(e) => handleUpdate(key, e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
                            />
                        )}
                    </div>
                );
            }

            return null; // Skip unsupported types for now
        });
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 capitalize">Edit {slug}</h1>
                    <p className="text-slate-500 mt-1">Make changes and submit for review.</p>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition disabled:opacity-50"
                >
                    {submitting ? <Loader2 className="animate-spin w-4 h-4" /> : <Send className="w-4 h-4" />}
                    Submit for Review
                </button>
            </div>

            {message && (
                <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {message.text}
                </div>
            )}

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                {renderFields()}
            </div>
        </div>
    );
}
