// Google Analytics 4 utilities

// Initialize Google Analytics
export const initGA = (measurementId: string) => {
  if (typeof window !== 'undefined' && !window.gtag) {
    // Add the Google Analytics script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script1);

    // Initialize the data layer
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', measurementId);

    console.log('Google Analytics initialized');
  }
};

// Track page views
export const pageview = (url: string, title: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_title: title,
      page_location: url,
      page_path: url,
    });
  }
};

// Track events
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track CTA button clicks
export const trackCTAClick = (ctaText: string, destination: string) => {
  event({
    action: 'cta_click',
    category: 'CTA',
    label: `${ctaText} - ${destination}`,
  });
};

// Track newsletter submissions
export const trackNewsletterSubmission = () => {
  event({
    action: 'newsletter_submit',
    category: 'Engagement',
    label: 'Newsletter Subscription',
  });
};

// Declare the gtag types for TypeScript
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}