'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { Post, Comment } from '@/types/forum';

export default function CommunityForum() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState({ title: '', content: '', authorName: '' });
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [newComment, setNewComment] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [newReply, setNewReply] = useState('');
  const [replyAuthor, setReplyAuthor] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
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
    if (!newPost.title.trim() || !newPost.content.trim() || !newPost.authorName.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('/api/forum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newPost,
          authorName: newPost.authorName.trim()
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
    if (!newComment.trim() || !commentAuthor.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch(`/api/forum/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newComment,
          authorName: commentAuthor.trim(),
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
      setCommentAuthor('');
      setError(null);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to add comment');
    }
  };

  const handleCreateReply = async (postId: string, commentId: string) => {
    if (!newReply.trim() || !replyAuthor.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch(`/api/forum/${postId}/comments/${commentId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newReply,
          authorName: replyAuthor.trim(),
          postId,
          commentId
        })
      });

      if (!response.ok) throw new Error('Failed to add reply');
      const reply = await response.json();
      setComments(prev => ({
        ...prev,
        [postId]: prev[postId].map(comment =>
          comment._id === commentId
            ? { ...comment, replies: [...(comment.replies || []), reply] }
            : comment
        )
      }));
      setNewReply('');
      setReplyAuthor('');
      setReplyingTo(null);
      setError(null);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to add reply');
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
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Community Forum</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleCreatePost} className="mb-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Create New Post</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={newPost.title}
              onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Content</label>
            <textarea
              value={newPost.content}
              onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              rows={4}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Your Name</label>
            <input
              type="text"
              value={newPost.authorName}
              onChange={(e) => setNewPost(prev => ({ ...prev, authorName: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Create Post
          </button>
        </div>
      </form>

      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post._id} className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-600 mb-4">{post.content}</p>
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span>Posted by {post.authorName}</span>
              <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
            </div>
            
            <div className="flex items-center space-x-4 mb-4">
              <button
                onClick={() => handleVote(post._id, 'like')}
                className={`flex items-center space-x-1 ${
                  userReactions[post._id] === 'like' ? 'text-green-600' : 'text-gray-500'
                }`}
              >
                <span>👍</span>
                <span>{post.likes}</span>
              </button>
              <button
                onClick={() => handleVote(post._id, 'dislike')}
                className={`flex items-center space-x-1 ${
                  userReactions[post._id] === 'dislike' ? 'text-red-600' : 'text-gray-500'
                }`}
              >
                <span>👎</span>
                <span>{post.dislikes}</span>
              </button>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Comments</h3>
              {comments[post._id]?.map((comment) => (
                <div key={comment._id} className="ml-4 mb-4">
                  <p className="text-gray-700">{comment.content}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mt-1">
                    <span>By {comment.authorName}</span>
                    <span>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
                  </div>
                  
                  {comment.replies?.map((reply) => (
                    <div key={reply._id} className="ml-8 mt-2">
                      <p className="text-gray-700">{reply.content}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500 mt-1">
                        <span>By {reply.authorName}</span>
                        <span>{formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}</span>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => setReplyingTo(comment._id)}
                    className="text-sm text-green-600 hover:text-green-700 mt-2"
                  >
                    Reply
                  </button>

                  {replyingTo === comment._id && (
                    <div className="mt-2">
                      <textarea
                        value={newReply}
                        onChange={(e) => setNewReply(e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        rows={2}
                        placeholder="Write a reply..."
                      />
                      <div className="mt-2">
                        <input
                          type="text"
                          value={replyAuthor}
                          onChange={(e) => setReplyAuthor(e.target.value)}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                          placeholder="Your name"
                        />
                      </div>
                      <div className="flex space-x-2 mt-2">
                        <button
                          onClick={() => handleCreateReply(post._id, comment._id)}
                          className="bg-green-600 text-white py-1 px-3 rounded-md hover:bg-green-700"
                        >
                          Submit Reply
                        </button>
                        <button
                          onClick={() => setReplyingTo(null)}
                          className="bg-gray-200 text-gray-700 py-1 px-3 rounded-md hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <div className="mt-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  rows={3}
                  placeholder="Write a comment..."
                />
                <div className="mt-2">
                  <input
                    type="text"
                    value={commentAuthor}
                    onChange={(e) => setCommentAuthor(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    placeholder="Your name"
                  />
                </div>
                <button
                  onClick={() => handleCreateComment(post._id)}
                  className="mt-2 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                >
                  Add Comment
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 