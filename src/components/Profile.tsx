'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';

interface ProfileProps {
  username?: string;
  bio?: string;
  profilePicUrl?: string;
  walletAddress: string;
  onUpdate: (data: { username: string; bio: string; profilePicUrl: string }) => Promise<void>;
}

export function Profile({
  username,
  bio,
  profilePicUrl,
  walletAddress,
  onUpdate,
}: ProfileProps) {
  const { address } = useAccount();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: username || '',
    bio: bio || '',
    profilePicUrl: profilePicUrl || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onUpdate(formData);
      setIsEditing(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isOwnProfile = address?.toLowerCase() === walletAddress.toLowerCase();

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden">
          {profilePicUrl ? (
            <img
              src={profilePicUrl}
              alt={username || 'Profile'}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg
                className="w-10 h-10"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-800">
            {username || 'Anonymous'}
          </h2>
          <p className="text-sm text-gray-500">{walletAddress}</p>
        </div>
        {isOwnProfile && (
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-indigo-500 hover:text-indigo-600"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Profile Picture URL
            </label>
            <input
              type="url"
              value={formData.profilePicUrl}
              onChange={(e) =>
                setFormData({ ...formData, profilePicUrl: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-indigo-500 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
            >
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          {bio && <p className="text-gray-600">{bio}</p>}
        </div>
      )}
    </div>
  );
} 