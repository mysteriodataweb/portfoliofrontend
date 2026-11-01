export const CONTACT_EMAIL = "fredbiam9@gmail.com";

/** Opens the visitor's email app on a new message to Alfred, the subject already filled in. */
export const mailtoHref = (subject?: string) =>
  `mailto:${CONTACT_EMAIL}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`;
