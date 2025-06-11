'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

interface CreatePostProps {
  onSubmit: (content: string) => Promise<void>;
}

export function CreatePost({ onSubmit }: CreatePostProps) {
  const { address } = useAccount();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(content);
      setContent('');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) {
    return (
      <div className="bg-white shadow rounded-lg p-6 mb-4">
        <div className="h-[120px] flex items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!address) {
    return (
      <div className="bg-white shadow rounded-lg p-6 mb-4">
        <p className="text-gray-500 text-center">
          Please connect your wallet to create posts
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full rounded border border-gray-300 p-3 text-sm resize-none"
          rows={3}
          maxLength={280}
        />
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {content.length}/280 characters
          </span>
          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="bg-indigo-500 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
} 