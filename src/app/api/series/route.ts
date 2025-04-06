import { NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { ObjectId } from "bson";

// Create a new series
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, description, cover, userId } = body;

        if (!name || !userId) {
            return NextResponse.json({ error: "Name and userId are required" }, { status: 400 });
        }

        const newSeries = await prisma.series.create({
            data: {
                id: new ObjectId().toString(), // Generate a new ID for the series
                name,
                description,
                cover,
                userId,
                totalPosts: 0,
                totalDraftPosts: 0,
                totalPublishedPosts: 0,
            },
        });

        return NextResponse.json(newSeries, { status: 201 });
    } catch (error) {
        console.error("Error creating series:", error);
        return NextResponse.json({ error: "Failed to create series" }, { status: 500 });
    }
}

// Get all series or a specific series by ID
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    try {
        if (id) {
            const series = await prisma.series.findUnique({
                where: { id },
            });

            if (!series) {
                return NextResponse.json({ error: "Series not found" }, { status: 404 });
            }

            return NextResponse.json(series, { status: 200 });
        } else {
            const allSeries = await prisma.series.findMany();
            return NextResponse.json(allSeries, { status: 200 });
        }
    } catch (error) {
        console.error("Error fetching series:", error);
        return NextResponse.json({ error: "Failed to fetch series" }, { status: 500 });
    }
}

// Update a series by ID
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, name, description, cover } = body;

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        const updatedSeries = await prisma.series.update({
            where: { id },
            data: {
                name,
                description,
                cover,
            },
        });

        return NextResponse.json(updatedSeries, { status: 200 });
    } catch (error) {
        console.error("Error updating series:", error);
        return NextResponse.json({ error: "Failed to update series" }, { status: 500 });
    }
}

// Delete a series by ID
export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    try {
        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        await prisma.series.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Series deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting series:", error);
        return NextResponse.json({ error: "Failed to delete series" }, { status: 500 });
    }
}