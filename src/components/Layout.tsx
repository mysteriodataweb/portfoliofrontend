import { ReactNode, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import InternshipPopup from "./InternshipPopup";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

interface LayoutProps {
  children: ReactNode;
  /** The page starts under the transparent bar (home hero) instead of below it. */
  fullBleed?: boolean;
}

const Layout = ({ children, fullBleed = false }: LayoutProps) => {
  const { pathname } = useLocation();
  const main = useRef<HTMLElement>(null);
  useScrollReveal(main);

  // Each page opens at its top, including when arriving from a link at the bottom of another one.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main ref={main} className={`flex-1 ${fullBleed ? "" : "pt-16 md:pt-20"}`}>
        {children}
      </main>
      <Footer />
      <InternshipPopup />
    </div>
  );
};

export default Layout;
