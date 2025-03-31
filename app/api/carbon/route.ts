import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/services/mongodb';

export async function POST(request: Request) {
  try {
    const { userId, carbonFootprint, date } = await request.json();

    if (!carbonFootprint || !date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const record = {
      userId: userId || 'anonymous',
      carbonFootprint,
      date: new Date(date),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('carbonFootprints').insertOne(record);
    return NextResponse.json({ ...record, _id: result.insertedId });
  } catch (error) {
    console.error('Error recording carbon footprint:', error);
    return NextResponse.json(
      { error: 'Failed to record carbon footprint' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'anonymous';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const { db } = await connectToDatabase();
    const query: any = { userId };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const records = await db.collection('carbonFootprints')
      .find(query)
      .sort({ date: -1 })
      .toArray();

    return NextResponse.json(records);
  } catch (error) {
    console.error('Error fetching carbon footprint:', error);
    return NextResponse.json(
      { error: 'Failed to fetch carbon footprint' },
      { status: 500 }
    );
  }
} 