import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  MotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import type { TimelineEvent } from "@/hooks/use-engagement-data";

type PanelSize = "lg" | "sm";

const mediaHeight: Record<PanelSize, string> = {
  lg: "h-[46vh] min-h-[280px]",
  sm: "h-56 md:h-72",
};

const panelWidth = (size: PanelSize, index: number, hasImage: boolean) => {
  if (size === "sm") return "w-[70vw] sm:w-80";
  if (!hasImage) return "w-[78vw] md:w-[34vw]";
  return index % 2 === 0 ? "w-[78vw] md:w-[44vw]" : "w-[78vw] md:w-[30vw]";
};

// Panels without a photo become a typographic plate; inks alternate so two never look the same in a row.
const plateTone = (index: number) =>
  index % 2 === 0 ? "bg-foreground text-background" : "bg-accent text-foreground";

export const ReelPanel = ({
  event,
  index,
  size = "lg",
}: {
  event: TimelineEvent;
  index: number;
  size?: PanelSize;
}) => {
  const hasImage = Boolean(event.image);
  const width = panelWidth(size, index, hasImage);

  if (!hasImage) {
    return (
      <article
        className={`${width} ${mediaHeight[size]} ${plateTone(index)} shrink-0 snap-start rounded-[1.25rem] p-6 md:p-8 flex flex-col justify-between`}
      >
        <p className="text-sm font-medium opacity-70">{event.date}</p>
        <div>
          <h3
            className={
              size === "lg"
                ? "font-heading font-bold leading-[1.05] tracking-tight text-2xl md:text-[2.25rem]"
                : "font-heading font-bold leading-tight text-xl md:text-2xl"
            }
          >
            {event.title}
          </h3>
          {size === "lg" && (
            <p className="mt-4 max-w-[42ch] text-sm md:text-base leading-relaxed opacity-80">
              {event.description}
            </p>
          )}
        </div>
      </article>
    );
  }

  return (
    <article className={`${width} shrink-0 snap-start`}>
      <div className={`${mediaHeight[size]} overflow-hidden rounded-[1.25rem] bg-secondary`}>
        <img
          src={event.image!}
          alt={event.title}
          loading="lazy"
          draggable={false}
          className="h-full w-full object-cover"
        />
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{event.date}</p>
      <h3
        className={
          size === "lg"
            ? "mt-1 font-heading text-xl md:text-2xl font-bold text-foreground"
            : "mt-1 font-heading text-lg font-semibold text-foreground"
        }
      >
        {event.title}
      </h3>
      {size === "lg" && (
        <p className="mt-2 max-w-[46ch] text-sm md:text-[0.95rem] leading-relaxed text-muted-foreground">
          {event.description}
        </p>
      )}
    </article>
  );
};

const pad = (n: number) => String(n).padStart(2, "0");

const ReelChrome = ({ progress, count }: { progress: MotionValue<number>; count: number }) => {
  const [active, setActive] = useState(0);
  useMotionValueEvent(progress, "change", (v) => {
    setActive(Math.min(count - 1, Math.max(0, Math.round(v * (count - 1)))));
  });

  return (
    <div className="reel-gutter flex items-center gap-6 pr-[var(--gutter)]">
      <p className="font-heading text-sm font-medium tabular-nums text-foreground" aria-live="polite">
        {pad(active + 1)} <span className="text-muted-foreground">/ {pad(count)}</span>
      </p>
      <div className="h-px flex-1 bg-foreground/15">
        <motion.div className="h-px origin-left bg-foreground" style={{ scaleX: progress }} />
      </div>
    </div>
  );
};

/** Vertical scroll drives the strip sideways while the stage stays pinned. */
const PinnedReel = ({ events }: { events: TimelineEvent[] }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () =>
      setDistance(Math.max(0, track.scrollWidth - document.documentElement.clientWidth));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [events.length]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  return (
    <div ref={sectionRef} className="relative" style={{ height: `calc(100vh + ${distance}px)` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center gap-8 overflow-hidden pt-20">
        <motion.div
          ref={trackRef}
          style={{ x }}
          className="reel-gutter flex w-max items-start gap-8 pr-[var(--gutter)] will-change-transform"
        >
          {events.map((event, i) => (
            <ReelPanel key={i} event={event} index={i} />
          ))}
        </motion.div>
        <ReelChrome progress={scrollYProgress} count={events.length} />
      </div>
    </div>
  );
};

/** Touch screens and reduced-motion users get a plain swipeable strip. */
const NativeReel = ({ events, label }: { events: TimelineEvent[]; label: string }) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const { scrollXProgress } = useScroll({ container: scrollerRef });

  return (
    <div className="space-y-8 py-8">
      <div
        ref={scrollerRef}
        role="region"
        aria-label={label}
        tabIndex={0}
        className="reel-gutter no-scrollbar relative flex snap-x snap-mandatory items-start gap-5 overflow-x-auto scroll-pl-[var(--gutter)] pr-[var(--gutter)]"
      >
        {events.map((event, i) => (
          <ReelPanel key={i} event={event} index={i} />
        ))}
      </div>
      <ReelChrome progress={scrollXProgress} count={events.length} />
    </div>
  );
};

const usePinnable = () => {
  const reduced = useReducedMotion();
  const [roomy, setRoomy] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px) and (min-height: 620px) and (pointer: fine)");
    const update = () => setRoomy(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return roomy && !reduced;
};

const ScrollReel = ({ events, label }: { events: TimelineEvent[]; label: string }) => {
  const pinnable = usePinnable();
  if (events.length === 0) return null;
  return pinnable ? <PinnedReel events={events} /> : <NativeReel events={events} label={label} />;
};

export default ScrollReel;
