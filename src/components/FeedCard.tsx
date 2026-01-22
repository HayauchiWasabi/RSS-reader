"use client";

import { Article, useRSSStore } from "@/store/useRSSStore";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink, Clock, Radio, Bookmark, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeedCardProps {
    article: Article;
    feedTitle?: string;
}

export function FeedCard({ article, feedTitle }: FeedCardProps) {
    const date = article.pubDate
        ? formatDistanceToNow(new Date(article.pubDate), { addSuffix: true })
        : "";

    const { articleStates, toggleReadLater, toggleFavorite } = useRSSStore();
    const state = article.link ? articleStates[article.link] : undefined;
    const isReadLater = state?.isReadLater;
    const isFavorite = state?.isFavorite;

    const handleAction = (e: React.MouseEvent, action: () => void) => {
        e.preventDefault();
        e.stopPropagation();
        action();
    };

    return (
        <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group block p-5 bg-neutral-900/50 border border-neutral-800 rounded-xl hover:border-neutral-600 hover:bg-neutral-900 transition-all duration-200 h-full flex flex-col relative"
        >
            <div className="flex items-center gap-2 mb-3 text-xs text-neutral-500">
                {feedTitle && (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-neutral-800/50 border border-neutral-800">
                        <Radio className="w-3 h-3 text-orange-400" />
                        <span className="truncate max-w-[150px]">{feedTitle}</span>
                    </div>
                )}
                {date && (
                    <div className="flex items-center gap-1 ml-auto">
                        <Clock className="w-3 h-3" />
                        <span>{date}</span>
                    </div>
                )}
            </div>

            <h3 className="text-lg font-semibold text-neutral-200 mb-2 group-hover:text-white line-clamp-2 leading-tight">
                {article.title}
            </h3>

            {article.contentSnippet && (
                <p className="text-sm text-neutral-400 line-clamp-3 mb-4 flex-1">
                    {article.contentSnippet}
                </p>
            )}

            <div className="mt-auto pt-4 border-t border-neutral-800/50 flex justify-between items-center">
                <div className="flex gap-2">
                    {article.link && (
                        <>
                            <button
                                onClick={(e) => handleAction(e, () => toggleReadLater(article.link!))}
                                className={cn(
                                    "p-2 rounded-full transition-colors hover:bg-neutral-800",
                                    isReadLater ? "text-blue-400" : "text-neutral-500"
                                )}
                                title="Read Later"
                            >
                                <Bookmark className={cn("w-4 h-4", isReadLater && "fill-current")} />
                            </button>
                            <button
                                onClick={(e) => handleAction(e, () => toggleFavorite(article.link!))}
                                className={cn(
                                    "p-2 rounded-full transition-colors hover:bg-neutral-800",
                                    isFavorite ? "text-red-400" : "text-neutral-500"
                                )}
                                title="Favorite"
                            >
                                <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
                            </button>
                        </>
                    )}
                </div>

                <span className="text-xs text-neutral-500 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Read more <ExternalLink className="w-3 h-3" />
                </span>
            </div>
        </a>
    );
}
