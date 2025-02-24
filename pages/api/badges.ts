// pages/api/badges.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';

const badges = [
  { name: 'Eco-Newbie', threshold: 0 },
  { name: 'Green Warrior', threshold: 100 },
  { name: 'Planet Protector', threshold: 500 },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const client = await clientPromise;
      const db = client.db(process.env.MONGODB_URI);
      const usersCollection = db.collection('users');

      const { userId } = req.query;

      // Retrieve user from the database
      const user = await usersCollection.findOne({ userId: userId });

      if (user) {
        // Determine the badge based on points
        let badge = 'Eco-Newbie';
        for (let i = badges.length - 1; i >= 0; i--) {
          if ((user.points || 0) >= badges[i].threshold) {
            badge = badges[i].name;
            break;
          }
        }

        res.status(200).json({ badge: badge });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to retrieve user badge', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
