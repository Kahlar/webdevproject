type EventType = 'page_view' | 'button_click' | 'form_submit' | 'error' | 'performance';

interface AnalyticsEvent {
  type: EventType;
  name: string;
  properties?: Record<string, any>;
  timestamp?: number;
}

class AnalyticsService {
  private static instance: AnalyticsService;
  private events: AnalyticsEvent[] = [];
  private isInitialized = false;

  private constructor() {}

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  init() {
    if (this.isInitialized) return;

    // Initialize performance monitoring
    if (typeof window !== 'undefined') {
      this.setupPerformanceMonitoring();
      this.setupErrorTracking();
    }

    this.isInitialized = true;
  }

  private setupPerformanceMonitoring() {
    // Monitor Core Web Vitals
    if ('web-vital' in window) {
      // @ts-ignore
      webVitals.getCLS((metric) => this.trackEvent('performance', 'CLS', { metric }));
      // @ts-ignore
      webVitals.getFID((metric) => this.trackEvent('performance', 'FID', { metric }));
      // @ts-ignore
      webVitals.getLCP((metric) => this.trackEvent('performance', 'LCP', { metric }));
    }

    // Monitor page load performance
    window.addEventListener('load', () => {
      const timing = window.performance.timing;
      const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
      this.trackEvent('performance', 'page_load', { duration: pageLoadTime });
    });
  }

  private setupErrorTracking() {
    window.addEventListener('error', (event) => {
      this.trackEvent('error', 'runtime_error', {
        message: event.message,
        filename: event.filename,
        line: event.lineno,
        column: event.colno,
        error: event.error?.stack,
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.trackEvent('error', 'unhandled_promise', {
        message: event.reason?.message,
        stack: event.reason?.stack,
      });
    });
  }

  trackEvent(type: EventType, name: string, properties?: Record<string, any>) {
    const event: AnalyticsEvent = {
      type,
      name,
      properties,
      timestamp: Date.now(),
    };

    this.events.push(event);
    this.sendToAnalytics(event);
  }

  private sendToAnalytics(event: AnalyticsEvent) {
    // Here you would typically send the event to your analytics service
    // For example, Google Analytics, Mixpanel, etc.
    console.log('Analytics Event:', event);
  }

  // Public methods for tracking specific events
  trackPageView(path: string) {
    this.trackEvent('page_view', 'page_view', { path });
  }

  trackButtonClick(buttonName: string, properties?: Record<string, any>) {
    this.trackEvent('button_click', buttonName, properties);
  }

  trackFormSubmit(formName: string, properties?: Record<string, any>) {
    this.trackEvent('form_submit', formName, properties);
  }

  trackError(errorName: string, properties?: Record<string, any>) {
    this.trackEvent('error', errorName, properties);
  }
}

export const analytics = AnalyticsService.getInstance(); 