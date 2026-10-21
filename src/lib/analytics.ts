// Audience measurement with Umami: no cookies, so no consent banner. Nothing loads until
// VITE_UMAMI_WEBSITE_ID is set (Vercel > Settings > Environment Variables).
const WEBSITE_ID = import.meta.env.VITE_UMAMI_WEBSITE_ID as string | undefined;
const SCRIPT_URL = "https://cloud.umami.is/script.js";

type EventData = Record<string, string | number>;

declare global {
  interface Window {
    umami?: { track: (event: string, data?: EventData) => void };
  }
}

export function initAnalytics() {
  if (!WEBSITE_ID || document.querySelector("script[data-website-id]")) return;
  const script = document.createElement("script");
  script.defer = true;
  script.src = SCRIPT_URL;
  script.dataset.websiteId = WEBSITE_ID;
  // Only the real site is counted, not localhost or Vercel previews.
  script.dataset.domains = "kwami.dev,www.kwami.dev";
  document.head.appendChild(script);
}

/** Records an action (CV downloaded, message sent…). Silently does nothing while Umami is not loaded. */
export function track(event: string, data?: EventData) {
  try {
    window.umami?.track(event, data);
  } catch {
    // Measurement must never break the page.
  }
}

/** Leaves the owner's own visits out of the statistics: Umami ignores browsers carrying this flag. */
export function excludeThisBrowser() {
  try {
    localStorage.setItem("umami.disabled", "1");
  } catch {
    // Storage unavailable: the visit is counted, nothing else changes.
  }
}
