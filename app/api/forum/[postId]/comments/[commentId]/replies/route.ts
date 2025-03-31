import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/services/mongodb';

// Add a new reply to a comment
export async function POST(
  request: Request,
  { params }: { params: { postId: string; commentId: string } }
) {
  try {
    const { content, authorName } = await request.json();
    if (!content || !authorName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const reply = {
      content,
      authorName,
      postId: params.postId,
      commentId: params.commentId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('replies').insertOne(reply);
    return NextResponse.json({ ...reply, _id: result.insertedId });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create reply' }, { status: 500 });
  }
} 