
'use client';

import { useEffect, useState } from 'react';
import { Loader2, Save, Send } from 'lucide-react';
import type { HomePageContent } from '@/content/home';

export default function Dashboard() {
    const [content, setContent] = useState<HomePageContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetch('/api/admin/content')
            .then(res => res.json())
            .then(data => {
                if (data.error) throw new Error(data.error);
                setContent(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleUpdate = (field: string, value: any) => {
        if (!content) return;
        setContent({ ...content, [field]: value });
    };

    const handleFeatureUpdate = (index: number, field: string, value: string) => {
        if (!content) return;
        const newFeatures = [...content.features];
        newFeatures[index] = { ...newFeatures[index], [field]: value };
        setContent({ ...content, features: newFeatures });
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        setMessage(null);
        try {
            const res = await fetch('/api/admin/content/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(content),
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
        } catch (err) {
            setMessage({ type: 'error', text: 'Network error' });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-slate-400" /></div>;
    if (!content) return <div>Error loading content</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Edit Home Page</h1>
                    <p className="text-slate-500 mt-1">Make changes and submit for review. Edits will go to a new branch.</p>
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

            <div className="space-y-6">
                {/* Hero Section */}
                <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-semibold mb-4 text-slate-800">Hero Section</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Hero Title</label>
                            <input
                                type="text"
                                value={content.heroTitle}
                                onChange={(e) => handleUpdate('heroTitle', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Hero Description</label>
                            <textarea
                                value={content.heroDescription}
                                onChange={(e) => handleUpdate('heroDescription', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none h-24 text-slate-900"
                            />
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-semibold mb-4 text-slate-800">Features</h2>

                    <div className="grid gap-6">
                        {content.features.map((feature, idx) => (
                            <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="mb-3">
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Feature Title</label>
                                    <input
                                        type="text"
                                        value={feature.title}
                                        onChange={(e) => handleFeatureUpdate(idx, 'title', e.target.value)}
                                        className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none text-slate-900 bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Description</label>
                                    <input
                                        type="text"
                                        value={feature.description}
                                        onChange={(e) => handleFeatureUpdate(idx, 'description', e.target.value)}
                                        className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none text-slate-900 bg-white"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
