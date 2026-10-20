import { Link } from "react-router-dom";

type FooterLink = { label: string; to?: string; href?: string };

const columns: { title: string; links: FooterLink[] }[] = [
  {
    title: "Site",
    links: [
      { label: "Projets", to: "/projets" },
      { label: "Compétences", to: "/competences" },
      { label: "Engagements", to: "/engagements" },
      { label: "Blog", to: "/blog" },
      { label: "CV", to: "/cv" },
      { label: "À propos", to: "/about" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "Me contacter", to: "/contact" },
      { label: "Email", href: "mailto:fredbiam9@gmail.com" },
    ],
  },
  {
    title: "Suivre",
    links: [
      { label: "GitHub", href: "https://github.com/mysteriodataweb" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/alfredbiam" },
    ],
  },
];

const linkClass = "text-muted-foreground transition-colors hover:text-foreground";

const Footer = () => (
  <footer className="border-t border-border bg-secondary/50">
    <div className="container mx-auto flex flex-col gap-10 px-6 py-10 md:flex-row md:justify-between">
      <div>
        <Link to="/" className="text-xl font-semibold tracking-tight text-foreground">
          Alfred BIAM<span className="text-accent">.</span>
        </Link>
        <p className="mt-3 text-sm text-muted-foreground">© {new Date().getFullYear()}</p>
      </div>
      <div className="grid grid-cols-2 gap-x-16 gap-y-8 sm:grid-cols-3">
        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="text-sm font-semibold text-foreground">{column.title}</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {column.links.map(({ label, to, href }) => (
                <li key={label}>
                  {to ? (
                    <Link to={to} className={linkClass}>
                      {label}
                    </Link>
                  ) : (
                    <a
                      href={href}
                      className={linkClass}
                      {...(href?.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      {label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
    </div>
  </footer>
);

export default Footer;
