import { NextResponse } from 'next/server';
import { ForumService } from '@/app/services/forum';

export async function GET(request: Request) {
  try {
    console.log('GET /api/forum - Fetching posts');
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const result = await ForumService.getPosts(page, limit);
    console.log(`GET /api/forum - Successfully fetched ${result.posts.length} posts`);
    return NextResponse.json(result.posts);
  } catch (error: any) {
    console.error('GET /api/forum - Error fetching forum posts:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log('POST /api/forum - Creating new post');
    const body = await request.json();
    const { title, content, authorName } = body;

    if (!title || !content) {
      console.warn('POST /api/forum - Missing required fields');
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const post = await ForumService.createPost({
      title,
      content,
      authorName: authorName || 'Anonymous',
      authorId: 'anonymous'
    });

    console.log('POST /api/forum - Successfully created post:', post._id);
    return NextResponse.json(post);
  } catch (error: any) {
    console.error('POST /api/forum - Error creating forum post:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
} 