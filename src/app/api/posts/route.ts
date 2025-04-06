import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { ObjectId } from "bson";
import { prisma } from "@/prisma";

// Create a new post
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, description, content, isPublished, publishDate, releaseDate, userId } = body;

        if (!name || !content || !userId) {
            return NextResponse.json({ error: "Name, content, and userId are required" }, { status: 400 });
        }

        const newPost = await prisma.post.create({
            data: {
                id: new ObjectId().toString(), // Generate a new ID for the post
                name,
                description,
                content,
                isPublished: isPublished || false,
                publishDate,
                releaseDate,
                userId,
            },
        });

        return NextResponse.json(newPost, { status: 201 });
    } catch (error) {
        console.error("Error creating post:", error);
        return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
    }
}

// Get all posts or a specific post by ID
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    try {
        if (id) {
            const post = await prisma.post.findUnique({
                where: { id },
            });

            if (!post) {
                return NextResponse.json({ error: "Post not found" }, { status: 404 });
            }

            return NextResponse.json(post, { status: 200 });
        } else {
            const allPosts = await prisma.post.findMany();
            return NextResponse.json(allPosts, { status: 200 });
        }
    } catch (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
    }
}

// Update a post by ID
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, name, description, content, isPublished, publishDate, releaseDate } = body;

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        const updatedPost = await prisma.post.update({
            where: { id },
            data: {
                name,
                description,
                content,
                isPublished,
                publishDate,
                releaseDate,
            },
        });

        return NextResponse.json(updatedPost, { status: 200 });
    } catch (error) {
        console.error("Error updating post:", error);
        return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
    }
}

// Delete a post by ID
export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    try {
        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        await prisma.post.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Post deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting post:", error);
        return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
    }
}