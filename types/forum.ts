export interface Post {
  _id: string;
  title: string;
  content: string;
  authorName: string;
  authorId: string;
  likes: number;
  dislikes: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  postId: string;
  content: string;
  authorName: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
} 