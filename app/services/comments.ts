import { getCollection } from './mongodb';
import { ObjectId } from 'mongodb';

export interface Comment {
  _id?: ObjectId;
  content: string;
  tipId: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
}

export class CommentsService {
  static async getComments(tipId: string) {
    const collection = await getCollection('comments');
    return collection
      .find({ tipId })
      .sort({ createdAt: -1 })
      .toArray();
  }

  static async createComment(comment: Omit<Comment, '_id' | 'createdAt' | 'updatedAt'>) {
    const collection = await getCollection('comments');
    const now = new Date();
    
    const newComment = {
      ...comment,
      createdAt: now,
      updatedAt: now
    };

    const result = await collection.insertOne(newComment);
    return {
      _id: result.insertedId,
      ...newComment
    };
  }

  static async updateComment(id: string, content: string) {
    const collection = await getCollection('comments');
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          content,
          updatedAt: new Date()
        } 
      }
    );
    return result.modifiedCount > 0;
  }

  static async deleteComment(id: string) {
    const collection = await getCollection('comments');
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  static async getCommentById(id: string) {
    const collection = await getCollection('comments');
    return collection.findOne({ _id: new ObjectId(id) });
  }
} 