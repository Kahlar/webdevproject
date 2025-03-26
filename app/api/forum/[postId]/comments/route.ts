import { NextResponse } from 'next/server';
import { ForumService } from '@/app/services/forum';

export async function GET(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const comments = await ForumService.getComments(params.postId);
    return NextResponse.json({ comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const body = await request.json();
    const { content, authorName } = body;

    if (!content) {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      );
    }

    const comment = await ForumService.addComment({
      postId: params.postId,
      content,
      authorName: authorName || 'Anonymous',
      authorId: 'anonymous'
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 