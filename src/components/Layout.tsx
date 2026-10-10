import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./ui/animated-wave-footer";

const Layout = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();

  // Each page opens at its top, including when arriving from a link at the bottom of another one.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
