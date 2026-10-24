import { Link } from "react-router-dom";
import { ArrowRight } from "@phosphor-icons/react";
import { useLanguage } from "@/i18n";

const NotFound = () => {
  const { t } = useLanguage();

  return (
    <section className="flex min-h-[70vh] flex-col justify-end px-4 pb-16 pt-10 md:px-8 md:pb-24">
      <p className="eyebrow">{t.notFound.eyebrow}</p>
      <h1 className="mt-4 text-[34vw] font-black uppercase leading-[0.8] tracking-tighter md:text-[24vw]">
        4<span className="text-dutch-orange">0</span>4
      </h1>
      <div className="mt-10 flex flex-wrap items-end justify-between gap-6 border-t border-foreground pt-8">
        <p className="max-w-[44ch] text-lg text-muted-foreground">{t.notFound.text}</p>
        <Link to="/" className="btn-ink">
          {t.notFound.back} <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
};

export default NotFound;
