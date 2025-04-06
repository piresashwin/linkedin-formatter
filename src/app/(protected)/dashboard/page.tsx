"use client";

import { motion } from "motion/react";
import { useSession } from "next-auth/react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const DashboardPage = () => {
    const { data: session } = useSession();

    console.log(session);

    // Mock data for stats and charts
    const stats = {
        totalPosts: 120,
        totalSeries: 15,
        totalPublished: 85,
    };

    const streakData = [
        { day: "Mon", posts: 2 },
        { day: "Tue", posts: 3 },
        { day: "Wed", posts: 1 },
        { day: "Thu", posts: 4 },
        { day: "Fri", posts: 2 },
        { day: "Sat", posts: 0 },
        { day: "Sun", posts: 5 },
    ];

    const weeklyData = [
        { week: "Week 1", posts: 10 },
        { week: "Week 2", posts: 15 },
        { week: "Week 3", posts: 8 },
        { week: "Week 4", posts: 12 },
    ];

    const categoryData = [
        { category: "Tech", posts: 40 },
        { category: "Lifestyle", posts: 30 },
        { category: "Education", posts: 20 },
        { category: "Health", posts: 10 },
    ];

    const recentDrafts = [
        { id: 1, title: "Draft Post 1", date: "2025-04-01" },
        { id: 2, title: "Draft Post 2", date: "2025-03-30" },
        { id: 3, title: "Draft Post 3", date: "2025-03-28" },
        { id: 4, title: "Draft Post 4", date: "2025-03-25" },
        { id: 5, title: "Draft Post 5", date: "2025-03-20" },
    ];

    return (
        <div className="p-5 space-y-8">
            {/* Header */}
            <header className="flex flex-row justify-between items-center">
                <div className="flex flex-col gap-1">
                    <motion.h1
                        className="text-4xl font-bold text-gray-800"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Dashboard
                    </motion.h1>
                    <p className="text-gray-500">Welcome back, {session?.user?.name || "User"}!</p>
                </div>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-5 text-center">
                    <h2 className="text-2xl font-bold text-gray-800">{stats.totalPosts}</h2>
                    <p className="text-gray-500">Total Posts</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-5 text-center">
                    <h2 className="text-2xl font-bold text-gray-800">{stats.totalSeries}</h2>
                    <p className="text-gray-500">Total Series</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-5 text-center">
                    <h2 className="text-2xl font-bold text-gray-800">{stats.totalPublished}</h2>
                    <p className="text-gray-500">Total Published</p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Streak Chart */}
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Writing Streak</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={streakData}>
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="posts" stroke="#aaa" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Weekly Posts Chart */}
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Posts Created Weekly</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={weeklyData}>
                            <XAxis dataKey="week" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="posts" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Posts Per Category Chart */}
                <div className="bg-white border border-gray-200 rounded-lg p-5 col-span-1 md:col-span-2">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Posts Per Category</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={categoryData}>
                            <XAxis dataKey="category" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="posts" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Drafts */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Drafts</h3>
                <ul className="space-y-2">
                    {recentDrafts.map((draft) => (
                        <li key={draft.id} className="flex justify-between items-center">
                            <span className="text-gray-800">{draft.title}</span>
                            <span className="text-gray-500 text-sm">{draft.date}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default DashboardPage;