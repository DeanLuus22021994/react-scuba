import ReactGA from 'react-ga4';
import TagManager from 'react-gtm-module';
import logger from './logger';

// Initialize GTM
export const initializeGTM = () => {
  const gtmId = import.meta.env.VITE_GTM_ID;

  if (gtmId) {
    TagManager.initialize({
      gtmId: gtmId,
    });
    logger.info('GTM initialized:', gtmId);
  } else {
    logger.warn('GTM ID not found in environment variables');
  }
};

// Initialize GA4
export const initializeGA4 = () => {
  const ga4Id = import.meta.env.VITE_GA4_ID;

  if (ga4Id) {
    ReactGA.initialize(ga4Id);
    logger.info('GA4 initialized:', ga4Id);
  } else {
    logger.warn('GA4 ID not found in environment variables');
  }
};

// Track page view
export const trackPageView = (path, title) => {
  // GA4
  ReactGA.send({ hitType: 'pageview', page: path, title: title });

  // GTM dataLayer
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'page_view',
    page_path: path,
    page_title: title,
  });
};

// Track conversion events
export const trackConversion = (eventName, eventParams = {}) => {
  // GA4
  ReactGA.event(eventName, eventParams);

  // GTM dataLayer
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...eventParams,
  });
};

// Specific conversion tracking functions
export const trackContactSubmit = (source, inquiryType) => {
  trackConversion('contact_submit', {
    source: source,
    inquiry_type: inquiryType,
    conversion_label: 'contact_form',
  });
};

export const trackCourseInquiry = (courseName, coursePrice, currency) => {
  trackConversion('course_inquiry', {
    course_name: courseName,
    course_price: coursePrice,
    currency: currency,
    conversion_label: 'course_interest',
  });
};

export const trackBookingRequest = (bookingType, value, currency) => {
  trackConversion('booking_request', {
    booking_type: bookingType,
    value: value,
    currency: currency,
    conversion_label: 'booking_inquiry',
  });
};

export const trackCalendarBookingComplete = (bookingType, value, currency, date) => {
  trackConversion('calendar_booking_complete', {
    booking_type: bookingType,
    value: value,
    currency: currency,
    booking_date: date,
    conversion_label: 'booking_confirmed',
  });
};

export const trackPhoneClick = (source) => {
  trackConversion('phone_click', {
    source: source,
    conversion_label: 'phone_call',
  });
};

export const trackEmailClick = (source) => {
  trackConversion('email_click', {
    source: source,
    conversion_label: 'email_contact',
  });
};

export const trackWhatsAppClick = (source, messageType) => {
  trackConversion('whatsapp_click', {
    source: source,
    message_type: messageType,
    conversion_label: 'whatsapp_contact',
  });
};

export const trackCurrencyChange = (fromCurrency, toCurrency) => {
  trackConversion('currency_change', {
    from_currency: fromCurrency,
    to_currency: toCurrency,
  });
};

export const trackFormStart = (formName, source) => {
  trackConversion('form_start', {
    form_name: formName,
    source: source,
  });
};

export const trackFormAbandon = (formName, source, completionPercentage) => {
  trackConversion('form_abandon', {
    form_name: formName,
    source: source,
    completion_percentage: completionPercentage,
  });
};

export const trackFormComplete = (formName, source) => {
  trackConversion('form_complete', {
    form_name: formName,
    source: source,
  });
};

// Send Web Vitals to GA4
export const sendWebVitalsToGA4 = ({ name, delta, id }) => {
  ReactGA.event({
    category: 'Web Vitals',
    action: name,
    value: Math.round(name === 'CLS' ? delta * 1000 : delta),
    label: id,
    nonInteraction: true,
  });
};
