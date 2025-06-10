'use client';

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { getPosts } from "../../lib/api";

interface Comment {
  id: number;
  text: string;
}

interface Post {
  id: number | string;
  content: string;
  likes: number;
  comments: Comment[];
}

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const { address } = useAccount();
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      setLoading(true);
      const data = await getPosts();
      setPosts(data.map((post: any) => ({
        ...post,
        likes: post.likes ?? 0,
        comments: post.comments ?? [],
      })));
    } catch (err) {
      console.error("Failed to fetch posts", err);
    } finally {
      setLoading(false);
    }
  }

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim() || !address) return;
    setCreating(true);
    try {
      await fetch(`${BASE_URL}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet_address: address, content: newPost }),
      });
      setNewPost("");
      fetchPosts();
    } catch (err) {
      alert("Failed to post");
    } finally {
      setCreating(false);
    }
  };

  const handleLike = async (id: Post["id"]) => {
    if (!address) return;
    try {
      await fetch(`${BASE_URL}/posts/${id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet_address: address }),
      });
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (id: Post["id"], text: string) => {
    if (!text.trim()) return;
    try {
      await fetch(`${BASE_URL}/posts/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet_address: address, content: text }),
      });
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">Latest Posts</h1>

      {/* Create post */}
      <form onSubmit={handleCreatePost} className="mb-6 flex items-center gap-3">
        <input
          type="text"
          placeholder="What's on your mind?"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={creating}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          {creating ? "Posting..." : "Post"}
        </button>
      </form>

      {loading ? (
        <p className="text-center text-gray-500">Loading posts...</p>
      ) : posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts yet.</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="bg-white shadow rounded-lg p-4 mb-6 border">
            <div className="text-lg font-medium mb-2">{post.content}</div>
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
              <button
                onClick={() => handleLike(post.id)}
                className="hover:text-blue-600 transition"
              >
                👍 {post.likes}
              </button>
              <span>💬 {post.comments.length}</span>
            </div>

            <CommentSection comments={post.comments} onAdd={(text) => handleAddComment(post.id, text)} />
          </div>
        ))
      )}
    </div>
  );
}

function CommentSection({
  comments,
  onAdd,
}: {
  comments: Comment[];
  onAdd: (text: string) => void;
}) {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    await onAdd(text);
    setText("");
    setSubmitting(false);
  };

  return (
    <div className="mt-2">
      <form onSubmit={handleSubmit} className="flex gap-2 mb-2">
        <input
          type="text"
          placeholder="Add a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded transition"
        >
          {submitting ? "..." : "Comment"}
        </button>
      </form>
      <ul className="space-y-1 text-sm text-gray-700">
        {comments.map((comment) => (
          <li key={comment.id} className="bg-gray-100 px-2 py-1 rounded">{comment.text}</li>
        ))}
      </ul>
    </div>
  );
}
