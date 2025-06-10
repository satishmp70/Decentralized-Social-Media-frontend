'use client';
import { useEffect, useState } from 'react';

type Post = {
  id: string | number;
  content: string;
};

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2>Feed</h2>
      {loading ? (
        <p>Loading posts...</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>{post.content || JSON.stringify(post)}</li>
          ))}
        </ul>
      )}
    </div>
  );
}