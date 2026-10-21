// Where a visitor first came from. Kept in their own browser and only sent along with the contact
// form, so each message in the admin says how its author found the site.
const STORAGE_KEY = "first-arrival";

const UTM_NAMES: Record<string, string> = {
  linkedin: "LinkedIn",
  github: "GitHub",
  cv: "CV",
  email: "E-mail",
  whatsapp: "WhatsApp",
};

const REFERRERS: [RegExp, string][] = [
  [/(^|\.)linkedin\.com$|^lnkd\.in$/, "LinkedIn"],
  [/(^|\.)github\.com$/, "GitHub"],
  [/(^|\.)google\.[a-z.]+$/, "Google"],
  [/(^|\.)bing\.com$/, "Bing"],
  [/(^|\.)duckduckgo\.com$/, "DuckDuckGo"],
  [/^t\.co$|(^|\.)x\.com$|(^|\.)twitter\.com$/, "X"],
  [/(^|\.)facebook\.com$/, "Facebook"],
  [/(^|\.)instagram\.com$/, "Instagram"],
  [/(^|\.)whatsapp\.(com|net)$/, "WhatsApp"],
];

/** "LinkedIn", "Google", "cv (stage-2027)", "Accès direct"… from a query string and a referrer. */
export function describeSource(search: string, referrer: string, ownHost: string): string {
  const params = new URLSearchParams(search);
  const utm = params.get("utm_source")?.trim();
  if (utm) {
    const name = UTM_NAMES[utm.toLowerCase()] ?? utm;
    const campaign = params.get("utm_campaign")?.trim();
    return (campaign ? `${name} (${campaign})` : name).slice(0, 100);
  }
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "");
    if (host && host !== ownHost.replace(/^www\./, "")) {
      return REFERRERS.find(([pattern]) => pattern.test(host))?.[1] ?? host;
    }
  } catch {
    // No referrer, or not a URL.
  }
  return "Accès direct";
}

/** Called once at start-up: only the first arrival is kept, a later direct visit does not overwrite it. */
export function recordArrival() {
  try {
    if (localStorage.getItem(STORAGE_KEY)) return;
    const source = describeSource(location.search, document.referrer, location.hostname);
    localStorage.setItem(STORAGE_KEY, `${source}, arrivé sur ${location.pathname}`);
  } catch {
    // Storage unavailable: the message is simply sent without its origin.
  }
}

export function getArrival(): string | undefined {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? undefined;
  } catch {
    return undefined;
  }
}
