import { Link } from "react-router-dom";
import { Github, Linkedin, Mail, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Projets", to: "/projets" },
  { label: "Competences", to: "/competences" },
  { label: "Engagements", to: "/engagements" },
  { label: "Blog", to: "/blog" },
  { label: "CV", to: "/cv" },
  { label: "A propos", to: "/about" },
];

const socials = [
  { label: "GitHub", href: "https://github.com/mysteriodataweb", icon: Github },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/alfredbiam", icon: Linkedin },
  { label: "Email", href: "mailto:fredbiam9@gmail.com", icon: Mail },
];

const Wave = () => (
  <svg
    className="h-full w-1/2"
    viewBox="0 0 1800 500"
    preserveAspectRatio="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M0 250C200 150 400 50 600 100C800 150 1000 350 1200 300C1400 250 1600 150 1800 250V500H0V250Z"
      fill="currentColor"
      className="text-accent/10"
    />
    <path
      d="M0 250C200 200 400 100 600 150C800 200 1000 350 1200 300C1400 250 1600 200 1800 250V500H0V250Z"
      fill="currentColor"
      className="text-accent/15"
    />
  </svg>
);

const AnimatedWaveFooter = () => {
  return (
    <footer className="relative bg-gradient-to-b from-background to-accent/10 pt-20">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Two identical waves side by side so the -50% loop is seamless */}
        <div className="absolute bottom-0 left-0 flex h-[500px] w-[3600px] min-w-[200%] animate-wave">
          <Wave />
          <Wave />
        </div>
      </div>
      <div className="container relative z-10 mx-auto px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="font-heading text-xl font-bold text-foreground">
              Alfred<span className="text-accent">.</span>Mysteriowebdata
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Data Scientist & Fullstack Developer passionne par l'IA, le machine learning et les applications web modernes.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Navigation</h3>
            <nav className="space-y-2 text-sm">
              {navLinks.map(({ label, to }) => (
                <Link key={to} to={to} className="block transition-colors hover:text-accent">
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Travaillons ensemble</h3>
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
              Un projet data, IA ou web ? Parlons-en.
            </p>
            <Button asChild className="rounded-full">
              <Link to="/contact">
                Me contacter <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Me suivre</h3>
            <div className="flex space-x-2">
              {socials.map(({ label, href, icon: Icon }) => (
                <Button key={label} asChild variant="ghost" size="icon" className="rounded-full">
                  <a
                    href={href}
                    {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="sr-only">{label}</span>
                  </a>
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-foreground/10 py-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Alfred.Mysteriowebdata — Tous droits reserves
          </p>
          <div className="flex gap-1 text-xs text-muted-foreground">
            <span className="text-accent">●</span> Made with passion
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AnimatedWaveFooter;
