import React from 'react';

interface Comment {
  author: string;
  text: string;
}

interface Post {
  id: string | number;
  author: string;
  content: string;
  createdAt: string;
  likes: number;
  comments: Comment[];
}

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 w-full">
      {/* Post Header */}
      <div className="flex items-start gap-3">
        <img
          src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${post.id}`}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover shrink-0"
        />
        <div className="flex-1">
          <div className="font-semibold text-sm">{post.author}</div>
          <div className="text-gray-800 text-sm mt-1">{post.content}</div>
          <div className="text-xs text-gray-500 mt-1">{post.createdAt}</div>

          {/* Like / Comment Actions */}
          <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
            <span>❤️ {post.likes} Likes</span>
            <span>💬 {post.comments.length} Comments</span>
          </div>
        </div>
      </div>

      {/* Comments */}
      <div className="mt-4 space-y-3">
        {post.comments.map((comment, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <img
              src={`https://api.dicebear.com/7.x/thumbs/svg?seed=comment-${idx}`}
              alt="avatar"
              className="w-8 h-8 rounded-full object-cover shrink-0"
            />
            <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm w-full">
              <div className="font-medium text-gray-700">{comment.author}</div>
              <div className="text-gray-600">{comment.text}</div>
            </div>
          </div>
        ))}

        {/* Add a comment */}
        <div className="flex items-center gap-2 mt-2">
          <img
            src={`https://api.dicebear.com/7.x/thumbs/svg?seed=current`}
            alt="avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
          <input
            type="text"
            placeholder="Write a comment..."
            className="flex-1 rounded-full px-4 py-2 border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>
    </div>
  );
};

export default PostCard;
