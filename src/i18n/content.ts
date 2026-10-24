import type { Project } from "@/hooks/use-projects";
import type { BlogPost } from "@/hooks/use-blog";
import type { SkillCategory } from "@/hooks/use-skills";
import type { CVItem, CVSection } from "@/hooks/use-admin-cv";
import { pick, type Lang } from "./index";

// Database content in the visitor's language: each French field is replaced by its English
// version when one exists. The objects keep every other field (ids, admin flags…).

export const localizeProject = (p: Project, lang: Lang): Project => ({
  ...p,
  title: pick(lang, p.title, p.titleEn),
  shortDescription: pick(lang, p.shortDescription, p.shortDescriptionEn),
  fullDescription: pick(lang, p.fullDescription, p.fullDescriptionEn),
  context: pick(lang, p.context, p.contextEn),
  approach: pick(lang, p.approach, p.approachEn),
  results: pick(lang, p.results, p.resultsEn),
  challenges: pick(lang, p.challenges, p.challengesEn),
});

/** True when the visitor reads in English but the article has no English body yet. */
export const isFrenchOnly = (post: BlogPost, lang: Lang) => lang === "en" && !post.contentEn?.trim();

export const localizePost = (post: BlogPost, lang: Lang): BlogPost => ({
  ...post,
  title: pick(lang, post.title, post.titleEn),
  excerpt: pick(lang, post.excerpt, post.excerptEn),
  content: pick(lang, post.content, post.contentEn),
});

export const localizeCategory = (c: SkillCategory, lang: Lang): SkillCategory => ({
  ...c,
  name: pick(lang, c.name, c.nameEn),
});

const localizeItem = (item: CVItem, lang: Lang): CVItem => ({
  ...item,
  title: pick(lang, item.title, item.title_en),
  subtitle: pick(lang, item.subtitle, item.subtitle_en),
  description: pick(lang, item.description, item.description_en),
  highlights: lang === "en" && item.highlights_en?.length ? item.highlights_en : item.highlights,
});

export const localizeSection = (s: CVSection, lang: Lang): CVSection => ({
  ...s,
  title: pick(lang, s.title, s.title_en),
  items: (s.items ?? []).map((item) => localizeItem(item, lang)),
});
