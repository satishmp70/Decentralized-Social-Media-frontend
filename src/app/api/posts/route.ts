import { NextRequest, NextResponse } from 'next/server';

// Temporary in-memory storage for development
const posts = new Map<number, any>();
let nextId = 1;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const wallet = searchParams.get('wallet');

  let filteredPosts = Array.from(posts.values());
  if (wallet) {
    filteredPosts = filteredPosts.filter(post => post.wallet_address === wallet);
  }

  // Sort by timestamp in descending order
  filteredPosts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return NextResponse.json(filteredPosts);
}

export async function POST(request: NextRequest) {
  const walletAddress = request.headers.get('X-Wallet-Address');
  const data = await request.json();

  if (!walletAddress) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  if (!data.content) {
    return NextResponse.json(
      { error: 'Post content is required' },
      { status: 400 }
    );
  }

  const post = {
    id: nextId++,
    content: data.content,
    wallet_address: walletAddress,
    timestamp: new Date().toISOString(),
    likes: [],
    comments: [],
  };

  posts.set(post.id, post);
  return NextResponse.json(post);
} 