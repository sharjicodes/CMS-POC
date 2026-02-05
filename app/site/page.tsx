
import React from 'react';
import content from '@/content/home';
import Link from 'next/link';

export default function PublicSiteHome() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-100 py-4">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="font-bold text-xl text-slate-900">My CMS Site</div>
          <div className="space-x-4">
            <Link href="/cms-admin" className="text-sm text-slate-500 hover:text-blue-600">Admin Login</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <h1 className="text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
            {content.heroTitle}
          </h1>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            {content.heroDescription}
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
              Get Started
            </button>
            <button className="bg-white text-slate-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-50 transition border border-gray-200">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            {content.features.map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition duration-300">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6 text-blue-600 font-bold text-xl">
                  {idx + 1}
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-center">
        <p>&copy; 2024 Git-Based CMS. Powered by Next.js.</p>
      </footer>
    </div>
  );
}
