import { sendWebVitalsToGA4 } from './analytics.js';

const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

// Send web vitals to GA4
export const reportWebVitalsToGA4 = () => {
  reportWebVitals(sendWebVitalsToGA4);
};

export default reportWebVitals;
