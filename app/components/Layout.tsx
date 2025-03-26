'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import ErrorBoundary from './ErrorBoundary';
import { analytics } from '@/app/services/analytics';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname() || '/';

  useEffect(() => {
    // Initialize analytics
    analytics.init();

    // Track page view
    analytics.trackPageView(pathname);
  }, [pathname]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default Layout; 