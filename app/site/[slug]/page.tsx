
import React from 'react';
import Link from 'next/link';
import { getContentBySlug } from '@/lib/content';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default async function PublicContentPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const content = await getContentBySlug(slug);

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
                <div className="container mx-auto px-6 h-16 flex justify-between items-center">
                    <div className="font-bold text-xl tracking-tight flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
                            C
                        </div>
                        <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                            CMS Site
                        </span>
                    </div>
                    <div className="hidden md:flex items-center space-x-1">
                        <NavLink href="/site/home">Home</NavLink>
                        <NavLink href="/site/about">About</NavLink>
                        <NavLink href="/site/products">Products</NavLink>
                        <NavLink href="/site/support">Support</NavLink>
                    </div>
                    <Link
                        href="/cms-admin"
                        className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-full hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                    >
                        Admin Login
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent -z-10" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] rounded-full -z-10" />

                <div className="container mx-auto px-6 text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border text-xs font-medium text-muted-foreground mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        Live Preview
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-foreground text-balance animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                        {content.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed text-balance animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        {content.description}
                    </p>

                    {content.heroImage && (
                        <div className="relative max-w-4xl mx-auto mt-12 animate-in fade-in zoom-in duration-1000 delay-300">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-30"></div>
                            <img
                                src={content.heroImage}
                                alt={content.title}
                                className="relative rounded-xl border border-border shadow-2xl w-full h-auto object-cover"
                            />
                        </div>
                    )}
                </div>
            </section>

            {/* Sections / Features */}
            {content.sections && content.sections.length > 0 && (
                <section className="py-24 bg-muted/30">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold tracking-tight mb-4">Everything you need</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Discover the powerful features that make our platform stand out from the rest.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {content.sections.map((section: any, idx: number) => (
                                <div
                                    key={idx}
                                    className="group relative bg-background p-8 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
                                >
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform duration-300">
                                        {/* Ideally we'd map icons here, but using number fallback for now */}
                                        <span className="font-bold text-xl">{idx + 1}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                                        {section.title}
                                        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary" />
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {section.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="bg-background border-t border-border py-12">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-sm text-muted-foreground">
                        &copy; 2024 Git-Based CMS. Built with <span className="text-primary">Next.js</span>.
                    </div>
                    <div className="flex gap-6">
                        <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
                        <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
                        <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Twitter</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="text-sm font-medium text-muted-foreground hover:text-foreground px-4 py-2 rounded-full hover:bg-muted transition-colors"
        >
            {children}
        </Link>
    );
}
