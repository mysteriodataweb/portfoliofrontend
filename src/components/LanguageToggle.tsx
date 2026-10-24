import { useLanguage } from "@/i18n";
import { track } from "@/lib/analytics";

/** Shows the other language ("EN" on the French site) and switches to it. */
const LanguageToggle = ({ className = "" }: { className?: string }) => {
  const { lang, setLang, t } = useLanguage();
  const next = lang === "fr" ? "en" : "fr";

  return (
    <button
      onClick={() => {
        setLang(next);
        track("langue", { langue: next });
      }}
      aria-label={t.common.switchLanguage.aria}
      lang={next}
      className={`font-mono text-xs font-bold uppercase tracking-widest underline-offset-4 hover:underline ${className}`}
    >
      {t.common.switchLanguage.label}
    </button>
  );
};

export default LanguageToggle;
