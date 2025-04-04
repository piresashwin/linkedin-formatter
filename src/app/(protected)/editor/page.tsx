'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { CheckIcon, ClipboardIcon } from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { string_to_unicode_variant as toUnicodeVariant } from "string-to-unicode-variant";

const schema = z.object({
    post: z.string().min(1, "Post cannot be empty"),
});

type FormData = z.infer<typeof schema>;

export default function LinkedInPostFormatter() {
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { post: "" }
    });

    const [copied, setCopied] = useState(false);

    const onFormat = (variants: ("bold" | "italic" | "monospace" | "script" | "strikethrough" | "underline")[]) => {
        const textarea = document.getElementById("postTextarea") as HTMLTextAreaElement;
        if (!textarea) return;

        const { selectionStart, selectionEnd } = textarea;
        const currentText = watch("post");

        if (selectionStart !== null && selectionEnd !== null && selectionStart !== selectionEnd) {
            const selectedText = currentText.slice(selectionStart, selectionEnd);

            // Apply each variant sequentially
            const formattedText = variants.reduce((text, variant) => {
                return toUnicodeVariant(text, variant, [
                    variant === "strikethrough" ? "strike" : "",
                    variant === "underline" ? "underline" : "",
                ]);
            }, selectedText);

            const updatedText = currentText.slice(0, selectionStart) + formattedText + currentText.slice(selectionEnd);
            setValue("post", updatedText);
        }
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(watch("post"));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const characterCount = watch("post").length;
    const characterLimit = 3000;

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 border rounded-md shadow-md">
            <div className="p-4">
                <form onSubmit={handleSubmit(data => console.log(data))} className="space-y-4">
                    <textarea
                        id="postTextarea"
                        {...register("post")}
                        rows={8}
                        className="w-full p-2 text-base rounded-md border"
                        placeholder="Write your LinkedIn post here..."
                    />
                    {errors.post && <p className="text-red-500 text-sm">{errors.post.message}</p>}
                    <div className="flex gap-2 flex-wrap">
                        <button
                            type="button"
                            onClick={() => onFormat(["bold"])}
                            className="px-4 py-2 bg-gray-200 rounded-md"
                        >
                            Bold
                        </button>
                        <button
                            type="button"
                            onClick={() => onFormat(["italic"])}
                            className="px-4 py-2 bg-gray-200 rounded-md"
                        >
                            Italic
                        </button>
                        <button
                            type="button"
                            onClick={() => onFormat(["bold", "italic"])}
                            className="px-4 py-2 bg-gray-200 rounded-md"
                        >
                            Bold + Italic
                        </button>
                        <button
                            type="button"
                            onClick={() => onFormat(["monospace"])}
                            className="px-4 py-2 bg-gray-200 rounded-md"
                        >
                            Monospace
                        </button>
                        <button
                            type="button"
                            onClick={() => onFormat(["script"])}
                            className="px-4 py-2 bg-gray-200 rounded-md"
                        >
                            Script
                        </button>
                        <button
                            type="button"
                            onClick={() => onFormat(["strikethrough"])}
                            className="px-4 py-2 bg-gray-200 rounded-md"
                        >
                            Strikethrough
                        </button>
                        <button
                            type="button"
                            onClick={() => onFormat(["underline"])}
                            className="px-4 py-2 bg-gray-200 rounded-md"
                        >
                            Underline
                        </button>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        type="button"
                                        onClick={handleCopy}
                                        className="px-4 py-2 border rounded-md flex items-center"
                                    >
                                        {copied ? (
                                            <>
                                                <CheckIcon className="w-5 h-5 mr-1 text-green-500" /> Copied!
                                            </>
                                        ) : (
                                            <>
                                                <ClipboardIcon className="w-5 h-5 mr-1" /> Copy
                                            </>
                                        )}
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>Copy formatted post</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <p className={`text-sm ${characterCount > characterLimit ? 'text-red-600' : 'text-gray-500'}`}>
                        {characterCount}/{characterLimit} characters
                    </p>
                    <div className="border rounded-md p-4 mt-2 bg-gray-50">
                        <p className="text-sm text-gray-700">Preview:</p>
                        <p className="mt-2 whitespace-pre-wrap text-base">{watch("post")}</p>
                    </div>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Save Post</button>
                </form>
            </div>
        </div>
    );
}