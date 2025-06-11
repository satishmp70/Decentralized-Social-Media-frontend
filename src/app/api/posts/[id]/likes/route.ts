import { NextRequest, NextResponse } from 'next/server';

// Temporary in-memory storage for development
const posts = new Map<number, any>();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const postId = parseInt(params.id);
  const walletAddress = request.headers.get('X-Wallet-Address');

  if (!walletAddress) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  const post = posts.get(postId);
  if (!post) {
    return NextResponse.json(
      { error: 'Post not found' },
      { status: 404 }
    );
  }

  // Check if already liked
  const existingLike = post.likes.find(
    (like: any) => like.wallet_address === walletAddress
  );

  if (existingLike) {
    // Unlike
    post.likes = post.likes.filter(
      (like: any) => like.wallet_address !== walletAddress
    );
  } else {
    // Like
    post.likes.push({ wallet_address: walletAddress });
  }

  posts.set(postId, post);
  return NextResponse.json(post);
} 