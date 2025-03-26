import { getCollection } from './mongodb';
import { ObjectId } from 'mongodb';

export interface Tip {
  _id?: ObjectId;
  title: string;
  description: string;
  category: string;
  link?: string;
  authorId: string;
  authorName: string;
  likes: number;
  comments: number;
  createdAt: Date;
  updatedAt: Date;
}

export class TipsService {
  static async getTips(category?: string, page = 1, limit = 10) {
    const collection = await getCollection('tips');
    const query = category ? { category } : {};
    
    const [tips, total] = await Promise.all([
      collection
        .find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray(),
      collection.countDocuments(query)
    ]);

    return {
      tips,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  static async createTip(tip: Omit<Tip, '_id' | 'createdAt' | 'updatedAt'>) {
    const collection = await getCollection('tips');
    const now = new Date();
    
    const newTip = {
      ...tip,
      likes: 0,
      comments: 0,
      createdAt: now,
      updatedAt: now
    };

    const result = await collection.insertOne(newTip);
    return {
      _id: result.insertedId,
      ...newTip
    };
  }

  static async getTipById(id: string) {
    const collection = await getCollection('tips');
    return collection.findOne({ _id: new ObjectId(id) });
  }

  static async updateTip(id: string, updates: Partial<Tip>) {
    const collection = await getCollection('tips');
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          ...updates,
          updatedAt: new Date()
        } 
      }
    );
    return result.modifiedCount > 0;
  }

  static async deleteTip(id: string) {
    const collection = await getCollection('tips');
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  static async incrementLikes(id: string) {
    const collection = await getCollection('tips');
    return collection.updateOne(
      { _id: new ObjectId(id) },
      { $inc: { likes: 1 } }
    );
  }

  static async decrementLikes(id: string) {
    const collection = await getCollection('tips');
    return collection.updateOne(
      { _id: new ObjectId(id) },
      { $inc: { likes: -1 } }
    );
  }

  static async incrementComments(id: string) {
    const collection = await getCollection('tips');
    return collection.updateOne(
      { _id: new ObjectId(id) },
      { $inc: { comments: 1 } }
    );
  }

  static async decrementComments(id: string) {
    const collection = await getCollection('tips');
    return collection.updateOne(
      { _id: new ObjectId(id) },
      { $inc: { comments: -1 } }
    );
  }
} 