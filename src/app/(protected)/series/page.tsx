"use client";

import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EllipsisVerticalIcon, PlusIcon } from "@heroicons/react/24/outline";
import { motion } from "motion/react";
import { ObjectId } from "bson";
import { desc } from "motion/react-client";
import { useEffect } from "react";
import Link from "next/link";


const seriesSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Title is required"),
    color: z.string().min(1, "Color is required"),
    emoji: z.string().min(1, "Emoji is required"),
    description: z.string().optional(),
});

type Series = z.infer<typeof seriesSchema>;

const SeriesPage = () => {
    const [series, setSeries] = useState<Series[]>([]);

    useEffect(() => {
        const fetchSeries = async () => {
            const response = await fetch("/api/series");
            const data = await response.json();
            setSeries(data?.data || []);
        };

        fetchSeries();
    }, []);

    const [editingSeries, setEditingSeries] = useState<Series | null>(null);

    const pastelColors = [
        "#6CB2EB", // Darker Blue
        "#F87171", // Darker Red
        "#A78BFA", // Darker Purple
        "#FBBF24", // Darker Yellow
        "#34D399", // Darker Green
    ];

    const emojiOptions = ["🚀", "🌿", "📚", "🎨", "💡", "🔥", "🌟", "🎉"];

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        watch,
        setValue
    } = useForm<Series>({
        resolver: zodResolver(seriesSchema),
    });

    const onError = (errors: any) => {
        debugger;
    }

    const createSeries = async (data: Series) => {
        debugger
        const newSeries = {
            id: new ObjectId().toString(),
            name: `${data.name} ${data.emoji}`,
            color: data.color,
            emoji: data.emoji,
            description: "",
        };

        // Send POST request to API
        await fetch("/api/series", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newSeries),
        });

        setSeries([...series, newSeries]);
        reset();
    };

    const updateSeries = async (id: string, updatedTitle: string) => {
        // Send PUT request to API
        await fetch(`/api/series`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, title: updatedTitle }),
        });

        setSeries(
            series.map((item) =>
                item.id === id ? { ...item, name: updatedTitle } : item
            )
        );
    };

    return (
        <div className="p-5 space-y-10">
            {/* Header */}

            <header className="flex flex-row justify-between items-center">
                <div className="flex flex-col gap-1">
                    <motion.h1
                        className="text-4xl font-bold text-gray-800"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >Series</motion.h1>
                    <p className="text-gray-500">Manage your series and organize your posts.</p>
                </div>

                {/* Create Series Button */}
                <div className="flex justify-end">
                    <Dialog.Root>
                        <Dialog.Trigger asChild>
                            <button className="cursor-pointer flex flex-row gap-2 px-4 h-10 items-center bg-black text-white rounded-lg hover:bg-gray-800">
                                <PlusIcon className="w-5 h-5" />
                                <span className="font-semibold text-md">New Series</span>
                            </button>
                        </Dialog.Trigger>
                        <Dialog.Portal>
                            <Dialog.Overlay className="fixed inset-0 bg-gray-800 opacity-50" />
                            <Dialog.Content onInteractOutside={(e) => e.preventDefault()} className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg  p-6 w-[400px]">
                                <Dialog.Title className="text-lg font-bold text-gray-800 mb-6">
                                    Create New Series
                                </Dialog.Title>
                                <form
                                    onSubmit={handleSubmit(createSeries, onError)}
                                    className="space-y-5"
                                >
                                    <div>
                                        <label className="flex flex-col gap-1">
                                            <span className="text-sm font-medium">Series Title</span>
                                            <input
                                                type="text"
                                                {...register("name")}
                                                className={`px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 ${errors.name ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
                                                    }`}
                                                placeholder="Enter Series Title"
                                            />
                                            {errors.name && <span className="text-sm text-red-500">{errors.name.message}</span>}
                                        </label>

                                    </div>
                                    <div>
                                        <label
                                            htmlFor="seriesColor"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Choose Color
                                        </label>
                                        <div className="flex space-x-2 mt-2">
                                            {pastelColors.map((color) => (
                                                <button
                                                    key={color}
                                                    type="button"
                                                    {...register("color")}
                                                    onClick={() => setValue("color", color)}
                                                    className={`w-8 h-8 rounded-full border-2 ${color === watch("color")
                                                        ? "border-black"
                                                        : "border-gray-300"
                                                        }`}
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="seriesEmoji"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Choose Emoji
                                        </label>
                                        <div className="flex space-x-2 mt-2">
                                            {emojiOptions.map((emoji) => (
                                                <button
                                                    key={emoji}
                                                    type="button"
                                                    {...register("emoji")}
                                                    onClick={() => setValue("emoji", emoji)}
                                                    className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${emoji === watch("emoji")
                                                        ? "border-black"
                                                        : "border-gray-300"
                                                        }`}
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex justify-end space-x-2 mt-10">
                                        <Dialog.Close asChild>
                                            <button
                                                type="button"
                                                className="px-4 py-1.5 border border-gray-700 text-gray-700 rounded-lg hover:bg-gray-300"
                                            >
                                                Cancel
                                            </button>
                                        </Dialog.Close>
                                        <button
                                            type="submit"
                                            className="px-4 py-1.5 bg-black text-white  rounded-lg hover:bg-gray-800"
                                        >
                                            Create
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Content>
                        </Dialog.Portal>
                    </Dialog.Root>
                </div>

            </header>



            {/* Series Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {series.map((item, index) => (
                    <motion.div
                        key={item.id}
                        className="relative flex items-center justify-center h-32 rounded-lg shadow-md text-white font-bold text-lg group"
                        style={{ backgroundColor: item.color }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                    >
                        {item.name}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => setEditingSeries(item)}
                                className="p-1 bg-gray-800 text-white rounded-full hover:bg-gray-700"
                            >
                                <EllipsisVerticalIcon className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link
                                href={`/series/${item.id}`}
                                className="p-1 bg-gray-800 text-white rounded-full hover:bg-gray-700"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </Link>
                        </div>
                    </motion.div>
                ))}

                {series.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-5 rounded-lg border-2 border-dashed border-gray-300 text-gray-500">
                        📂
                        <p className="text-sm">No series available. Create a new series to get started!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SeriesPage;