import { Link } from "react-router-dom";
import { ArrowUpRight } from "@phosphor-icons/react";
import { useAdmin } from "@/contexts/AdminContext";
import { siteLinks } from "@/data/site-links";

const linkClass = "transition-colors hover:text-dutch-orange";

const Footer = () => {
  const { isAdmin } = useAdmin();
  const links = siteLinks.filter((link) => isAdmin || !link.adminOnly);

  return (
    <footer data-dark className="overflow-hidden bg-deep-black text-off-white">
      <div className="px-4 pb-8 pt-16 md:px-8 md:pt-24">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="font-mono text-xs uppercase tracking-widest text-off-white/50">(Contact)</p>
            <a
              href="mailto:fredbiam9@gmail.com"
              className="mt-4 inline-block break-all text-2xl font-black uppercase tracking-tighter transition-colors hover:text-dutch-orange md:text-4xl"
            >
              fredbiam9@gmail.com
            </a>
          </div>
          <nav aria-label="Pages du site" className="md:col-span-3">
            <p className="font-mono text-xs uppercase tracking-widest text-off-white/50">(Site)</p>
            <ul className="mt-4 space-y-2 font-mono text-sm uppercase tracking-widest">
              {links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Réseaux" className="md:col-span-3">
            <p className="font-mono text-xs uppercase tracking-widest text-off-white/50">(Suivre)</p>
            <ul className="mt-4 space-y-2 font-mono text-sm uppercase tracking-widest">
              {[
                { label: "GitHub", href: "https://github.com/mysteriodataweb" },
                { label: "LinkedIn", href: "https://www.linkedin.com/in/alfredbiam" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1 ${linkClass}`}>
                    {label} <ArrowUpRight size={12} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p
          aria-hidden="true"
          className="mt-16 whitespace-nowrap text-[13.5vw] font-black uppercase leading-[0.8] tracking-tighter md:mt-24"
        >
          Alfred Biam<span className="text-dutch-orange">.</span>
        </p>

        <div className="mt-8 flex flex-col gap-2 border-t border-off-white/15 pt-6 font-mono text-xs uppercase tracking-widest text-off-white/50 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} Alfred BIAM</span>
          <span>Casablanca, Maroc</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
