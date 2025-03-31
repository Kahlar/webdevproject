// pages/api/leaderboard.ts
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';
import { config } from '../../app/config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const client = await clientPromise;
      const db = client.db(config.mongodb.dbName);
      const usersCollection = db.collection('users');

      // Retrieve top users from the database based on points
      const leaderboardData = await usersCollection.find().sort({ points: -1 }).limit(10).toArray();

      // Transform data to include only name and points
      const leaderboard = leaderboardData.map(user => ({
        name: user.name || "Anonymous", // Use a default name if name is not available
        points: user.points || 0, // Use 0 if points is not available
      }));

      res.status(200).json(leaderboard);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to retrieve leaderboard data', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
