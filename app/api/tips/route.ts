import { NextResponse } from 'next/server';
import { getCollection } from '@/app/services/mongodb';
import { rateLimit } from '@/app/utils/rate-limit';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const tipsCollection = await getCollection('tips');
    const query = category ? { category } : {};

    const [tips, total] = await Promise.all([
      tipsCollection
        .find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray(),
      tipsCollection.countDocuments(query),
    ]);

    // Get likes and comments counts for each tip
    const likesCollection = await getCollection('likes');
    const commentsCollection = await getCollection('comments');

    const tipsWithCounts = await Promise.all(
      tips.map(async (tip) => {
        const [likesCount, commentsCount] = await Promise.all([
          likesCollection.countDocuments({ tipId: tip._id.toString() }),
          commentsCollection.countDocuments({ tipId: tip._id.toString() }),
        ]);

        return {
          ...tip,
          _count: {
            likes: likesCount,
            comments: commentsCount,
          },
        };
      })
    );

    return NextResponse.json({
      tips: tipsWithCounts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching tips:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const rateLimitResult = await rateLimit();
    if (rateLimitResult) return rateLimitResult;

    const body = await request.json();
    const { title, content, category, name } = body;

    if (!title || !content || !category || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const tipsCollection = await getCollection('tips');

    const tip = await tipsCollection.insertOne({
      title,
      content,
      category,
      authorName: name,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      id: tip.insertedId,
      title,
      content,
      category,
      authorName: name,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error creating tip:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 