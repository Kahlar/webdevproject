import { NextResponse } from 'next/server';
import { ForumService } from '@/app/services/forum';

// Get all posts
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const { posts, total } = await ForumService.getPosts(page, limit);
    return NextResponse.json({ posts, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

// Create a new post
export async function POST(request: Request) {
  try {
    const { title, content, authorName } = await request.json();
    
    if (!title || !content || !authorName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const post = await ForumService.createPost({
      title,
      content,
      authorName
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
} 