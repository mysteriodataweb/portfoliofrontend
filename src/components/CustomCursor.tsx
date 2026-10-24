import { useEffect, useRef, useState } from "react";
import { gsap, reducedMotion } from "@/lib/motion";

const INTERACTIVE = "a, button, [role='button'], [role='tab'], summary, label[for], select, [data-cursor-hover]";
const TEXT_FIELD = "input:not([type='submit']):not([type='button']):not([type='checkbox']):not([type='radio']), textarea, [contenteditable='true']";

/** Orange dot plus a black ring that trails it, grows and turns orange over links and buttons. Mouse only. */
const CustomCursor = () => {
  const [enabled, setEnabled] = useState(false);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEnabled(window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reducedMotion());
  }, []);

  useEffect(() => {
    const dotEl = dot.current;
    const ringEl = ring.current;
    if (!enabled || !dotEl || !ringEl) return;

    document.documentElement.classList.add("has-custom-cursor");
    gsap.set([dotEl, ringEl], { xPercent: -50, yPercent: -50 });
    const dotX = gsap.quickTo(dotEl, "x", { duration: 0.08, ease: "power3" });
    const dotY = gsap.quickTo(dotEl, "y", { duration: 0.08, ease: "power3" });
    const ringX = gsap.quickTo(ringEl, "x", { duration: 0.45, ease: "power3" });
    const ringY = gsap.quickTo(ringEl, "y", { duration: 0.45, ease: "power3" });

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);

      const target = e.target instanceof Element ? e.target : null;
      const overField = !!target?.closest(TEXT_FIELD);
      ringEl.classList.toggle("is-hover", !overField && !!target?.closest(INTERACTIVE));
      ringEl.classList.toggle("is-dark", !!target?.closest("[data-dark]"));
      // Text fields keep their own caret cursor.
      const opacity = overField ? "0" : "1";
      dotEl.style.opacity = opacity;
      ringEl.style.opacity = opacity;
    };
    const hide = () => {
      dotEl.style.opacity = "0";
      ringEl.style.opacity = "0";
    };

    document.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("mouseleave", hide);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", hide);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ring}
        aria-hidden="true"
        className="cursor-ring pointer-events-none fixed left-0 top-0 z-[200] h-10 w-10 rounded-full border border-deep-black opacity-0"
      />
      <div
        ref={dot}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[200] h-2 w-2 rounded-full bg-dutch-orange opacity-0"
      />
    </>
  );
};

export default CustomCursor;
