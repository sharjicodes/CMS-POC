
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
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white p-6">
                <div className="flex items-center gap-2 mb-8 text-xl font-bold">
                    <Lock className="w-6 h-6" />
                    <span>Admin CMS</span>
                </div>

                <nav className="space-y-4">
                    {/* Dynamic Links */}
                    <SidebarLinks />
                </nav>

                <div className="absolute bottom-6">
                    <div className="flex items-center gap-3 text-slate-400 text-sm">
                        <span>User: Admin</span>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    );
}
