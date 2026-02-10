
import React from 'react';
import Link from 'next/link';
import { Lock, FileText } from 'lucide-react';
import { isAuthenticated } from '@/lib/auth';
import { redirect } from 'next/navigation';
import SidebarLinks from '@/app/cms-admin/components/SidebarLinks';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const isAuth = await isAuthenticated();

    if (!isAuth) {
        redirect('/cms-admin/login');
    }

    return (
        <div className="flex min-h-screen bg-muted/30">
            {/* Sidebar */}
            <aside className="w-64 bg-background border-r border-border fixed h-full flex flex-col">
                <div className="p-6 border-b border-border/50">
                    <div className="flex items-center gap-3 text-xl font-bold text-foreground tracking-tight">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
                            <Lock className="w-4 h-4" />
                        </div>
                        <span>Admin CMS</span>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">Content</div>
                    {/* Dynamic Links */}
                    <SidebarLinks />

                    <div className="pt-6 mt-6 border-t border-border/50">
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">System</div>
                        <Link href="/cms-admin/dashboard" className="flex items-center gap-3 p-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors">
                            <span className="w-5 h-5 flex items-center justify-center"><FileText className="w-4 h-4" /></span>
                            Dashboard
                        </Link>
                    </div>
                </nav>

                <div className="p-4 border-t border-border bg-muted/20">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs ring-2 ring-background">
                            A
                        </div>
                        <div className="text-sm">
                            <div className="font-medium text-foreground">Admin User</div>
                            <div className="text-xs text-muted-foreground">admin@example.com</div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8 md:p-12 max-w-7xl mx-auto">
                {children}
            </main>
        </div>
    );
}
