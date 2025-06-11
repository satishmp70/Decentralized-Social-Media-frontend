'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { formatDistanceToNow } from 'date-fns';

interface PostProps {
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
  onLike: (postId: number) => Promise<void>;
  onComment: (postId: number, content: string) => Promise<void>;
  isConnected: boolean;
  isActionPending?: boolean;
}

export function Post({
  id,
  content,
  wallet_address,
  timestamp,
  likes,
  comments,
  onLike,
  onComment,
  isConnected,
  isActionPending = false,
}: PostProps) {
  const { address } = useAccount();
  const [commentContent, setCommentContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    setIsSubmitting(true);
    setError(null);
    try {
      await onComment(id, commentContent);
      setCommentContent('');
    } catch (error: any) {
      setError(error.message || 'Failed to post comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async () => {
    if (!isConnected || isActionPending) return;
    try {
      await onLike(id);
    } catch (error: any) {
      setError(error.message || 'Failed to like post. Please try again.');
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-4">
      {error && (
        <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
          {error}
        </div>
      )}
      <div className="flex items-center mb-4">
        <div className="flex-1">
          <p className="text-sm text-gray-500">{wallet_address}</p>
          <p className="text-xs text-gray-400">
            {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
          </p>
        </div>
      </div>
      <p className="text-gray-800 mb-4">{content}</p>
      <div className="flex items-center space-x-4 mb-4">
        <button
          onClick={handleLike}
          disabled={!isConnected || isActionPending}
          className={`flex items-center space-x-1 ${
            !isConnected
              ? 'text-gray-300 cursor-not-allowed'
              : isActionPending
              ? 'text-gray-400 cursor-wait'
              : likes.some((like) => like.wallet_address === address)
              ? 'text-red-500'
              : 'text-gray-500 hover:text-red-500'
          }`}
          title={
            !isConnected
              ? 'Connect wallet to like posts'
              : isActionPending
              ? 'Processing...'
              : 'Like post'
          }
        >
          <svg
            className={`w-5 h-5 ${isActionPending ? 'animate-pulse' : ''}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
            />
          </svg>
          <span>{likes.length}</span>
        </button>
      </div>
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-50 rounded p-3">
            <p className="text-sm text-gray-500">{comment.wallet_address}</p>
            <p className="text-gray-800">{comment.content}</p>
            <p className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(comment.timestamp), {
                addSuffix: true,
              })}
            </p>
          </div>
        ))}
        {isConnected && (
          <form onSubmit={handleComment} className="flex space-x-2">
            <input
              type="text"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
              maxLength={280}
              disabled={isSubmitting || isActionPending}
            />
            <button
              type="submit"
              disabled={isSubmitting || !commentContent.trim() || isActionPending}
              className="bg-indigo-500 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
            >
              {isSubmitting ? 'Posting...' : 'Comment'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
} 