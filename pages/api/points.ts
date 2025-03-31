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

      // Retrieve user from the database
      const user = await usersCollection.findOne({ userId: userId });

      if (user) {
        res.status(200).json({ points: user.points || 0 }); // Return 0 if points is undefined
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to retrieve user points', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
