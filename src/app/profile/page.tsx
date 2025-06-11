'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { Profile } from '@/components/Profile';
import { Post } from '@/components/Post';
import api from '@/lib/axios';

interface UserData {
  username?: string;
  bio?: string;
  profile_pic_url?: string;
  wallet_address: string;
}

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

export default function ProfilePage() {
  const { address } = useAccount();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (address) {
      (window as any).walletAddress = address;
    } else {
      delete (window as any).walletAddress;
    }
  }, [address]);

  useEffect(() => {
    if (!address) {
      router.push('/');
      return;
    }

    const fetchData = async () => {
      try {
        const [userResponse, postsResponse] = await Promise.all([
          api.get(`/users/${address}`),
          api.get(`/posts?wallet=${address}`),
        ]);
        setUserData(userResponse.data);
        setPosts(postsResponse.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [address, router]);

  const handleUpdateProfile = async (data: {
    username: string;
    bio: string;
    profilePicUrl: string;
  }) => {
    if (!address) return;

    try {
      const response = await api.post('/users', {
        wallet_address: address,
        ...data,
      });
      setUserData(response.data);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleLike = async (postId: number) => {
    if (!address) return;

    try {
      await api.post(`/posts/${postId}/likes`);
      const response = await api.get(`/posts?wallet=${address}`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (postId: number, content: string) => {
    if (!address) return;

    try {
      await api.post(`/posts/${postId}/comments`, { content });
      const response = await api.get(`/posts?wallet=${address}`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error commenting on post:', error);
    }
  };

  if (!address) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <main className="max-w-2xl mx-auto py-8 px-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto"></div>
          </div>
        ) : (
          <>
            <Profile
              username={userData?.username}
              bio={userData?.bio}
              profilePicUrl={userData?.profile_pic_url}
              walletAddress={address}
              onUpdate={handleUpdateProfile}
            />
            <div className="mt-8 space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Your Posts</h2>
              {posts.map((post) => (
                <Post
                  key={post.id}
                  {...post}
                  onLike={handleLike}
                  onComment={handleComment}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
} 