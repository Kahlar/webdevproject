import { NextResponse } from 'next/server';
import { getCollection } from '@/app/services/mongodb';
import { rateLimit } from '@/app/utils/rate-limit';

export async function POST(
  request: Request,
  { params }: { params: { tipId: string } }
) {
  try {
    const rateLimitResult = await rateLimit();
    if (rateLimitResult) return rateLimitResult;

    const { tipId } = params;
    const body = await request.json();
    const { type, content, name } = body;

    if (!type || !name || (type === 'comment' && !content)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const likesCollection = await getCollection('likes');
    const commentsCollection = await getCollection('comments');

    if (type === 'like') {
      const existingLike = await likesCollection.findOne({
        tipId,
        userName: name,
      });

      if (existingLike) {
        await likesCollection.deleteOne({
          tipId,
          userName: name,
        });
        return NextResponse.json({ liked: false });
      }

      await likesCollection.insertOne({
        tipId,
        userName: name,
        createdAt: new Date(),
      });
      return NextResponse.json({ liked: true });
    }

    if (type === 'comment') {
      const comment = await commentsCollection.insertOne({
        tipId,
        userName: name,
        content,
        createdAt: new Date(),
      });

      return NextResponse.json({
        id: comment.insertedId,
        userName: name,
        content,
        createdAt: new Date(),
      });
    }

    return NextResponse.json(
      { error: 'Invalid interaction type' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in interactions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
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