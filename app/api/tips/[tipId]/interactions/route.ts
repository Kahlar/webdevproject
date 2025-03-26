import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/services/auth';
import { prisma } from '@/app/services/prisma';

export async function POST(
  request: Request,
  { params }: { params: { tipId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { tipId } = params;
    const body = await request.json();
    const { type, content } = body;

    if (!type || (type === 'comment' && !content)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (type === 'like') {
      const existingLike = await prisma.like.findUnique({
        where: {
          tipId_userId: {
            tipId,
            userId: session.user.id,
          },
        },
      });

      if (existingLike) {
        await prisma.like.delete({
          where: {
            tipId_userId: {
              tipId,
              userId: session.user.id,
            },
          },
        });
        return NextResponse.json({ liked: false });
      }

      await prisma.like.create({
        data: {
          tipId,
          userId: session.user.id,
        },
      });
      return NextResponse.json({ liked: true });
    }

    if (type === 'comment') {
      const comment = await prisma.comment.create({
        data: {
          content,
          tipId,
          authorId: session.user.id,
        },
        include: {
          author: {
            select: {
              name: true,
            },
          },
        },
      });
      return NextResponse.json(comment);
    }

    return NextResponse.json(
      { error: 'Invalid interaction type' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error handling tip interaction:', error);
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
    const session = await getServerSession(authOptions);

    const [likes, comments] = await Promise.all([
      prisma.like.count({
        where: { tipId },
      }),
      prisma.comment.findMany({
        where: { tipId },
        include: {
          author: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    const userLiked = session?.user?.id
      ? await prisma.like.findUnique({
          where: {
            tipId_userId: {
              tipId,
              userId: session.user.id,
            },
          },
        })
      : null;

    return NextResponse.json({
      likes,
      comments,
      userLiked: !!userLiked,
    });
  } catch (error) {
    console.error('Error fetching tip interactions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 