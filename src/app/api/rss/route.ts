import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const feedUrl = searchParams.get('url');

    if (!feedUrl) {
        return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
    }

    const parser = new Parser();

    try {
        const feed = await parser.parseURL(feedUrl);
        return NextResponse.json(feed, { status: 200 });
    } catch (error) {
        console.error('Error parsing RSS feed:', error);
        return NextResponse.json(
            { error: 'Failed to parse RSS feed' },
            { status: 500 }
        );
    }
}
