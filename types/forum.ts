export interface Post {
  _id: string;
  title: string;
  content: string;
  authorName: string;
  likes: number;
  dislikes: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  _id: string;
  content: string;
  authorName: string;
  postId: string;
  createdAt: Date;
  updatedAt: Date;
  replies?: Reply[];
}

export interface Reply {
  _id: string;
  content: string;
  authorName: string;
  postId: string;
  commentId: string;
  createdAt: Date;
  updatedAt: Date;
} 