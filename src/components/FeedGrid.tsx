"use client";

import { useEffect, useState, useMemo } from "react";
import { useRSSStore, Article } from "@/store/useRSSStore";
import { FeedCard } from "./FeedCard";
import { Loader2, Inbox, Filter, Bookmark, Heart, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

type FilterType = "all" | "read-later" | "favorites";

export function FeedGrid() {
    const { feeds, articleStates } = useRSSStore();
    const [articles, setArticles] = useState<(Article & { feedTitle: string })[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeFilter, setActiveFilter] = useState<FilterType>("all");
    const [selectedFeedUrl, setSelectedFeedUrl] = useState<string>("all");

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
                            feedUrl: feed.url, // Add feed URL for filtering
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

    const filteredArticles = useMemo(() => {
        return articles.filter((article) => {
            // 1. Filter by Type (Read Later / Favorites)
            if (activeFilter === "read-later") {
                if (!article.link || !articleStates[article.link]?.isReadLater) return false;
            }
            if (activeFilter === "favorites") {
                if (!article.link || !articleStates[article.link]?.isFavorite) return false;
            }

            // 2. Filter by Feed
            if (selectedFeedUrl !== "all") {
                // We need to match the feed source.
                // Since we attached feedUrl securely in the fetch step (simulated by extending the type locally technically)
                // Let's coerce the type check for now as we added it to the object.
                if ((article as any).feedUrl !== selectedFeedUrl) return false;
            }

            return true;
        });
    }, [articles, activeFilter, selectedFeedUrl, articleStates]);

    if (feeds.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-neutral-500 border border-neutral-900 bg-neutral-950/50 rounded-2xl border-dashed">
                <Inbox className="w-12 h-12 mb-4 opacity-50" />
                <p className="text-lg font-medium">No feeds added yet</p>
                <p className="text-sm">Add an RSS URL above to get started</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-neutral-900/30 p-4 rounded-xl border border-neutral-800/50">
                <div className="flex gap-2 p-1 bg-neutral-900 rounded-lg border border-neutral-800">
                    <button
                        onClick={() => setActiveFilter("all")}
                        className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                            activeFilter === "all" ? "bg-neutral-800 text-white" : "text-neutral-500 hover:text-neutral-300"
                        )}
                    >
                        <LayoutGrid className="w-4 h-4" />
                        All
                    </button>
                    <button
                        onClick={() => setActiveFilter("read-later")}
                        className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                            activeFilter === "read-later" ? "bg-blue-900/30 text-blue-400" : "text-neutral-500 hover:text-neutral-300"
                        )}
                    >
                        <Bookmark className="w-4 h-4" />
                        Read Later
                    </button>
                    <button
                        onClick={() => setActiveFilter("favorites")}
                        className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                            activeFilter === "favorites" ? "bg-red-900/30 text-red-400" : "text-neutral-500 hover:text-neutral-300"
                        )}
                    >
                        <Heart className="w-4 h-4" />
                        Favorites
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-neutral-500" />
                    <select
                        value={selectedFeedUrl}
                        onChange={(e) => setSelectedFeedUrl(e.target.value)}
                        className="bg-neutral-900 border border-neutral-800 text-neutral-300 text-sm rounded-lg focus:ring-neutral-700 focus:border-neutral-700 block p-2"
                    >
                        <option value="all">All Feeds</option>
                        {feeds.map(feed => (
                            <option key={feed.url} value={feed.url}>{feed.title || feed.url}</option>
                        ))}
                    </select>
                </div>
            </div>

            {isLoading && articles.length === 0 ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-neutral-500" />
                </div>
            ) : (
                <>
                    {filteredArticles.length === 0 ? (
                        <div className="text-center py-20 text-neutral-500">
                            <p>No articles found confirming to filters.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredArticles.map((article, index) => (
                                <FeedCard key={`${article.link}-${index}`} article={article} feedTitle={article.feedTitle} />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
