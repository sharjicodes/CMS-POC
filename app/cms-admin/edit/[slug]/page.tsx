'use client';

import { use, useEffect, useState } from 'react';
import { Loader2, Save, ArrowLeft, MoreHorizontal, FileText, Image as ImageIcon, Type } from 'lucide-react';
import ImageUpload from '@/app/cms-admin/components/ImageUpload';
import Link from 'next/link';

export default function EditContentPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [content, setContent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Auto-dismiss success message
    useEffect(() => {
        if (message?.type === 'success') {
            const timer = setTimeout(() => setMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

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
                    text: `Changes saved successfully! A pull request has been created/updated.`
                });
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to update' });
            }
        } catch {
            setMessage({ type: 'error', text: 'Network error. Please try again.' });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="flex items-center justify-center h-[50vh]"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>;
    if (!content) return <div className="p-8 text-red-500 bg-red-50 rounded-lg">Error: {message?.text || "Could not load content"}</div>;

    // Helper to render fields dynamically based on type
    const renderFields = () => {
        return Object.keys(content).map((key) => {
            const value = content[key];
            const type = typeof value;

            if (Array.isArray(value)) {
                // Assume array of objects for features/sections
                return (
                    <section key={key} className="space-y-4 pt-4 border-t border-border mt-8 first:mt-0 first:border-0 first:pt-0">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-foreground capitalize flex items-center gap-2">
                                <FileText className="w-4 h-4 text-primary" />
                                {key}
                            </h2>
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">{value.length} items</span>
                        </div>

                        <div className="grid gap-4">
                            {value.map((item: any, idx: number) => (
                                <div key={idx} className="p-5 bg-card hover:bg-muted/20 rounded-xl border border-border shadow-sm transition-all duration-200">
                                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/50">
                                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Item {idx + 1}</span>
                                        <button className="text-muted-foreground hover:text-foreground">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="grid gap-4">
                                        {Object.keys(item).map((subKey) => (
                                            <div key={subKey}>
                                                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">{subKey}</label>
                                                {item[subKey].length > 60 ? (
                                                    <textarea
                                                        value={item[subKey]}
                                                        onChange={(e) => handleNestedUpdate(key, idx, subKey, e.target.value)}
                                                        className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition text-sm min-h-[80px]"
                                                    />
                                                ) : (
                                                    <input
                                                        type="text"
                                                        value={item[subKey]}
                                                        onChange={(e) => handleNestedUpdate(key, idx, subKey, e.target.value)}
                                                        className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition text-sm"
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                );
            }

            if (type === 'string') {
                // Image Fields
                const isImageField = key.toLowerCase().includes('image') ||
                    key.toLowerCase().includes('icon') ||
                    key.toLowerCase().includes('photo') ||
                    value.startsWith('/uploads/');

                if (isImageField) {
                    return (
                        <div key={key} className="mb-8 p-5 bg-muted/10 rounded-xl border border-dashed border-border hover:border-primary/50 transition">
                            <div className="flex items-center gap-2 mb-4">
                                <ImageIcon className="w-4 h-4 text-primary" />
                                <label className="text-sm font-medium text-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                            </div>
                            <ImageUpload
                                label="" // Label handled above
                                value={value}
                                onChange={(url) => handleUpdate(key, url)}
                            />
                        </div>
                    );
                }

                // Text Fields
                const isLong = value.length > 50;
                return (
                    <div key={key} className="mb-6">
                        <label className="text-sm font-medium text-foreground mb-2 capitalize flex items-center gap-2">
                            <Type className="w-3 h-3 text-muted-foreground" />
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                        {isLong ? (
                            <textarea
                                value={value}
                                onChange={(e) => handleUpdate(key, e.target.value)}
                                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-foreground min-h-[120px] shadow-sm transition-all placeholder:text-muted-foreground/50"
                                placeholder={`Enter ${key}...`}
                            />
                        ) : (
                            <input
                                type="text"
                                value={value}
                                onChange={(e) => handleUpdate(key, e.target.value)}
                                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-foreground shadow-sm transition-all"
                            />
                        )}
                    </div>
                );
            }

            return null;
        });
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            {/* Sticky Header */}
            <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border mb-8 -mx-8 px-8 py-4 flex items-center justify-between transition-all">
                <div className="flex items-center gap-4">
                    <Link href="/cms-admin/dashboard" className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-foreground capitalize tracking-tight">{slug} Page</h1>
                        <p className="text-xs text-muted-foreground">Draft mode • {submitting ? 'Saving...' : 'Unsaved changes'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
                        Discard
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg font-medium transition-all shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5"
                    >
                        {submitting ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                        {submitting ? 'Saving...' : 'Save & Publish'}
                    </button>
                </div>
            </header>

            {message && (
                <div className={`p-4 rounded-xl mb-6 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-green-500/10 text-green-700 border border-green-200' : 'bg-red-500/10 text-red-700 border border-red-200'}`}>
                    <div className={`mt-0.5 w-2 h-2 rounded-full ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                    <p className="text-sm font-medium">{message.text}</p>
                </div>
            )}

            <div className="bg-card rounded-xl shadow-sm border border-border p-6 md:p-8">
                {renderFields()}
            </div>

            <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground">
                    Changes are automatically saved to a dedicated branch.
                    <br />
                    Submitting creates a Pull Request for review.
                </p>
            </div>
        </div>
    );
}
