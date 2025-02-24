// app/forum/CommunityForum.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import ForumPost from "@/app/components/ForumPost"; // Ensure the path is correct
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";

const CommunityForum = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "Reducing Plastic Waste in My Community",
      content:
        "I'm starting a local initiative to reduce plastic waste. Any tips or advice?",
      author: "EcoWarrior123",
      date: "2024-02-11",
      upvotes: 15,
      downvotes: 2,
      comments: [
        {
          id: 1,
          author: "GreenGuru",
          date: "2024-02-11",
          content: "Great initiative! Try organizing a community cleanup event.",
        },
      ],
    },
    // Add more sample posts here
  ]);

  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    tags: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewPost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPostWithData = {
      id: Date.now(),
      title: newPost.title,
      content: newPost.content,
      author: "Anonymous", // Or get the actual user
      date: new Date().toLocaleDateString(),
      upvotes: 0,
      downvotes: 0,
      comments: [],
    };
    setPosts([...posts, newPostWithData]);
    setNewPost({ title: "", content: "", tags: "" }); // Reset form
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5 text-center">
        Community Forum
      </h1>

      {/* Post Creation Form */}
      <div className="mb-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-3">Start a Discussion</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Title:
            </label>
            <Input
              type="text"
              id="title"
              name="title"
              value={newPost.title}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="content"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Content:
            </label>
            <Textarea
              id="content"
              name="content"
              value={newPost.content}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows={4}
              required
            />
          </div>

          <Button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Create Post
          </Button>
        </form>
      </div>

      {/* Forum Posts */}
      <div className="space-y-4">
        {posts.map((post) => (
          <ForumPost key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default CommunityForum;
