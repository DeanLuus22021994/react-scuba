/**
 * Analytics utilities for React Scuba
 * @packageDocumentation
 */

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, unknown>;
  timestamp?: Date;
}

export interface BookingAnalytics {
  bookingId: string;
  bookingType: 'dive' | 'course' | 'discover' | 'advanced';
  participants: number;
  totalAmount: number;
  currency: string;
  source?: string;
}

/**
 * Track booking completion event
 */
export function trackBookingCompleted(data: BookingAnalytics): void {
  const event: AnalyticsEvent = {
    name: 'booking_completed',
    properties: {
      booking_id: data.bookingId,
      booking_type: data.bookingType,
      participants: data.participants,
      total_amount: data.totalAmount,
      currency: data.currency,
      source: data.source || 'web',
    },
    timestamp: new Date(),
  };

  sendAnalyticsEvent(event);
}

/**
 * Track page view event
 */
export function trackPageView(page: string, title?: string): void {
  const event: AnalyticsEvent = {
    name: 'page_view',
    properties: {
      page,
      title: title || document?.title,
      referrer: document?.referrer,
      user_agent: navigator?.userAgent,
    },
    timestamp: new Date(),
  };

  sendAnalyticsEvent(event);
}

/**
 * Track course interest event
 */
export function trackCourseInterest(courseId: string, courseName: string): void {
  const event: AnalyticsEvent = {
    name: 'course_interest',
    properties: {
      course_id: courseId,
      course_name: courseName,
    },
    timestamp: new Date(),
  };

  sendAnalyticsEvent(event);
}

/**
 * Track dive site interest event
 */
export function trackDiveSiteInterest(siteId: string, siteName: string): void {
  const event: AnalyticsEvent = {
    name: 'dive_site_interest',
    properties: {
      site_id: siteId,
      site_name: siteName,
    },
    timestamp: new Date(),
  };

  sendAnalyticsEvent(event);
}

/**
 * Track form submission
 */
export function trackFormSubmission(
  formName: string,
  success: boolean,
  errorMessage?: string
): void {
  const event: AnalyticsEvent = {
    name: 'form_submission',
    properties: {
      form_name: formName,
      success,
      error_message: errorMessage,
    },
    timestamp: new Date(),
  };

  sendAnalyticsEvent(event);
}

/**
 * Track user engagement (time on page, scroll depth, etc.)
 */
export function trackEngagement(metrics: {
  timeOnPage?: number;
  scrollDepth?: number;
  clickCount?: number;
}): void {
  const event: AnalyticsEvent = {
    name: 'engagement',
    properties: {
      time_on_page: metrics.timeOnPage,
      scroll_depth: metrics.scrollDepth,
      click_count: metrics.clickCount,
      page: window.location.pathname,
    },
    timestamp: new Date(),
  };

  sendAnalyticsEvent(event);
}

/**
 * Send analytics event to configured providers
 */
function sendAnalyticsEvent(event: AnalyticsEvent): void {
  // Development: Log to console
	// Development: Log to console
	if (typeof process !== 'undefined' && process.env?.['NODE_ENV'] === 'development') {
		console.log('Analytics Event:', event);
		return;
	}  try {
    // Google Analytics 4 (if available)
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', event.name, {
        ...event.properties,
        timestamp_micros: event.timestamp ? event.timestamp.getTime() * 1000 : Date.now() * 1000,
      });
    }

    // Send to your analytics API
    if (process.env['VITE_ANALYTICS_API_ENDPOINT']) {
      fetch(`${process.env['VITE_ANALYTICS_API_ENDPOINT']}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }).catch(error => {
        console.warn('Failed to send analytics event:', error);
      });
    }
  } catch (error) {
    console.warn('Analytics error:', error);
  }
}

/**
 * Initialize analytics tracking
 */
export function initializeAnalytics(): void {
  // Track initial page view
  trackPageView(window.location.pathname);

  // Track engagement metrics
  let startTime = Date.now();
  let maxScroll = 0;
  let clickCount = 0;

  // Track scroll depth
  const trackScroll = () => {
    const scrollDepth = Math.max(
      maxScroll,
      Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100)
    );
    maxScroll = scrollDepth;
  };

  // Track clicks
  const trackClick = () => {
    clickCount++;
  };

  // Send engagement data before page unload
  const sendEngagement = () => {
    const timeOnPage = Math.round((Date.now() - startTime) / 1000);
    trackEngagement({
      timeOnPage,
      scrollDepth: maxScroll,
      clickCount,
    });
  };

  // Add event listeners
  window.addEventListener('scroll', trackScroll);
  window.addEventListener('click', trackClick);
  window.addEventListener('beforeunload', sendEngagement);

  // Send periodic engagement updates for long sessions
  setInterval(sendEngagement, 30000); // Every 30 seconds
}
