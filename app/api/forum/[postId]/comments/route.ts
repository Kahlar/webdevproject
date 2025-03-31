import { NextResponse } from 'next/server';
import { ForumService } from '@/app/services/forum';

// Get all comments for a post
export async function GET(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const comments = await ForumService.getComments(params.postId);
    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

// Add a new comment to a post
export async function POST(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const { content, authorName } = await request.json();
    if (!content || !authorName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const comment = await ForumService.addComment({
      content,
      authorName,
      postId: params.postId
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
} 