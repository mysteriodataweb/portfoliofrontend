import { ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  /** Kept for existing call sites; sections no longer animate in. */
  delay?: number;
}

const AnimatedSection = ({ children, className }: AnimatedSectionProps) => <div className={className}>{children}</div>;

export default AnimatedSection;
