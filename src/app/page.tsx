'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { Navigation } from '@/components/Navigation';
import { CreatePost } from '@/components/CreatePost';
import { Post } from '@/components/Post';
import api from '@/lib/axios';

interface PostData {
  id: number;
  content: string;
  wallet_address: string;
  timestamp: string;
  likes: { wallet_address: string }[];
  comments: {
    id: number;
    content: string;
    wallet_address: string;
    timestamp: string;
  }[];
}

interface ActionState {
  type: 'create' | 'like' | 'comment';
  postId?: number;
  isPending: boolean;
  error: string | null;
}

export default function Home() {
  const { address, isConnected } = useAccount();
  const [posts, setPosts] = useState<PostData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionState, setActionState] = useState<ActionState | null>(null);

  useEffect(() => {
    if (address) {
      (window as any).walletAddress = address;
      setError(null);
    } else {
      delete (window as any).walletAddress;
    }
  }, [address]);

  const fetchPosts = useCallback(async () => {
    try {
      const response = await api.get('/posts');
      setPosts(response.data);
      setError(null);
    } catch (error: any) {
      console.error('Error fetching posts:', error);
      setError(error.message || 'Failed to fetch posts. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleCreatePost = async (content: string) => {
    if (!isConnected) {
      setError('Please connect your wallet to create posts');
      return;
    }

    setActionState({ type: 'create', isPending: true, error: null });
    try {
      const response = await api.post('/posts', { content });
      setPosts((prevPosts) => [response.data, ...prevPosts]);
      setError(null);
    } catch (error: any) {
      console.error('Error creating post:', error);
      setError(error.message || 'Failed to create post. Please try again later.');
    } finally {
      setActionState(null);
    }
  };

  const handleLike = async (postId: number) => {
    if (!isConnected) {
      setError('Please connect your wallet to like posts');
      return;
    }

    setActionState({ type: 'like', postId, isPending: true, error: null });
    try {
      // Optimistic update
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id === postId) {
            const hasLiked = post.likes.some((like) => like.wallet_address === address);
            return {
              ...post,
              likes: hasLiked
                ? post.likes.filter((like) => like.wallet_address !== address)
                : [...post.likes, { wallet_address: address! }],
            };
          }
          return post;
        })
      );

      await api.post(`/posts/${postId}/likes`);
      await fetchPosts(); // Refresh to ensure consistency
      setError(null);
    } catch (error: any) {
      console.error('Error liking post:', error);
      setError(error.message || 'Failed to like post. Please try again later.');
      // Revert optimistic update
      await fetchPosts();
    } finally {
      setActionState(null);
    }
  };

  const handleComment = async (postId: number, content: string) => {
    if (!isConnected) {
      setError('Please connect your wallet to comment on posts');
      return;
    }

    setActionState({ type: 'comment', postId, isPending: true, error: null });
    try {
      await api.post(`/posts/${postId}/comments`, { content });
      await fetchPosts(); // Refresh posts to get updated comments
      setError(null);
    } catch (error: any) {
      console.error('Error commenting on post:', error);
      setError(error.message || 'Failed to comment on post. Please try again later.');
    } finally {
      setActionState(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <main className="max-w-2xl mx-auto py-8 px-4">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        {isConnected && <CreatePost onSubmit={handleCreatePost} />}
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Post
                key={post.id}
                {...post}
                onLike={handleLike}
                onComment={handleComment}
                isConnected={isConnected}
                isActionPending={
                  actionState?.isPending &&
                  actionState.postId === post.id &&
                  (actionState.type === 'like' || actionState.type === 'comment')
                }
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
} 