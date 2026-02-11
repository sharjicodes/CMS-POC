'use client';

import Link from 'next/link';
import { FileText, Users, Activity, ExternalLink, Plus } from 'lucide-react';

export default function Dashboard() {
    return (
        <div className="max-w-5xl mx-auto p-8 md:p-12">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
                <p className="text-slate-500 mt-2">Welcome back, Admin. Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <StatCard
                    title="Total Pages"
                    value="4"
                    icon={<FileText className="w-5 h-5 text-blue-600" />}
                    trend="+1 this week"
                />
                <StatCard
                    title="Active Users"
                    value="1,234"
                    icon={<Users className="w-5 h-5 text-green-600" />}
                    trend="+12% growth"
                />
                <StatCard
                    title="API Requests"
                    value="45.2k"
                    icon={<Activity className="w-5 h-5 text-purple-600" />}
                    trend="Stable"
                />
            </div>

            {/* Quick Actions & Recent */}
            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="font-semibold text-slate-900 mb-4 flex items-center justify-between">
                        Quick Actions
                    </h3>
                    <div className="space-y-3">
                        <Link href="/cms-admin/edit/home" className="flex items-center p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors group">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                                <FileText className="w-4 h-4" />
                            </div>
                            <span className="font-medium text-slate-700">Edit Home Page</span>
                            <ExternalLink className="w-4 h-4 text-slate-400 ml-auto" />
                        </Link>
                        <Link href="/cms-admin/edit/about" className="flex items-center p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors group">
                            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                                <FileText className="w-4 h-4" />
                            </div>
                            <span className="font-medium text-slate-700">Edit About Page</span>
                            <ExternalLink className="w-4 h-4 text-slate-400 ml-auto" />
                        </Link>
                        <Link href="/cms-admin/edit/products" className="flex items-center p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors group">
                            <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                                <FileText className="w-4 h-4" />
                            </div>
                            <span className="font-medium text-slate-700">Edit Products Page</span>
                            <ExternalLink className="w-4 h-4 text-slate-400 ml-auto" />
                        </Link>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-xl shadow-lg text-white flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-xl mb-2">CMS Documentation</h3>
                        <p className="text-blue-100 mb-6">Learn how to manage your content effectively using the Git-based workflow.</p>
                    </div>
                    <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium self-start hover:bg-blue-50 transition-colors">
                        View Guide
                    </button>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, trend }: { title: string, value: string, icon: React.ReactNode, trend: string }) {
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <h4 className="text-2xl font-bold text-slate-900 mt-1">{value}</h4>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
            </div>
            <div className="flex items-center text-sm">
                <span className="text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full text-xs">
                    {trend}
                </span>
            </div>
        </div>
    );
}
