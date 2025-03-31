import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { env } from './env';

const RATE_LIMIT = env.API_RATE_LIMIT;
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds

const ipRequests = new Map<string, { count: number; timestamp: number }>();

export async function rateLimit() {
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for') || 'unknown';
  const now = Date.now();

  const requestData = ipRequests.get(ip);
  if (!requestData) {
    ipRequests.set(ip, { count: 1, timestamp: now });
    return null;
  }

  if (now - requestData.timestamp > RATE_LIMIT_WINDOW) {
    ipRequests.set(ip, { count: 1, timestamp: now });
    return null;
  }

  if (requestData.count >= RATE_LIMIT) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
  }

  requestData.count++;
  return null;
} 