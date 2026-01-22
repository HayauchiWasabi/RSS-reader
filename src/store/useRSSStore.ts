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

interface RSSStore {
    feeds: Feed[];
    addFeed: (feed: Feed) => void;
    removeFeed: (url: string) => void;
    // Future actions
    // toggleFavorite: (articleLink: string) => void;
}

export const useRSSStore = create<RSSStore>()(
    persist(
        (set) => ({
            feeds: [],
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
        }),
        {
            name: 'rss-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
