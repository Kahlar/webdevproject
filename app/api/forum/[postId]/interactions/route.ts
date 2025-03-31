import { NextResponse } from 'next/server';
import { ForumService } from '@/app/services/forum';

// Handle post likes and dislikes
export async function POST(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const { type } = await request.json();
    if (!type || !['like', 'dislike'].includes(type)) {
      return NextResponse.json({ error: 'Invalid interaction type' }, { status: 400 });
    }

    const success = await ForumService.addReaction(params.postId, type);
    
    if (!success) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ [type]: true });
  } catch (error) {
    console.error('Error handling interaction:', error);
    return NextResponse.json({ error: 'Failed to process interaction' }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const post = await ForumService.getPostById(params.postId);

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      likes: post.likes || 0,
      dislikes: post.dislikes || 0
    });
  } catch (error) {
    console.error('Error fetching post interactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch interactions' },
      { status: 500 }
    );
  }
} 