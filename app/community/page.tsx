'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { formatDistanceToNow } from 'date-fns';
import { Post, Comment } from '@/types/forum';

export default function CommunityForum() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState({ title: '', content: '', authorName: '' });
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [newComment, setNewComment] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [userReactions, setUserReactions] = useState<Record<string, 'like' | 'dislike' | null>>({});

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (selectedPost) {
      fetchPostDetails(selectedPost);
    }
  }, [selectedPost]);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/forum');
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchPostDetails = async (postId: string) => {
    try {
      const response = await fetch(`/api/forum/${postId}/comments`);
      if (!response.ok) throw new Error('Failed to fetch post details');
      const data = await response.json();
      setComments(prev => ({
        ...prev,
        [postId]: data.comments
      }));
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to load comments');
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('/api/forum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newPost,
          authorName: newPost.authorName.trim() || 'Anonymous'
        })
      });

      if (!response.ok) throw new Error('Failed to create post');
      const post = await response.json();
      setPosts(prev => [post, ...prev]);
      setNewPost({ title: '', content: '', authorName: '' });
      setError(null);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to create post');
    }
  };

  const handleCreateComment = async (postId: string) => {
    if (!newComment.trim()) {
      setError('Please write a comment');
      return;
    }

    try {
      const response = await fetch(`/api/forum/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newComment,
          authorName: 'Anonymous',
          postId
        })
      });

      if (!response.ok) throw new Error('Failed to add comment');
      const comment = await response.json();
      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), comment]
      }));
      setNewComment('');
      setError(null);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to add comment');
    }
  };

  const handleVote = async (postId: string, type: 'like' | 'dislike') => {
    try {
      const response = await fetch(`/api/forum/${postId}/interactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      });

      if (response.ok) {
        const result = await response.json();
        setPosts(prev =>
          prev.map(post =>
            post._id === postId
              ? {
                  ...post,
                  likes: type === 'like' ? (result.like ? post.likes + 1 : post.likes - 1) : post.likes,
                  dislikes: type === 'dislike' ? (result.dislike ? post.dislikes + 1 : post.dislikes - 1) : post.dislikes
                }
              : post
          )
        );
        setUserReactions(prev => ({
          ...prev,
          [postId]: result[type] ? type : null
        }));
        setError(null);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to record vote');
      }
    } catch (error) {
      console.error('Error handling vote:', error);
      setError('Failed to record vote');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Start a Discussion</h2>
          <form onSubmit={handleCreatePost} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Title:</label>
              <input
                type="text"
                value={newPost.title}
                onChange={e => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                placeholder="Enter your title"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Content:</label>
              <textarea
                value={newPost.content}
                onChange={e => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500 min-h-[100px]"
                placeholder="Write your post content here..."
                required
              />
            </div>
            <button
              type="submit"
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition-colors"
            >
              Create Post
            </button>
          </form>
        </div>

        <div className="space-y-6">
          {posts.map(post => (
            <div key={post._id} className="border-b pb-6">
              <h3 className="text-xl font-bold mb-2">{post.title}</h3>
              <p className="text-gray-600 mb-4">{post.content}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <p>Posted by {post.authorName}</p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setSelectedPost(selectedPost === post._id ? null : post._id)}
                    className="text-green-600 hover:text-green-700"
                  >
                    {selectedPost === post._id ? 'Hide Comments' : 'Show Comments'}
                  </button>
                </div>
              </div>

              {selectedPost === post._id && (
                <div className="mt-4">
                  <div className="mb-4">
                    <textarea
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                      placeholder="Add a comment..."
                      rows={3}
                    />
                    <button
                      onClick={() => handleCreateComment(post._id)}
                      className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                    >
                      Post Comment
                    </button>
                  </div>

                  <div className="space-y-4">
                    {comments[post._id]?.map(comment => (
                      <div key={comment._id} className="bg-gray-50 p-4 rounded">
                        <p className="text-gray-700">{comment.content}</p>
                        <p className="text-sm text-gray-500 mt-2">
                          Comment by {comment.authorName}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 