import { NextResponse } from 'next/server';
import { getCollection } from '@/app/services/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(
  request: Request,
  { params }: { params: { tipId: string } }
) {
  try {
    const { type } = await request.json();

    if (!type || !['like', 'dislike'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid interaction type' },
        { status: 400 }
      );
    }

    const likesCollection = await getCollection('likes');
    const tipId = params.tipId;

    // Check if user has already liked/disliked
    const existingInteraction = await likesCollection.findOne({
      tipId,
      type,
    });

    if (existingInteraction) {
      // Remove the interaction if it exists
      await likesCollection.deleteOne({ _id: existingInteraction._id });
      return NextResponse.json({ [type]: false });
    }

    // Add new interaction
    await likesCollection.insertOne({
      tipId,
      type,
      createdAt: new Date(),
    });

    return NextResponse.json({ [type]: true });
  } catch (error) {
    console.error('Error handling tip interaction:', error);
    return NextResponse.json(
      { error: 'Failed to process interaction' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { tipId: string } }
) {
  try {
    const { tipId } = params;
    const likesCollection = await getCollection('likes');
    const commentsCollection = await getCollection('comments');

    const [likes, comments] = await Promise.all([
      likesCollection.find({ tipId }).toArray(),
      commentsCollection
        .find({ tipId })
        .sort({ createdAt: -1 })
        .toArray(),
    ]);

    return NextResponse.json({
      likes: likes.length,
      comments,
    });
  } catch (error) {
    console.error('Error fetching interactions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 