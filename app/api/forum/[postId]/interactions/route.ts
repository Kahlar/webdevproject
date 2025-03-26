import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/services/auth';
import { ForumService } from '@/app/services/forum';

export async function POST(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const body = await request.json();
    const { type } = body;

    if (!type || !['like', 'dislike'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid interaction type' },
        { status: 400 }
      );
    }

    const result = await ForumService.addReaction(params.postId, 'anonymous', type);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error handling interaction:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const { postId } = params;
    const session = await getServerSession(authOptions);

    const [post, comments, userReaction] = await Promise.all([
      ForumService.getPostById(postId),
      ForumService.getComments(postId),
      session?.user?.id
        ? ForumService.getUserReaction(postId, session.user.id)
        : null
    ]);

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      post,
      comments,
      userReaction
    });
  } catch (error) {
    console.error('Error fetching forum post details:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 