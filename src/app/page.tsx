import { AddFeedForm } from "@/components/AddFeedForm";
import { FeedGrid } from "@/components/FeedGrid";
import { Rss } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-200 p-8 sm:p-12">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="flex flex-col items-center space-y-4 text-center">
          <div className="p-3 bg-neutral-900/50 rounded-2xl border border-neutral-800 shadow-2xl shadow-black/50">
            <Rss className="w-8 h-8 text-orange-500" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Minimal RSS
          </h1>
          <p className="text-neutral-500 max-w-lg">
            A minimalist, dark-mode RSS reader for your favorite feeds.
            Add a link to get started.
          </p>
        </header>

        <section className="space-y-8">
          <AddFeedForm />
          <FeedGrid />
        </section>
      </div>
    </main>
  );
}
