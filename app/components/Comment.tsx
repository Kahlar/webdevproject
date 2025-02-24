// app/components/Comment.tsx
import React from "react";

interface CommentType {
  id: number;
  author: string;
  date: string;
  content: string;
}

const Comment = ({ comment }: { comment: CommentType }) => {
  return (
    <div className="bg-gray-100 rounded-lg p-3 mb-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-semibold">{comment.author}</span>
        <span className="text-xs text-gray-500">{comment.date}</span>
      </div>
      <p className="text-gray-700">{comment.content}</p>
    </div>
  );
};

export default Comment;
