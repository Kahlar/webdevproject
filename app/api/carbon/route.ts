import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/services/auth';
import { CarbonService } from '@/app/services/carbon';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { category, value, unit } = body;

    if (!category || !value || !unit) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await CarbonService.recordFootprint(session.user.id, {
      category,
      value,
      unit,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error recording carbon footprint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const footprint = await CarbonService.getUserFootprint(session.user.id);
    const recommendations = await CarbonService.getRecommendations(session.user.id);

    return NextResponse.json({
      footprint,
      recommendations,
    });
  } catch (error) {
    console.error('Error fetching carbon footprint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 