// This service handles Facebook Pixel interactions

declare global {
  interface Window {
    fbq: any;
  }
}

export const initPixel = (pixelId: string) => {
  if (!pixelId) {
    console.warn('Facebook Pixel ID not provided yet.');
    return;
  }

  // Standard Facebook Pixel Base Code
  if (window.fbq) return;

  (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

  window.fbq('init', pixelId);
  window.fbq('track', 'PageView');
};

export const trackEvent = (eventName: string, data?: Record<string, any>) => {
  if (window.fbq) {
    window.fbq('track', eventName, data);
  } else {
    console.log(`[DEV] Pixel Event: ${eventName}`, data);
  }
};