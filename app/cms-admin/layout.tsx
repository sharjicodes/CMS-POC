
import React from 'react';
import Link from 'next/link';
import { Lock, FileText, LogOut } from 'lucide-react';
import { isAuthenticated } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const isAuth = await isAuthenticated();

    // If not authenticated and not on login page, we handle it in the page/component or middleware.
    // But here we can't easily check the current path in server layout without headers hack.
    // Instead, we'll let the pages handle redirection or check auth here if we assume this layout is protected.
    // Exception: Login page uses this layout? Maybe not.
    // If Login page is under `app/cms-admin/login`, it shares this layout.
    // We should create a separate layout for dashboard or handle auth check carefully.

    // Strategy:
    // 1. If accessing /cms-admin/login, we might not want the sidebar.
    // 2. If accessing /cms-admin/dashboard, we want sidebar + auth check.

    // So:
    // - app/cms-admin/layout.tsx -> Shell for everything under cms-admin?
    // - app/cms-admin/login/page.tsx -> Should probably NOT have the sidebar.
    // - app/cms-admin/(authenticated)/layout.tsx -> Sidebar + Auth Check.

    // Refactoring plan inline:
    // I'll make this layout generic, but content pages will be protected.
    // Actually, simplest is:
    // - `app/cms-admin/layout.tsx`: minimal root.
    // - `app/cms-admin/(protected)/layout.tsx`: Sidebar + Auth.
    // - `app/cms-admin/login/page.tsx`: Standalone.

    // For POC simplicity: I'll check auth in this layout. If failed, and not login... 
    // Wait, I can't know if it's login page easily here.

    // Let's stick to: `app/cms-admin/layout.tsx` is the PROTECTED layout. 
    // `app/cms-admin/login` should be `app/cms-login` OR I just use a Route Group to opt out.
    // Plan:
    // `app/cms-admin/layout.tsx` -> Protected Sidebar Layout.
    // `app/cms-admin/login/page.tsx` -> Move to `app/login/page.tsx` ??
    // No, user said `/cms-admin`.

    // OK, I will put `layout.tsx` in `app/cms-admin` that simply renders children.
    // I will create `app/cms-admin/(main)/layout.tsx` for the sidebar and protection.
    // `app/cms-admin/login` will be outside `(main)`.

    return (
        <div className="min-h-screen bg-gray-50">
            {children}
        </div>
    );
}
