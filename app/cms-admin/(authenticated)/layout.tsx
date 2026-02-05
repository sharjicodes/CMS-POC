
import React from 'react';
import Link from 'next/link';
import { Lock, FileText, LogOut } from 'lucide-react';
import { isAuthenticated } from '@/lib/auth';
import { redirect } from 'next/navigation';

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
                    <Link href="/cms-admin/dashboard" className="flex items-center gap-3 p-2 bg-slate-800 rounded hover:bg-slate-700 transition">
                        <FileText className="w-5 h-5" />
                        <span>Home Page</span>
                    </Link>
                    {/* Add more links here */}
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
