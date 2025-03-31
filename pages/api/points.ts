// pages/api/points.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';
import { config } from '../../app/config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const client = await clientPromise;
      const db = client.db(config.mongodb.dbName);
      const usersCollection = db.collection('users');

      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }

      // Get user's total points
      const user = await usersCollection.findOne({ userId: userId });
      const totalPoints = user?.points || 0;

      res.status(200).json({ points: totalPoints });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: 'Failed to retrieve user points', error: error?.message || 'Unknown error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
