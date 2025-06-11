import { NextRequest, NextResponse } from 'next/server';

// Temporary in-memory storage for development
const users = new Map<string, any>();

export async function GET(
  request: NextRequest,
  { params }: { params: { wallet: string } }
) {
  const wallet = params.wallet;
  
  // If user doesn't exist, return a default profile
  if (!users.has(wallet)) {
    return NextResponse.json({
      wallet_address: wallet,
      username: null,
      bio: null,
      profile_pic_url: null,
    });
  }

  return NextResponse.json(users.get(wallet));
}

export async function POST(
  request: NextRequest,
  { params }: { params: { wallet: string } }
) {
  const wallet = params.wallet;
  const data = await request.json();

  // Update or create user profile
  users.set(wallet, {
    wallet_address: wallet,
    ...data,
  });

  return NextResponse.json(users.get(wallet));
} 