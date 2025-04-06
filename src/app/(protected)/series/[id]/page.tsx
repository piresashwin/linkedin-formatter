import { prisma } from "@/prisma";
import { notFound } from "next/navigation";

export default async function SeriesPostsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: seriesId } = await params;

    // Fetch posts for the given seriesId
    const posts = await prisma.post.findMany({
        where: { seriesId },
        orderBy: { dateCreated: "desc" },
    });


    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 border rounded-md shadow-md">
            <h1 className="text-2xl font-bold mb-4">Posts in Series</h1>
            {posts.length === 0 ? (
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

                    {posts.length === 0 && (
                        <div className="text-center mt-10">
                            <p className="text-gray-500 mb-4">No posts found in this series.</p>
                            <button
                                onClick={() => alert("Redirect to create post page")}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Create New Post
                            </button>
                        </div>
                    )}
                </ul>
            )}
        </div>
    );
}
