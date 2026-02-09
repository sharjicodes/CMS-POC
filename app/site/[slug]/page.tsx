
import React from 'react';
import Link from 'next/link';
import { getContentBySlug } from '@/lib/content';

// This is a Server Component that receives params synchronously (in Next.js 14-) or async (in Next.js 15+)
// Since this project is using Next.js 16 (from package.json), params is a Promise.
export default async function PublicContentPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const content = await getContentBySlug(slug);

    return (
        <div className="min-h-screen bg-white">
            {/* Navbar */}
            <nav className="border-b border-gray-100 py-4">
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <div className="font-bold text-xl text-slate-900">My CMS Site</div>
                    <div className="space-x-4">
                        {/* Dynamic Links could go here too, but for now kept simple */}
                        <Link href="/site/home" className="text-sm text-slate-500 hover:text-blue-600 px-3">Home</Link>
                        <Link href="/site/about" className="text-sm text-slate-500 hover:text-blue-600 px-3">About</Link>
                        <Link href="/site/support" className="text-sm text-slate-500 hover:text-blue-600 px-3">Support</Link>
                        <Link href="/cms-admin" className="text-sm text-slate-500 hover:text-blue-600 border-l border-gray-200 pl-4">Admin Login</Link>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-6 text-center max-w-3xl">
                    <h1 className="text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
                        {content.title}
                    </h1>
                    <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                        {content.description}
                    </p>
                </div>
            </section>

            {/* Sections / Features */}
            {content.sections && content.sections.length > 0 && (
                <section className="py-20">
                    <div className="container mx-auto px-6">
                        <div className="grid md:grid-cols-3 gap-12">
                            {content.sections.map((section: any, idx: number) => (
                                <div key={idx} className="bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition duration-300">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6 text-blue-600 font-bold text-xl">
                                        {idx + 1}
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-800 mb-3">{section.title}</h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        {section.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-12 text-center">
                <p>&copy; 2024 Git-Based CMS. Powered by Next.js.</p>
            </footer>
        </div>
    );
}
