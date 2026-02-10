
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                router.push('/cms-admin/dashboard');
                router.refresh();
            } else {
                setError('Invalid password');
            }
        } catch {
            setError('Something went wrong');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-muted/30">
            <div className="bg-card border border-border p-8 rounded-xl shadow-lg w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-2xl mx-auto mb-4 shadow-lg shadow-primary/20">
                        C
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
                    <p className="text-muted-foreground mt-2 text-sm">Sign in to manage your content</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-foreground transition-all shadow-sm"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm text-center font-medium">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg hover:bg-primary/90 transition-all font-medium shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5 duration-200"
                    >
                        Sign In
                    </button>

                    <div className="text-center text-xs text-muted-foreground mt-6">
                        Protected by CMS Authentication
                    </div>
                </form>
            </div>
        </div>
    );
}
