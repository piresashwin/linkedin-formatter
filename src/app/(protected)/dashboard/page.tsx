"use client";

import { signOut, useSession } from "next-auth/react"

const DashboardPage = () => {
    const { data: session } = useSession()

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 text-white flex flex-col">
                <div className="p-4 text-lg font-bold border-b border-gray-700">
                    Dashboard
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <a href="#" className="block px-4 py-2 rounded hover:bg-gray-700">
                        Series
                    </a>
                    <a href="#" className="block px-4 py-2 rounded hover:bg-gray-700">
                        Settings
                    </a>
                </nav>
                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="m-4 px-4 py-2 bg-red-600 rounded hover:bg-red-700"
                >
                    Logout
                </button>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="flex items-center justify-between p-4 bg-gray-100 border-b border-gray-300">
                    <h1 className="text-xl font-bold">Welcome to the Dashboard</h1>
                    {session?.user ? (
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700">{session.user.name}</span>
                            <img
                                src={session.user.image || "/default-avatar.png"}
                                alt="Profile"
                                className="w-10 h-10 rounded-full border border-gray-300"
                            />
                        </div>
                    ) : (
                        <span>Loading...</span>
                    )}
                </header>

                {/* Body Content */}
                <main className="flex-1 flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold">Hello, {session?.user?.name || "User"}!</h2>
                        <p className="text-gray-600 mt-2">
                            This is your dashboard. Use the sidebar to navigate.
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardPage;