"use client";

import { useEffect, useState } from "react";
import { useRSSStore, Article, Feed } from "@/store/useRSSStore";
import { FeedCard } from "./FeedCard";
import { Loader2, Inbox } from "lucide-react";

export function FeedGrid() {
    const feeds = useRSSStore((state) => state.feeds);
    const [articles, setArticles] = useState<(Article & { feedTitle: string })[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchAllFeeds = async () => {
            if (feeds.length === 0) {
                setArticles([]);
                return;
            }

            setIsLoading(true);
            try {
                const promises = feeds.map(async (feed) => {
                    try {
                        const res = await fetch(`/api/rss?url=${encodeURIComponent(feed.url)}`);
                        if (!res.ok) return [];
                        const data = await res.json();
                        const items = (data.items || []).map((item: any) => ({
                            ...item,
                            feedTitle: feed.title || data.title,
                        }));
                        return items;
                    } catch (e) {
                        console.error(`Failed to fetch feed: ${feed.url}`, e);
                        return [];
                    }
                });

                const results = await Promise.all(promises);
                const allArticles = results.flat();

                // Sort by date (newest first)
                allArticles.sort((a, b) => {
                    const dateA = new Date(a.pubDate || 0).getTime();
                    const dateB = new Date(b.pubDate || 0).getTime();
                    return dateB - dateA;
                });

                setArticles(allArticles);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllFeeds();
    }, [feeds]);

    if (feeds.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-neutral-500 border border-neutral-900 bg-neutral-950/50 rounded-2xl border-dashed">
                <Inbox className="w-12 h-12 mb-4 opacity-50" />
                <p className="text-lg font-medium">No feeds added yet</p>
                <p className="text-sm">Add an RSS URL above to get started</p>
            </div>
        );
    }

    if (isLoading && articles.length === 0) {
        return (
            <div className="flex justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-neutral-500" />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {articles.map((article, index) => (
                <FeedCard key={`${article.link}-${index}`} article={article} feedTitle={article.feedTitle} />
            ))}
        </div>
    );
}
