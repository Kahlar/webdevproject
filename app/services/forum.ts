import { getCollection } from './mongodb';
import { ObjectId } from 'mongodb';

export interface ForumPost {
  _id?: string;
  title: string;
  content: string;
  authorName: string;
  likes: number;
  dislikes: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ForumComment {
  _id?: string;
  postId: string;
  content: string;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ForumService {
  static async getPosts(page = 1, limit = 10) {
    const collection = await getCollection('forum_posts');
    
    try {
      const [posts, total] = await Promise.all([
        collection
          .find({})
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .toArray(),
        collection.countDocuments()
      ]);

      return { posts, total };
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  }

  static async createPost(post: Omit<ForumPost, '_id' | 'createdAt' | 'updatedAt' | 'likes' | 'dislikes'>) {
    const collection = await getCollection('forum_posts');
    
    try {
      const newPost = {
        ...post,
        likes: 0,
        dislikes: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await collection.insertOne(newPost);
      return { ...newPost, _id: result.insertedId };
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  static async getPostById(id: string) {
    const collection = await getCollection('forum_posts');
    return collection.findOne({ _id: new ObjectId(id) });
  }

  static async addReaction(postId: string, type: 'like' | 'dislike') {
    const collection = await getCollection('forum_posts');
    const updateField = type === 'like' ? 'likes' : 'dislikes';
    
    const result = await collection.updateOne(
      { _id: new ObjectId(postId) },
      { $inc: { [updateField]: 1 } }
    );

    return result.modifiedCount > 0;
  }

  static async getComments(postId: string) {
    const collection = await getCollection('forum_comments');
    
    try {
      return collection
        .find({ postId })
        .sort({ createdAt: -1 })
        .toArray();
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  }

  static async addComment(comment: Omit<ForumComment, '_id' | 'createdAt' | 'updatedAt'>) {
    const collection = await getCollection('forum_comments');
    
    try {
      const newComment = {
        ...comment,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await collection.insertOne(newComment);
      return { ...newComment, _id: result.insertedId };
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  }
} 