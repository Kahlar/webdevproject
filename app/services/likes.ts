import { getCollection } from './mongodb';
import { ObjectId } from 'mongodb';

export interface Like {
  _id?: ObjectId;
  tipId: string;
  userId: string;
  createdAt: Date;
}

export class LikesService {
  static async createLike(tipId: string, userId: string) {
    const collection = await getCollection('likes');
    const now = new Date();
    
    const newLike = {
      tipId,
      userId,
      createdAt: now
    };

    const result = await collection.insertOne(newLike);
    return {
      _id: result.insertedId,
      ...newLike
    };
  }

  static async deleteLike(tipId: string, userId: string) {
    const collection = await getCollection('likes');
    const result = await collection.deleteOne({ tipId, userId });
    return result.deletedCount > 0;
  }

  static async hasLiked(tipId: string, userId: string) {
    const collection = await getCollection('likes');
    const like = await collection.findOne({ tipId, userId });
    return !!like;
  }

  static async getLikesCount(tipId: string) {
    const collection = await getCollection('likes');
    return collection.countDocuments({ tipId });
  }

  static async getUserLikes(userId: string) {
    const collection = await getCollection('likes');
    return collection.find({ userId }).toArray();
  }
} 