# Minimal RSS Reader

A minimalist, dark-mode RSS reader built with Next.js, Zustand, and Tailwind CSS.

![RSS Reader Screenshot](/Users/kaiikeda/.gemini/antigravity/brain/3e4fae60-a6f8-4a84-8c54-3c6c73550731/rss_feed_grid_1769057127544.png)

## Features

- 📰 **RSS Feed Management**: Add and manage multiple RSS/Atom feeds
- 🎨 **Minimalist Dark Mode**: Clean, modern UI with dark theme
- 🔖 **Tagging System**: Mark articles as "Read Later" or "Favorite"
- 🔍 **Advanced Filtering**: Filter by tags or specific feeds
- 💾 **Persistent Storage**: All data saved to LocalStorage via Zustand
- 🚀 **Fast & Responsive**: Built with Next.js 15 and Turbopack

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) with persist middleware
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **RSS Parsing**: [rss-parser](https://github.com/rbren/rss-parser)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Date Formatting**: [date-fns](https://date-fns.org/)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd rss-reader
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Adding Feeds

1. Enter an RSS/Atom feed URL in the input field (e.g., `https://qiita.com/popular-items/feed.atom`)
2. Click the "Add" button
3. Articles will appear in the grid below

### Tagging Articles

- Click the **Bookmark** icon to mark an article as "Read Later"
- Click the **Heart** icon to mark an article as "Favorite"

### Filtering

Use the filter bar to view:
- **All**: All articles from all feeds
- **Read Later**: Only bookmarked articles
- **Favorites**: Only favorited articles
- **By Feed**: Select a specific feed from the dropdown

## Project Structure

```
src/
├── app/
│   ├── api/rss/route.ts    # RSS proxy API endpoint
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Main page
│   └── globals.css          # Global styles
├── components/
│   ├── AddFeedForm.tsx      # Feed registration form
│   ├── FeedCard.tsx         # Article card with actions
│   └── FeedGrid.tsx         # Grid with filtering logic
├── store/
│   └── useRSSStore.ts       # Zustand store
└── lib/
    └── utils.ts             # Utility functions
```

## API Routes

### `GET /api/rss?url=<feed-url>`

Fetches and parses an RSS feed, bypassing CORS restrictions.

**Query Parameters:**
- `url` (required): The RSS/Atom feed URL

**Response:**
```json
{
  "title": "Feed Title",
  "description": "Feed Description",
  "items": [
    {
      "title": "Article Title",
      "link": "https://...",
      "pubDate": "2026-01-22T...",
      "contentSnippet": "Article preview..."
    }
  ]
}
```

## Data Persistence

All data is stored in the browser's LocalStorage:
- **Feeds**: List of registered RSS URLs
- **Article States**: Read Later and Favorite tags per article

## Development

### Build for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Future Enhancements

- [ ] Grid layout customization (columns per row)
- [ ] Additional tag types
- [ ] Search functionality
- [ ] Export/import feed lists
- [ ] PWA support

## License

MIT

## Acknowledgments

Built with modern web technologies for a fast, minimal RSS reading experience.
