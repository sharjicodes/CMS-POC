'use client';

import { use, useEffect, useState } from 'react';
import { Loader2, Save, ArrowLeft, MoreHorizontal, FileText, Image as ImageIcon, Type, Layout, Plus, Trash2 } from 'lucide-react';
import ImageUpload from '@/app/cms-admin/components/ImageUpload';
import Link from 'next/link';

export default function EditContentPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [content, setContent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [newFieldName, setNewFieldName] = useState('');

    // State for adding fields to a specific item [sectionKey, itemIndex]
    const [activeAddItem, setActiveAddItem] = useState<{ section: string, index: number } | null>(null);
    const [newItemFieldName, setNewItemFieldName] = useState('');

    // New: Add field to a specific item in a section
    const handleNestedAddField = (sectionKey: string, index: number, type: 'text' | 'image') => {
        if (!content || !newItemFieldName.trim()) return;

        const list = [...content[sectionKey]];
        const item = { ...list[index] };

        let key = newItemFieldName.trim();
        key = key.replace(/[^a-zA-Z0-9]/g, '');
        if (!key) return;

        if (type === 'image' && !key.toLowerCase().includes('image') && !key.toLowerCase().includes('icon') && !key.toLowerCase().includes('photo')) {
            key += 'Image';
        }

        if (item.hasOwnProperty(key)) {
            alert('Field matches existing key in this item.');
            return;
        }

        item[key] = ""; // Initial empty string (image url or text)

        list[index] = item;
        setContent({ ...content, [sectionKey]: list });
        setNewItemFieldName('');
        setActiveAddItem(null);
    };

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

    const handleAddItem = (sectionKey: string) => {
        if (!content) return;
        const list = [...(content[sectionKey] || [])];
        // Default generic item structure
        list.push({ title: 'New Item', description: '' });
        setContent({ ...content, [sectionKey]: list });
    };

    const handleRemoveItem = (sectionKey: string, index: number) => {
        if (!content) return;
        const list = [...content[sectionKey]];
        list.splice(index, 1);
        setContent({ ...content, [sectionKey]: list });
    };

    const handleAddField = (type: 'text' | 'image' | 'section') => {
        if (!content) return;

        if (!newFieldName.trim()) {
            // Should be handled by disabled button, but safe guard
            return;
        }

        let key = newFieldName.trim();

        // Sanitize key (camelCaseish)
        key = key.replace(/[^a-zA-Z0-9]/g, '');
        if (!key) return;

        // Enforce naming convention for images so the renderer detects them
        if (type === 'image' && !key.toLowerCase().includes('image') && !key.toLowerCase().includes('icon') && !key.toLowerCase().includes('photo')) {
            key += 'Image';
        }

        if (content.hasOwnProperty(key)) {
            alert('Field with this name already exists.');
            return;
        }

        let initialValue: any = "";
        if (type === 'section') initialValue = [];

        setContent({ ...content, [key]: initialValue });
        setNewFieldName('');
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
                                <div key={idx} className="p-5 bg-card hover:bg-muted/20 rounded-xl border border-border shadow-sm transition-all duration-200 relative group/item">
                                    <button
                                        onClick={() => handleRemoveItem(key, idx)}
                                        className="absolute top-4 right-4 text-muted-foreground hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity"
                                        title="Remove Item"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>

                                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/50">
                                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Item {idx + 1}</span>
                                    </div>
                                    <div className="grid gap-4">
                                        {Object.keys(item).map((subKey) => {
                                            const isNestedImage = subKey.toLowerCase().includes('image') ||
                                                subKey.toLowerCase().includes('icon') ||
                                                subKey.toLowerCase().includes('photo');

                                            return (
                                                <div key={subKey}>
                                                    <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide flex items-center gap-1">
                                                        {isNestedImage ? <ImageIcon className="w-3 h-3" /> : <Type className="w-3 h-3" />}
                                                        {subKey}
                                                    </label>
                                                    {isNestedImage ? (
                                                        <div className="border border-dashed border-border p-3 rounded-lg bg-muted/10">
                                                            <ImageUpload
                                                                label=""
                                                                value={item[subKey]}
                                                                onChange={(url) => handleNestedUpdate(key, idx, subKey, url)}
                                                            />
                                                        </div>
                                                    ) : item[subKey].length > 60 ? (
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
                                            );
                                        })}
                                    </div>

                                    {/* Add Property to Item UI */}
                                    <div className="mt-4 pt-3 border-t border-dashed border-border/50">
                                        {activeAddItem?.section === key && activeAddItem?.index === idx ? (
                                            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                                                <input
                                                    type="text"
                                                    autoFocus
                                                    placeholder="Property name (e.g. Icon)..."
                                                    value={newItemFieldName}
                                                    onChange={(e) => setNewItemFieldName(e.target.value)}
                                                    className="flex-1 px-3 py-1.5 text-xs bg-background border border-border rounded outline-none focus:border-primary transition"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Escape') {
                                                            setActiveAddItem(null);
                                                            setNewItemFieldName('');
                                                        }
                                                    }}
                                                />
                                                <button
                                                    onClick={() => handleNestedAddField(key, idx, 'text')}
                                                    disabled={!newItemFieldName.trim()}
                                                    className="px-2 py-1.5 text-xs font-medium bg-muted hover:bg-muted/80 rounded border border-border transition-colors disabled:opacity-50"
                                                >
                                                    + Text
                                                </button>
                                                <button
                                                    onClick={() => handleNestedAddField(key, idx, 'image')}
                                                    disabled={!newItemFieldName.trim()}
                                                    className="px-2 py-1.5 text-xs font-medium bg-muted hover:bg-muted/80 rounded border border-border transition-colors disabled:opacity-50"
                                                >
                                                    + Image
                                                </button>
                                                <button
                                                    onClick={() => { setActiveAddItem(null); setNewItemFieldName(''); }}
                                                    className="p-1.5 text-muted-foreground hover:text-foreground"
                                                >
                                                    <span className="sr-only">Cancel</span>
                                                    <div className="rotate-45"><Plus className="w-4 h-4" /></div>
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => { setActiveAddItem({ section: key, index: idx }); setNewItemFieldName(''); }}
                                                className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
                                            >
                                                <Plus className="w-3 h-3" /> Add Property
                                            </button>
                                        )}
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

                {/* Inline Action Bar */}
                <div className="mt-8 pt-8 border-t border-dashed border-border">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Add New Content Field</p>
                    <div className="flex flex-col md:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="Enter field name (e.g. Subtitle, Banner)..."
                            value={newFieldName}
                            onChange={(e) => setNewFieldName(e.target.value)}
                            className="flex-1 px-4 py-3 bg-background border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                        />
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleAddField('section')}
                                disabled={!newFieldName.trim()}
                                className="flex items-center gap-2 px-4 py-3 bg-muted hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed text-foreground border border-border rounded-lg transition-all font-medium"
                            >
                                <Layout className="w-4 h-4 text-primary" />
                                Add Section
                            </button>

                            <button
                                onClick={() => handleAddField('text')}
                                disabled={!newFieldName.trim()}
                                className="flex items-center gap-2 px-4 py-3 bg-muted hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed text-foreground border border-border rounded-lg transition-all font-medium"
                            >
                                <Type className="w-4 h-4 text-primary" />
                                Add Text
                            </button>

                            <button
                                onClick={() => handleAddField('image')}
                                disabled={!newFieldName.trim()}
                                className="flex items-center gap-2 px-4 py-3 bg-muted hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed text-foreground border border-border rounded-lg transition-all font-medium"
                            >
                                <ImageIcon className="w-4 h-4 text-primary" />
                                Add Image
                            </button>
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        * Enter a name first, then click a button to insert the field.
                    </p>
                </div>
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
