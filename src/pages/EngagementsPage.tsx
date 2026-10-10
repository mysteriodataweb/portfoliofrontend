import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ReelPanel } from "@/components/engagements/ScrollReel";
import { useEngagementData } from "@/hooks/use-engagement-data";
import { engagementChapters } from "@/data/engagements";
import type { EngagementChapter } from "@/data/engagements";

const ChapterStrip = ({ chapter }: { chapter: EngagementChapter }) => {
  const { data } = useEngagementData(chapter.slug, chapter.defaults);
  const href = `/engagements/${chapter.slug}`;

  return (
    <section className="border-t border-foreground/15 py-12 md:py-16">
      <div className="container mx-auto grid grid-cols-1 gap-6 px-6 md:grid-cols-12 md:items-end">
        <h2 className="font-heading text-4xl md:text-6xl font-bold tracking-[-0.03em] text-foreground md:col-span-7">
          <Link to={href} className="transition-colors hover:text-accent">
            {chapter.title}
          </Link>
        </h2>
        <div className="md:col-span-5">
          <p className="max-w-[40ch] text-lg leading-snug text-muted-foreground">{chapter.pitch}</p>
          <Link to={href} className="link-arrow mt-4">
            Ouvrir le chapitre <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <div
        role="region"
        aria-label={`Aperçu : ${chapter.title}`}
        tabIndex={0}
        className="reel-gutter no-scrollbar mt-10 flex snap-x snap-mandatory items-start gap-5 overflow-x-auto scroll-pl-[var(--gutter)] pr-[var(--gutter)]"
      >
        {data.events.map((event, i) => (
          <Link key={i} to={href} className="shrink-0 snap-start" tabIndex={-1} aria-hidden="true">
            <ReelPanel event={event} index={i} size="sm" />
          </Link>
        ))}
      </div>
    </section>
  );
};

const EngagementsPage = () => {
  return (
    <>
      <header className="container mx-auto px-6 pb-16 pt-12 md:pb-24 md:pt-20">
        <h1 className="max-w-[12ch] font-heading text-[clamp(3rem,10vw,8.5rem)] font-bold leading-[0.92] tracking-[-0.045em] text-foreground">
          Je ne fais pas que coder.
        </h1>
        <p className="mt-8 max-w-[52ch] text-xl md:text-2xl leading-snug text-muted-foreground">
          Quatre terrains où j'apprends autrement : en compétition, sur scène, auprès de ceux qui
          débutent, et seul face à un modèle qui vient de sortir.
        </p>
      </header>

      {engagementChapters.map((chapter) => (
        <ChapterStrip key={chapter.slug} chapter={chapter} />
      ))}

      <section className="bg-foreground text-background">
        <div className="container mx-auto flex flex-col gap-8 px-6 py-20 md:flex-row md:items-end md:justify-between">
          <p className="max-w-[18ch] font-heading text-4xl md:text-6xl font-bold leading-[1] tracking-[-0.03em]">
            Un événement, un atelier, une équipe à compléter ?
          </p>
          <Link
            to="/contact"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-foreground transition-transform hover:-translate-y-0.5"
          >
            Écrivez-moi <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
};

export default EngagementsPage;
