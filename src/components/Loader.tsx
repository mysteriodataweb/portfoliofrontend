import { useLayoutEffect, useRef, useState } from "react";
import { finishIntro, gsap, reducedMotion } from "@/lib/motion";

const SEEN_KEY = "loader-seen";
const MIN_DURATION = 1_300;
const MAX_WAIT = 3_500;

const alreadySeen = () => {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
};

const markSeen = () => {
  try {
    sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    // Storage unavailable: the loader may show again on the next visit, nothing else changes.
  }
};

const pageLoaded = () =>
  new Promise<void>((resolve) => {
    if (document.readyState === "complete") resolve();
    else window.addEventListener("load", () => resolve(), { once: true });
  });

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const NAME = "Alfred Biam";

/** Full-screen black curtain shown on the first page of a visit, then slid away upwards. */
const Loader = () => {
  const [visible, setVisible] = useState(() => !reducedMotion() && !alreadySeen());
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    if (!visible) {
      finishIntro();
      return;
    }
    markSeen();
    document.documentElement.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      gsap.from(".loader-letter", { yPercent: 110, stagger: 0.035, duration: 0.8, ease: "power4.out" });
      const progress = { value: 0 };
      gsap.to(progress, {
        value: 100,
        duration: MIN_DURATION / 1000,
        ease: "power2.inOut",
        onUpdate: () => {
          if (counter.current) counter.current.textContent = String(Math.round(progress.value)).padStart(3, "0");
        },
      });
    }, root);

    let cancelled = false;
    // Leave once the page has loaded, after a short minimum, and never wait more than a few seconds.
    Promise.race([Promise.all([pageLoaded(), document.fonts?.ready, wait(MIN_DURATION)]), wait(MAX_WAIT)]).then(() => {
      if (cancelled) return;
      gsap
        .timeline({
          onComplete: () => {
            document.documentElement.style.overflow = "";
            setVisible(false);
          },
        })
        .to(".loader-content", { yPercent: -40, autoAlpha: 0, duration: 0.5, ease: "power2.in" }, 0)
        .to(root.current, { yPercent: -100, duration: 0.9, ease: "power4.inOut" }, 0.15)
        .add(() => finishIntro(), 0.55);
    });

    return () => {
      cancelled = true;
      document.documentElement.style.overflow = "";
      ctx.revert();
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      ref={root}
      data-dark
      aria-hidden="true"
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-deep-black p-5 text-off-white md:p-10"
    >
      <div className="loader-content flex justify-between font-mono text-xs uppercase tracking-widest text-off-white/60">
        <span>Portfolio</span>
        <span>Casablanca</span>
      </div>
      <p className="loader-content overflow-hidden whitespace-nowrap text-[13vw] font-black uppercase leading-[0.85] tracking-tighter">
        {NAME.split("").map((letter, i) => (
          <span key={i} className="loader-letter inline-block">
            {letter === " " ? " " : letter}
          </span>
        ))}
        <span className="loader-letter inline-block text-dutch-orange">.</span>
      </p>
      <div className="loader-content flex justify-between font-mono text-xs uppercase tracking-widest">
        <span className="text-off-white/60">Data &amp; AI Engineer</span>
        <span ref={counter}>000</span>
      </div>
    </div>
  );
};

export default Loader;
