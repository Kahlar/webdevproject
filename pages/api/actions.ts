// pages/api/actions.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';
import { config } from '../../app/config';

type ActionPoints = {
  "Used public transport": number;
  "Recycled household waste": number;
  "Bought local organic produce": number;
  [key: string]: number; // Allow any string key with number value
};

type RequestBody = {
  action: keyof ActionPoints;
  userId: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const client = await clientPromise;
      const db = client.db(config.mongodb.dbName);
      const actionsCollection = db.collection('actions');
      const usersCollection = db.collection('users');

      const { action, userId } = req.body as RequestBody;

      // Define points for each action (You can customize these values)
      const actionPoints: ActionPoints = {
        "Used public transport": 10,
        "Recycled household waste": 15,
        "Bought local organic produce": 20,
        // Add more actions and their corresponding points
      };

      const points = actionPoints[action] || 5; // Default points if action not found

      // Store the action in the database
      const result = await actionsCollection.insertOne({
        action,
        userId,
        points,
        timestamp: new Date(),
      });

      // Update user points in the users collection
      const updateResult = await usersCollection.updateOne(
        { userId: userId },
        { $inc: { points: points } },
        { upsert: true } // creates the user if it doesn't exist
      );

      res.status(200).json({ message: 'Action logged successfully', insertedId: result.insertedId, pointsEarned: points });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: 'Failed to log action', error: error?.message || 'Unknown error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
