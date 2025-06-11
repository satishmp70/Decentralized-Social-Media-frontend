import { NextRequest, NextResponse } from 'next/server';

// Temporary in-memory storage for development
const posts = new Map<number, any>();
let nextCommentId = 1;

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const postId = parseInt(params.id);
  const walletAddress = request.headers.get('X-Wallet-Address');
  const { content } = await request.json();

  if (!walletAddress) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  if (!content) {
    return NextResponse.json(
      { error: 'Comment content is required' },
      { status: 400 }
    );
  }

  const post = posts.get(postId);
  if (!post) {
    return NextResponse.json(
      { error: 'Post not found' },
      { status: 404 }
    );
  }

  const comment = {
    id: nextCommentId++,
    content,
    wallet_address: walletAddress,
    timestamp: new Date().toISOString(),
  };

  post.comments.push(comment);
  posts.set(postId, post);
  return NextResponse.json(post);
} 