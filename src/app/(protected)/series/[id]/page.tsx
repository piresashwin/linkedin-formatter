'use client';

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { useParams } from "next/navigation";

interface Post {
    id: string;
    name: string;
    description?: string;
    isPublished: boolean;
    publishDate?: string;
}

export default function SeriesPostsPage() {
    const { id: seriesId } = useParams();

    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchText, setSearchText] = useState("");
    const [skip, setSkip] = useState(0);
    const [take, setTake] = useState(10);
    const [totalPosts, setTotalPosts] = useState(0);

    useEffect(() => {
        async function fetchPosts() {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(
                    `/api/posts?seriesId=${seriesId}&page=${take}&pageSize=${skip}&search=${searchText}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        cache: "no-store",
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch posts");
                }

                const { data, pagination } = await response.json();
                setPosts(data);
                setTotalPosts(pagination?.totalPosts ?? 0);
            } catch (err: any) {
                setError(err.message || "An error occurred");
            } finally {
                setLoading(false);
            }
        }

        fetchPosts();
    }, [seriesId, skip, take, searchText]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
        setSkip(0); // Reset pagination when searching
    };

    const handleNextPage = () => {
        if (skip + take < totalPosts) {
            setSkip(skip + take);
        }
    };

    const handlePreviousPage = () => {
        if (skip > 0) {
            setSkip(skip - take);
        }
    };

    return (
        <div className="p-5 space-y-10">
            <header className="flex flex-row justify-between items-center">
                <div className="flex flex-col gap-1">
                    <motion.h1
                        className="text-4xl font-bold text-gray-800"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Posts in Series
                    </motion.h1>
                    <p className="text-gray-500">Manage your series and organize your posts.</p>
                </div>
                <input
                    type="text"
                    placeholder="Search by title..."
                    value={searchText}
                    onChange={handleSearch}
                    className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </header>

            {loading ? (
                <p>Loading posts...</p>
            ) : error ? (
                <p className="text-red-500">Error: {error}</p>
            ) : posts.length === 0 ? (
                <p>No posts found for this series.</p>
            ) : (
                <ul className="space-y-4">
                    {posts.map((post) => (
                        <li
                            key={post.id}
                            className="p-4 border rounded-md hover:shadow-md transition-shadow"
                        >
                            <h2 className="text-lg font-semibold">{post.name}</h2>
                            {post.description && <p className="text-gray-600">{post.description}</p>}
                            <p className="text-sm text-gray-500">
                                {post.isPublished
                                    ? `Published on ${new Date(post.publishDate || "").toLocaleDateString()}`
                                    : "Draft"}
                            </p>
                        </li>
                    ))}
                </ul>
            )}

            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={handlePreviousPage}
                    disabled={skip === 0}
                    className={`px-4 py-2 rounded-md ${skip === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                >
                    Previous
                </button>
                <p>
                    Showing {Math.min(skip + 1, totalPosts)}-{Math.min(skip + take, totalPosts)} of {totalPosts}
                </p>
                <button
                    onClick={handleNextPage}
                    disabled={skip + take >= totalPosts}
                    className={`px-4 py-2 rounded-md ${skip + take >= totalPosts
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
