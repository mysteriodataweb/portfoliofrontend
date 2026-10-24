import { ReactNode, useLayoutEffect, useRef } from "react";
import { gsap, reducedMotion } from "@/lib/motion";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  /** Extra wait in seconds, to stagger neighbouring blocks. */
  delay?: number;
}

/** Fades and slides its content up the first time it enters the viewport. */
const AnimatedSection = ({ children, className, delay = 0 }: AnimatedSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from(el, {
        autoAlpha: 0,
        y: 48,
        duration: 0.9,
        delay,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 98%", once: true },
      });
    });
    return () => ctx.revert();
  }, [delay]);

  return (
    <div ref={ref} data-animated className={className}>
      {children}
    </div>
  );
};

export default AnimatedSection;
