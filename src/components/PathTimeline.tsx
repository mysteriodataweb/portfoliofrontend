import { Link } from "react-router-dom";
import { ArrowRight } from "@phosphor-icons/react";
import type { PathEntry } from "@/data/parcours";
import { useLanguage } from "@/i18n";

interface PathTimelineProps {
  entries: PathEntry[];
  /** Heading level of each entry, under the heading of the list. */
  as?: "h3" | "h4";
}

/** Experience or education, one row per entry: the period on the left, the details on the right. */
const PathTimeline = ({ entries, as: Heading = "h3" }: PathTimelineProps) => {
  const { t } = useLanguage();
  return (
    <ol className="mt-4">
      {entries.map((entry) => (
        <li
          key={`${entry.org}-${entry.period}`}
          className="grid grid-cols-1 gap-2 border-t border-foreground/15 py-6 md:grid-cols-12 md:gap-8"
        >
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground md:col-span-3 md:pt-1.5">{entry.period}</p>
          <div className="md:col-span-9">
            <Heading className="text-xl font-black uppercase tracking-tighter text-foreground md:text-2xl">{entry.org}</Heading>
            <p className="mt-1 text-foreground">
              {entry.title}
              {entry.place ? ` · ${entry.place}` : ""}
            </p>
            {entry.points.length > 0 && (
              <ul className="mt-3 max-w-[64ch] list-disc space-y-1 pl-5 leading-relaxed text-muted-foreground marker:text-foreground">
                {entry.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            )}
            {entry.project && (
              <Link to={`/projet/${entry.project}`} className="mt-3 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest underline-offset-4 hover:underline">
                {t.cv.seeProject} <ArrowRight size={12} aria-hidden="true" />
              </Link>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
};

export default PathTimeline;
