import { NextResponse } from 'next/server';
import { checkDatabaseHealth } from '@/app/services/mongodb';

export async function GET() {
  try {
    const isHealthy = await checkDatabaseHealth();
    
    if (!isHealthy) {
      return NextResponse.json(
        { 
          status: 'error',
          message: 'Database connection is not healthy',
          timestamp: new Date().toISOString()
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      status: 'healthy',
      message: 'All systems operational',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Health check failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 