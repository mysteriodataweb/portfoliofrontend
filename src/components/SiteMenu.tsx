import { RefObject, useEffect, useLayoutEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, X } from "@phosphor-icons/react";
import { useAdmin } from "@/contexts/AdminContext";
import { useUnreadCount } from "@/hooks/use-messages";
import { gsap, reducedMotion } from "@/lib/motion";
import { siteLinks } from "@/data/site-links";
import { useLanguage } from "@/i18n";
import LanguageToggle from "./LanguageToggle";


interface SiteMenuProps {
  open: boolean;
  onClose: () => void;
  /** The Menu button, focused again when the menu closes. */
  returnFocus: RefObject<HTMLButtonElement>;
}

/** Full-screen black menu that slides up from the bottom, its links rising one after the other. */
const SiteMenu = ({ open, onClose, returnFocus }: SiteMenuProps) => {
  const { pathname } = useLocation();
  const { isAdmin, logout } = useAdmin();
  const { t } = useLanguage();
  const { data: unreadData } = useUnreadCount(isAdmin);
  const unread = unreadData?.count || 0;
  const root = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline>();
  const firstOpen = useRef(true);

  const links = siteLinks.filter((link) => isAdmin || !link.adminOnly);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(root.current, { yPercent: 100, visibility: "hidden" });
      timeline.current = gsap
        // Hidden again once closed, so its links can't be reached with the keyboard while off screen.
        .timeline({ paused: true, onReverseComplete: () => gsap.set(root.current, { visibility: "hidden" }) })
        .set(root.current, { visibility: "visible" })
        .to(root.current, { yPercent: 0, duration: 0.8, ease: "power4.inOut" })
        .from(".menu-link", { yPercent: 110, stagger: 0.06, duration: 0.7, ease: "power4.out" }, "-=0.35")
        .from(".menu-meta", { autoAlpha: 0, y: 16, duration: 0.5, ease: "power2.out" }, "-=0.45");
    }, root);
    return () => ctx.revert();
    // The link list changes when the admin signs in or out: rebuild the timeline then.
  }, [links.length]);

  useEffect(() => {
    const tl = timeline.current;
    if (!tl) return;
    if (firstOpen.current && !open) return;
    firstOpen.current = false;

    if (open) {
      document.documentElement.style.overflow = "hidden";
      // Visible right away (the timeline would only show it on its next tick), so the first link can take focus.
      gsap.set(root.current, { visibility: "visible" });
      if (reducedMotion()) tl.progress(1);
      else tl.timeScale(1).play();
      root.current?.querySelector<HTMLElement>(".menu-link")?.focus({ preventScroll: true });
    } else {
      document.documentElement.style.overflow = "";
      if (reducedMotion()) {
        tl.progress(0);
        gsap.set(root.current, { visibility: "hidden" });
      } else tl.timeScale(1.6).reverse();
      returnFocus.current?.focus();
    }
  }, [open, returnFocus]);

  // Leaving the page with the menu open (each route mounts its own layout) must not leave the page locked.
  useEffect(() => () => {
    document.documentElement.style.overflow = "";
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // A link was followed: the new page opens with the menu closed.
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div
      ref={root}
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label={t.nav.menu}
      data-dark
      className="invisible fixed inset-0 z-[80] flex flex-col overflow-y-auto bg-deep-black text-off-white"
    >
      <div className="flex h-16 shrink-0 items-center justify-between px-4 md:h-20 md:px-8">
        <Link to="/" className="text-lg font-black uppercase tracking-tighter md:text-xl">
          Alfred Biam<span className="text-dutch-orange">.</span>
        </Link>
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest hover:text-dutch-orange"
        >
          {t.nav.close} <X size={18} weight="bold" aria-hidden="true" />
        </button>
      </div>

      <nav aria-label={t.nav.mainNav} className="flex flex-1 items-center px-4 py-8 md:px-8">
        <ul>
          {links.map((link, i) => {
            const active = pathname.startsWith(link.to);
            return (
              <li key={link.to} className="overflow-hidden">
                <Link
                  to={link.to}
                  aria-current={active ? "page" : undefined}
                  className={`menu-link group flex items-start gap-3 py-1 text-[11vw] font-black uppercase leading-[0.9] tracking-tighter transition-colors hover:text-dutch-orange focus-visible:text-dutch-orange md:gap-5 md:text-[7vw] lg:text-[6.5vw] ${
                    active ? "text-dutch-orange" : ""
                  }`}
                >
                  <span className="mt-[0.4em] font-mono text-xs font-normal tracking-widest text-off-white/50 md:text-sm">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {t.nav[link.key]}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="menu-meta grid shrink-0 gap-6 border-t border-off-white/15 px-4 py-6 font-mono text-xs uppercase tracking-widest md:grid-cols-3 md:px-8">
        <div className="flex items-center gap-6">
          <a href="mailto:fredbiam9@gmail.com" className="hover:text-dutch-orange">
            fredbiam9@gmail.com
          </a>
          <LanguageToggle className="hover:text-dutch-orange" />
        </div>
        <div className="flex gap-6">
          <a href="https://github.com/mysteriodataweb" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-dutch-orange">
            GitHub <ArrowUpRight size={12} aria-hidden="true" />
          </a>
          <a href="https://www.linkedin.com/in/alfredbiam" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-dutch-orange">
            LinkedIn <ArrowUpRight size={12} aria-hidden="true" />
          </a>
        </div>
        {isAdmin && (
          <div className="flex gap-6 md:justify-end">
            <Link to="/notifications" className="hover:text-dutch-orange">
              {t.nav.messages}
              {unread > 0 ? ` (${unread})` : ""}
            </Link>
            <button onClick={logout} className="uppercase hover:text-dutch-orange">
              {t.nav.logout}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SiteMenu;
