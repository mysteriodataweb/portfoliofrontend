import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import InternshipPopup from "./InternshipPopup";

const Layout = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();

  // Each page opens at its top, including when arriving from a link at the bottom of another one.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
      <InternshipPopup />
    </div>
  );
};

export default Layout;
