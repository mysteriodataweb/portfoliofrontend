import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Bell, Github } from "lucide-react";
import AdminLogoutButton from "./AdminLogoutButton";
import { useAdmin } from "@/contexts/AdminContext";
import { useUnreadCount } from "@/hooks/use-messages";

const navLinks = [
  { label: "Projets", href: "/projets" },
  { label: "Compétences", href: "/competences" },
  { label: "Engagements", href: "/engagements" },
  { label: "Blog", href: "/blog" },
  { label: "CV", href: "/cv" },
  { label: "À propos", href: "/about" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isAdmin } = useAdmin();
  const { data: unreadData } = useUnreadCount(isAdmin);
  const unreadCount = unreadData?.count || 0;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const isActive = (href: string) => location.pathname.startsWith(href);

  const unreadBadge = unreadCount > 0 && (
    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-semibold text-white">
      {unreadCount > 9 ? "9+" : unreadCount}
    </span>
  );

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b bg-background ${
        scrolled || isOpen ? "border-border" : "border-transparent"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center px-6">
        <Link to="/" className="text-lg font-semibold tracking-tight text-foreground">
          Alfred BIAM<span className="text-accent">.</span>
        </Link>

        <nav aria-label="Navigation principale" className="ml-10 hidden items-center gap-7 xl:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`text-base transition-colors hover:text-foreground ${
                isActive(link.href) ? "font-medium text-foreground" : "text-foreground/70"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-2 xl:flex">
          <a
            href="https://github.com/mysteriodataweb"
            target="_blank"
            rel="noopener noreferrer"
            className="mr-2 inline-flex h-9 items-center gap-1.5 text-sm font-medium text-foreground hover:underline"
          >
            <Github size={16} /> GitHub
          </a>
          {isAdmin && (
            <Link
              to="/notifications"
              aria-label="Messages reçus"
              className="relative inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-sm font-medium hover:border-foreground"
            >
              <Bell size={15} />
              {unreadBadge}
            </Link>
          )}
          <AdminLogoutButton />
          <Link
            to="/contact"
            className="inline-flex h-9 items-center rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-black"
          >
            Me contacter
          </Link>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="-mr-2 ml-auto p-2 text-foreground xl:hidden"
          aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isOpen && (
        <nav
          aria-label="Navigation principale"
          className="container mx-auto flex max-h-[calc(100vh-4rem)] flex-col overflow-y-auto px-6 pb-6 xl:hidden"
        >
          {[...navLinks, { label: "Contact", href: "/contact" }].map((link) => (
            <Link
              key={link.href}
              to={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`border-b border-border py-3 text-base ${
                isActive(link.href) ? "font-medium text-foreground" : "text-foreground/70"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {isAdmin && (
              <Link
                to="/notifications"
                className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-card px-3 text-sm font-medium"
              >
                <Bell size={15} /> Messages {unreadBadge}
              </Link>
            )}
            <AdminLogoutButton />
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
