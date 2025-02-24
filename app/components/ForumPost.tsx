// app/components/ForumPost.tsx
"use client";

import React, { useState } from "react";
import Comment from "./Comment";

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  upvotes: number;
  downvotes: number;
  comments: { id: number; author: string; date: string; content: string }[];
}

interface CommentType {
  id: number;
  author: string;
  date: string;
  content: string;
}

const ForumPost = ({ post }: { post: Post }) => {
  const [upvotes, setUpvotes] = useState(post.upvotes);
  const [downvotes, setDownvotes] = useState(post.downvotes);
  const [comments, setComments] = useState(post.comments);
  const [newComment, setNewComment] = useState("");

  const handleUpvote = () => {
    setUpvotes(upvotes + 1);
  };

  const handleDownvote = () => {
    setDownvotes(downvotes + 1);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() !== "") {
      const commentData = {
        id: Date.now(),
        author: "Anonymous", // Replace with the actual user
        date: new Date().toLocaleDateString(),
        content: newComment,
      };
      setComments([...comments, commentData]);
      setNewComment("");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
      <p className="text-gray-600 mb-4">{post.content}</p>
      <div className="flex justify-between items-center mb-3">
        <span className="text-gray-500">
          Posted by {post.author} on {post.date}
        </span>
        <div>
          <button
            onClick={handleUpvote}
            className="bg-green-100 hover:bg-green-200 text-green-700 font-semibold py-1 px-2 rounded mr-2"
          >
            Upvote ({upvotes})
          </button>
          <button
            onClick={handleDownvote}
            className="bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-1 px-2 rounded"
          >
            Downvote ({downvotes})
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-4">
        <h4 className="text-lg font-semibold mb-2">Comments</h4>
        {comments.map((comment: CommentType) => (
          <Comment key={comment.id} comment={comment} />
        ))}

        {/* Add Comment Form */}
        <form onSubmit={handleCommentSubmit} className="mt-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
            rows={2}
          />
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Post Comment
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForumPost;
