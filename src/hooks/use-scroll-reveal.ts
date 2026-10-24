import { RefObject, useEffect } from "react";
import { gsap, reducedMotion, ScrollTrigger } from "@/lib/motion";

// Page titles, section titles, and anything marked data-reveal rise into view as they are scrolled to.
const SELECTOR = "h1.display-title, h2.section-title, [data-reveal]";

/**
 * Watches a page: content that arrives later (data loaded from the API) is picked up too,
 * and scroll positions are recomputed when the page grows.
 */
export function useScrollReveal(root: RefObject<HTMLElement>) {
  useEffect(() => {
    const container = root.current;
    if (!container || reducedMotion()) return;

    const triggers: ScrollTrigger[] = [];
    const reveal = () => {
      container.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => {
        if (el.dataset.revealed || el.closest("[data-animated]")) return;
        el.dataset.revealed = "true";
        const tween = gsap.from(el, {
          autoAlpha: 0,
          y: 40,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 98%", once: true },
        });
        if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
      });
    };

    reveal();
    let timer: number | undefined;
    const observer = new MutationObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        reveal();
        ScrollTrigger.refresh();
      }, 120);
    });
    observer.observe(container, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
      triggers.forEach((trigger) => trigger.kill());
    };
  }, [root]);
}
