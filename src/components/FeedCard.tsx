"use client";

import { Article } from "@/store/useRSSStore";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink, Clock, Radio } from "lucide-react";

interface FeedCardProps {
    article: Article;
    feedTitle?: string;
}

export function FeedCard({ article, feedTitle }: FeedCardProps) {
    const date = article.pubDate
        ? formatDistanceToNow(new Date(article.pubDate), { addSuffix: true })
        : "";

    return (
        <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group block p-5 bg-neutral-900/50 border border-neutral-800 rounded-xl hover:border-neutral-600 hover:bg-neutral-900 transition-all duration-200 h-full flex flex-col"
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

            {/* Future: Tags or Actions Area */}
            <div className="mt-auto pt-4 border-t border-neutral-800/50 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs text-neutral-500 font-medium flex items-center gap-1">
                    Read more <ExternalLink className="w-3 h-3" />
                </span>
            </div>
        </a>
    );
}
