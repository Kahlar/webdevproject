// pages/api/leaderboard.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';
import { config } from '../../app/config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const client = await clientPromise;
      const db = client.db(config.mongodb.dbName);
      const usersCollection = db.collection('users');

      // Get top 10 users by points
      const leaderboard = await usersCollection
        .find({})
        .sort({ points: -1 })
        .limit(10)
        .toArray();

      res.status(200).json(leaderboard);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: 'Failed to retrieve leaderboard data', error: error?.message || 'Unknown error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
