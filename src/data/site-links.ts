// Pages listed in the full-screen menu and the footer (labels come from the dictionary, under "nav").
// Engagements stay visible to the admin only.
export interface SiteLink {
  key: "projects" | "skills" | "engagements" | "blog" | "cv" | "about" | "contact";
  to: string;
  adminOnly?: boolean;
}

export const siteLinks: SiteLink[] = [
  { key: "projects", to: "/projets" },
  { key: "skills", to: "/competences" },
  { key: "engagements", to: "/engagements", adminOnly: true },
  { key: "blog", to: "/blog" },
  { key: "cv", to: "/cv" },
  { key: "about", to: "/about" },
  { key: "contact", to: "/contact" },
];
