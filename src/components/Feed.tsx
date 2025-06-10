'use client';
import { useEffect, useState } from 'react';
import { getPosts } from '../lib/api';

type Post = {
  id: string | number;
  content: string;
};

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPosts()
      .then(setPosts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Latest Posts</h2>
      {loading ? (
        <p className="text-gray-500">Loading posts...</p>
      ) : posts.length > 0 ? (
        posts.map((p) => (
          <div key={p.id} className="border rounded p-3 bg-gray-50">
            {p.content}
          </div>
        ))
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
}