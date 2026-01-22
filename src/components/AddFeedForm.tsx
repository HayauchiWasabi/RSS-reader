"use client";

import { useState } from "react";
import { useRSSStore } from "@/store/useRSSStore";
import { Plus, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function AddFeedForm() {
    const [url, setUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const addFeed = useRSSStore((state) => state.addFeed);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;

        setIsLoading(true);
        setError(null);

        try {
            // Validate by fetching
            const encodedUrl = encodeURIComponent(url);
            const res = await fetch(`/api/rss?url=${encodedUrl}`);

            if (!res.ok) {
                throw new Error("Failed to fetch RSS feed");
            }

            const data = await res.json();

            addFeed({
                url,
                title: data.title || url,
                description: data.description,
                link: data.link,
            });

            setUrl("");
        } catch (err) {
            setError("Invalid RSS URL or feed not reachable");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full max-w-lg mx-auto mb-8">
            <div className="flex gap-2">
                <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter RSS Feed URL..."
                    className={cn(
                        "flex-1 px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg",
                        "focus:outline-none focus:ring-2 focus:ring-neutral-700 focus:border-transparent",
                        "text-neutral-200 placeholder-neutral-500 transition-all"
                    )}
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading || !url}
                    className={cn(
                        "px-4 py-2 bg-neutral-100 text-neutral-900 rounded-lg font-medium",
                        "hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                        "flex items-center gap-2"
                    )}
                >
                    {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Plus className="w-4 h-4" />
                    )}
                    Add
                </button>
            </div>
            {error && (
                <div className="flex items-center gap-2 text-red-500 text-sm px-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                </div>
            )}
        </form>
    );
}
