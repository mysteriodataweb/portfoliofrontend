import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ReelPanel } from "@/components/engagements/ScrollReel";
import { useEngagementData } from "@/hooks/use-engagement-data";
import { useActivities } from "@/hooks/use-activities";
import { useAdmin } from "@/contexts/AdminContext";
import { mediaStill, parseMedia } from "@/lib/media";
import { activitiesSection, engagementChapters } from "@/data/engagements";
import type { EngagementChapter } from "@/data/engagements";

const ChapterStrip = ({ chapter }: { chapter: EngagementChapter }) => {
  const { data } = useEngagementData(chapter.slug, chapter.defaults);
  const href = `/engagements/${chapter.slug}`;

  return (
    <section className="border-t border-foreground/15 py-12 md:py-16">
      <div className="container mx-auto grid grid-cols-1 gap-6 px-6 md:grid-cols-12 md:items-end">
        <h2 className="text-2xl font-normal text-foreground md:col-span-7">
          <Link to={href} className="transition-colors hover:text-foreground">
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

const ActivitiesStrip = () => {
  const { isAdmin } = useAdmin();
  const { data: activities = [] } = useActivities();

  // Visitors only see this section once something has been published.
  if (activities.length === 0 && !isAdmin) return null;

  return (
    <section className="border-t border-foreground/15 py-12 md:py-16">
      <div className="container mx-auto grid grid-cols-1 gap-6 px-6 md:grid-cols-12 md:items-end">
        <h2 className="text-2xl font-normal text-foreground md:col-span-7">
          <Link to={activitiesSection.path} className="transition-colors hover:text-foreground">
            {activitiesSection.title}
          </Link>
        </h2>
        <div className="md:col-span-5">
          <p className="max-w-[40ch] text-lg leading-snug text-muted-foreground">{activitiesSection.pitch}</p>
          <Link to={activitiesSection.path} className="link-arrow mt-4">
            {activities.length === 0 ? "Publier une première activité" : "Voir toutes les activités"}{" "}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {activities.length > 0 && (
        <div
          role="region"
          aria-label={`Aperçu : ${activitiesSection.title}`}
          tabIndex={0}
          className="reel-gutter no-scrollbar mt-10 flex snap-x snap-mandatory items-start gap-5 overflow-x-auto scroll-pl-[var(--gutter)] pr-[var(--gutter)]"
        >
          {activities.slice(0, 8).map((activity, i) => (
            <Link
              key={activity.id}
              to={activitiesSection.path}
              className="shrink-0 snap-start"
              tabIndex={-1}
              aria-hidden="true"
            >
              <ReelPanel
                size="sm"
                index={i}
                event={{
                  date: activity.category || "",
                  title: activity.title,
                  description: activity.description || "",
                  image: mediaStill(parseMedia(activity.mediaUrl)),
                }}
              />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

const EngagementsPage = () => {
  return (
    <>
      <header className="container mx-auto px-6 pb-16 pt-12 md:pb-24 md:pt-20">
        <h1 className="text-3xl font-normal text-foreground">
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

      <ActivitiesStrip />

      <section className="bg-foreground text-background">
        <div className="container mx-auto flex flex-col gap-8 px-6 py-20 md:flex-row md:items-end md:justify-between">
          <p className="max-w-[30ch] text-2xl md:text-3xl font-normal tracking-tight">
            Un événement, un atelier, une équipe à compléter ?
          </p>
          <Link
            to="/contact"
            className="inline-flex w-fit items-center gap-2 rounded-md bg-background px-6 py-3 text-sm font-semibold text-foreground"
          >
            Écrivez-moi <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
};

export default EngagementsPage;
