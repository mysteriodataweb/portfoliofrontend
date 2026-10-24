import { createContext, useContext } from "react";
import { fr, type Dict } from "./fr";
import { en } from "./en";

export type Lang = "fr" | "en";

export const dictionaries: Record<Lang, Dict> = { fr, en };
export const LANG_STORAGE_KEY = "lang";

const isLang = (value: unknown): value is Lang => value === "fr" || value === "en";

export const langFromUrl = (): Lang | null => {
  const param = new URLSearchParams(window.location.search).get("lang");
  return isLang(param) ? param : null;
};

// A ?lang=en link wins (to share the English site), then the visitor's last choice, then their browser language.
export const initialLang = (): Lang => {
  const fromUrl = langFromUrl();
  if (fromUrl) return fromUrl;
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (isLang(saved)) return saved;
  } catch {
    // Storage unavailable: fall back to the browser language.
  }
  return navigator.language?.toLowerCase().startsWith("fr") ? "fr" : "en";
};

export interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Dict;
}

export const LanguageContext = createContext<LanguageContextValue>({ lang: "fr", setLang: () => {}, t: fr });

export const useLanguage = () => useContext(LanguageContext);

/**
 * Content from the database has a French field and, when translated, an English one ("title" / "titleEn").
 * In English, the translation is used when it exists; otherwise the French text is shown rather than nothing.
 */
export function pick(lang: Lang, french: string, english?: string | null): string {
  return lang === "en" && english?.trim() ? english : french;
}
