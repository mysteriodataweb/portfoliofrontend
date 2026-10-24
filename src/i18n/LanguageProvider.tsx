import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { dictionaries, initialLang, LANG_STORAGE_KEY, LanguageContext, langFromUrl, type Lang } from "./state";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, next);
    } catch {
      // Not remembered for the next visit, the switch still applies now.
    }
  }, []);

  // A ?lang= link is a choice too: it still applies after a reload on another page.
  useEffect(() => {
    const fromUrl = langFromUrl();
    if (fromUrl) setLang(fromUrl);
  }, [setLang]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t: dictionaries[lang] }), [lang, setLang]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
