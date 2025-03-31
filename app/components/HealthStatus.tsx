'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface HealthStatus {
  status: 'healthy' | 'error';
  message: string;
  timestamp: string;
}

export function HealthStatus() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch('/api/health');
        const data = await response.json();
        setHealth(data);
      } catch (error) {
        setHealth({
          status: 'error',
          message: 'Failed to check health status',
          timestamp: new Date().toISOString()
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Check health immediately
    checkHealth();

    // Check health every minute
    const interval = setInterval(checkHealth, 60000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
        <span>Checking system health...</span>
      </div>
    );
  }

  if (!health) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 ${
      health.status === 'healthy' ? 'text-green-600' : 'text-red-600'
    }`}>
      {health.status === 'healthy' ? (
        <CheckCircle2 className="h-4 w-4" />
      ) : (
        <AlertCircle className="h-4 w-4" />
      )}
      <span>{health.message}</span>
      <span className="text-xs text-gray-500">
        Last checked: {new Date(health.timestamp).toLocaleTimeString()}
      </span>
    </div>
  );
} 