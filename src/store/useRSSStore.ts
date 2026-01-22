import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Feed = {
    url: string;
    title?: string;
    description?: string;
    link?: string;
    tags?: string[]; // Future use: ['favorite', 'read-later']
};

export type Article = {
    title?: string;
    link?: string;
    pubDate?: string;
    contentSnippet?: string;
    feedTitle?: string;
    isReadLater?: boolean; // Future use
    isFavorite?: boolean; // Future use
};

export type ArticleState = {
    isReadLater: boolean;
    isFavorite: boolean;
};

interface RSSStore {
    feeds: Feed[];
    articleStates: Record<string, ArticleState>; // Key: Article Link URL
    addFeed: (feed: Feed) => void;
    removeFeed: (url: string) => void;
    toggleReadLater: (articleLink: string) => void;
    toggleFavorite: (articleLink: string) => void;
}

export const useRSSStore = create<RSSStore>()(
    persist(
        (set) => ({
            feeds: [],
            articleStates: {},
            addFeed: (feed) =>
                set((state) => {
                    if (state.feeds.some((f) => f.url === feed.url)) {
                        return state;
                    }
                    return { feeds: [...state.feeds, feed] };
                }),
            removeFeed: (url) =>
                set((state) => ({
                    feeds: state.feeds.filter((f) => f.url !== url),
                })),
            toggleReadLater: (link) =>
                set((state) => {
                    const current = state.articleStates[link] || { isReadLater: false, isFavorite: false };
                    return {
                        articleStates: {
                            ...state.articleStates,
                            [link]: { ...current, isReadLater: !current.isReadLater },
                        },
                    };
                }),
            toggleFavorite: (link) =>
                set((state) => {
                    const current = state.articleStates[link] || { isReadLater: false, isFavorite: false };
                    return {
                        articleStates: {
                            ...state.articleStates,
                            [link]: { ...current, isFavorite: !current.isFavorite },
                        },
                    };
                }),
        }),
        {
            name: 'rss-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
