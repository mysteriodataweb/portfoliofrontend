import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

/** Visitors who asked their system for less motion get the final state of every animation, without movement. */
export const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// The loader resolves this once it has left the screen: the home title and the pop-up wait for it.
let resolveIntro: () => void = () => {};
export const introDone = new Promise<void>((resolve) => {
  resolveIntro = resolve;
});
export const finishIntro = () => resolveIntro();
