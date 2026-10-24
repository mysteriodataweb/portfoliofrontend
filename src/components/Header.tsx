import { useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import { useUnreadCount } from "@/hooks/use-messages";
import SiteMenu from "./SiteMenu";
import LanguageToggle from "./LanguageToggle";
import { useLanguage } from "@/i18n";

/** Fixed bar in mix-blend-difference: white on dark sections, black on light ones, without a background. */
const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const { isAdmin } = useAdmin();
  const { t } = useLanguage();
  const { data: unreadData } = useUnreadCount(isAdmin);
  const unread = unreadData?.count || 0;
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 text-off-white mix-blend-difference">
        <div className="flex h-16 items-center justify-between px-4 md:h-20 md:px-8">
          <Link to="/" className="pointer-events-auto text-lg font-black uppercase tracking-tighter md:text-xl">
            Alfred Biam
          </Link>
          <div className="pointer-events-auto flex items-center gap-4 md:gap-8">
            <LanguageToggle />
            <button
              ref={menuButton}
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              className="font-mono text-xs font-bold uppercase tracking-widest underline-offset-4 hover:underline"
            >
              {t.nav.menu}
              {isAdmin && unread > 0 ? ` (${unread})` : ""}
            </button>
            <Link
              to="/contact"
              className="border border-off-white px-3 py-2 font-mono text-xs font-bold uppercase tracking-widest transition-colors hover:bg-off-white hover:text-deep-black md:px-5"
            >
              {t.common.contactMe}
            </Link>
          </div>
        </div>
      </header>
      <SiteMenu open={menuOpen} onClose={closeMenu} returnFocus={menuButton} />
    </>
  );
};

export default Header;
