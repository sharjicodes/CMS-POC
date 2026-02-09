
'use client';

export default function Dashboard() {
    return (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <h1 className="text-4xl font-bold text-slate-800 mb-4">Welcome to CMS Admin</h1>
            <p className="text-slate-500 text-lg max-w-md">
                Select a content file from the sidebar to start editing.
            </p>
        </div>
    );
}
