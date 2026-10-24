import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, PencilSimple } from "@phosphor-icons/react";
import profilePhoto from "@/assets/profile-photo.jpg";
import SkillsExplorer from "@/components/SkillsExplorer";
import Marquee from "@/components/Marquee";
import { useFeaturedProjects, useProjects } from "@/hooks/use-projects";
import { useBlogPosts } from "@/hooks/use-blog";
import { useSkills } from "@/hooks/use-skills";
import { useTools } from "@/hooks/use-tools";
import { useStats } from "@/hooks/use-stats";
import { useAdmin } from "@/contexts/AdminContext";
import { useLanguage } from "@/i18n";
import { localizeCategory, localizePost, localizeProject } from "@/i18n/content";
import { gsap, introDone, reducedMotion } from "@/lib/motion";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { api } from "@/api/client";
import { toast } from "sonner";

const formatMonth = (date: string, locale: string) => {
  const parsed = new Date(`${date.slice(0, 7)}-01T00:00:00`);
  return Number.isNaN(parsed.getTime())
    ? date
    : parsed.toLocaleDateString(locale, { month: "long", year: "numeric" });
};

const pad = (n: number) => String(n).padStart(2, "0");

/** "(02) En ce moment" above a large uppercase section title. */
const SectionHead = ({ index, eyebrow, title, link, dark = false }: { index: number; eyebrow: string; title: string; link?: { to: string; label: string }; dark?: boolean }) => (
  <div className={`flex flex-wrap items-end justify-between gap-6 border-b pb-6 ${dark ? "border-off-white/30" : "border-foreground"}`}>
    <div>
      <p className={`font-mono text-xs uppercase tracking-widest ${dark ? "text-off-white/50" : "text-muted-foreground"}`}>
        ({pad(index)}) {eyebrow}
      </p>
      <h2 className="section-title mt-3 md:text-6xl">{title}</h2>
    </div>
    {link && (
      <Link
        to={link.to}
        className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest underline-offset-4 hover:text-dutch-orange hover:underline"
      >
        {link.label} <ArrowRight size={14} aria-hidden="true" />
      </Link>
    )}
  </div>
);

const Index = () => {
  const { data: featured = [] } = useFeaturedProjects();
  const { data: allProjects = [] } = useProjects();
  const { data: allPosts = [] } = useBlogPosts();
  const { data: tools = [] } = useTools();
  const { data: skillsData } = useSkills();
  const { data: stats, refetch: refetchStats } = useStats();
  const { isAdmin } = useAdmin();
  const { lang, t } = useLanguage();
  const hero = useRef<HTMLElement>(null);
  const categoryLabel = (value: string) => t.categories[value] ?? value;

  const projects = featured.slice(0, 4).map((p) => localizeProject(p, lang));
  const featuredIds = new Set(projects.map((p) => p.id));
  const collection = allProjects
    .filter((p) => !featuredIds.has(p.id))
    .slice(0, 6)
    .map((p) => localizeProject(p, lang));
  const latestPosts = allPosts.slice(0, 3).map((p) => localizePost(p, lang));
  const skillCategories = (skillsData?.skillCategories ?? []).map((c) => localizeCategory(c, lang));

  const [showStatsDialog, setShowStatsDialog] = useState(false);
  const [statsForm, setStatsForm] = useState({ yearsExperience: 0, clientsCount: 0 });

  // The title lines rise once the loading screen has left (immediately on later visits).
  useLayoutEffect(() => {
    if (reducedMotion()) return;
    let cancelled = false;
    const ctx = gsap.context(() => {
      gsap.set(".hero-line", { yPercent: 110 });
      gsap.set(".hero-fade", { autoAlpha: 0, y: 24 });
    }, hero);
    introDone.then(() => {
      if (cancelled) return;
      ctx.add(() => {
        gsap
          .timeline()
          .to(".hero-line", { yPercent: 0, stagger: 0.12, duration: 1.1, ease: "power4.out" })
          .to(".hero-fade", { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.8, ease: "power3.out" }, "-=0.6");
      });
    });
    return () => {
      cancelled = true;
      ctx.revert();
    };
  }, []);

  const openEditStats = () => {
    setStatsForm({
      yearsExperience: stats?.yearsExperience ?? 0,
      clientsCount: stats?.clientsCount ?? 0,
    });
    setShowStatsDialog(true);
  };

  const saveStats = async () => {
    try {
      await api.put("/admin/stats", statsForm);
      toast.success("Statistiques mises à jour");
      setShowStatsDialog(false);
      refetchStats();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "L'enregistrement a échoué");
    }
  };

  const labels = t.home.figureLabels;
  // A figure still at zero is left out rather than shown as "0".
  const figures = stats
    ? [
        { count: stats.projectsCount, label: labels.projects(stats.projectsCount), to: "/projets" },
        { count: stats.articlesCount, label: labels.articles(stats.articlesCount), to: "/blog" },
        { count: stats.yearsExperience, label: labels.years(stats.yearsExperience), to: "/cv" },
        { count: stats.clientsCount, label: labels.clients(stats.clientsCount), to: "/contact" },
      ].filter((figure) => figure.count > 0)
    : [];

  let section = 0;
  const next = () => ++section;

  return (
    <>
      {/* Hero */}
      <section ref={hero} className="flex min-h-screen flex-col justify-end px-4 pb-10 pt-28 md:px-8 md:pb-14">
        <div className="hero-fade mb-6 flex justify-between font-mono text-xs uppercase tracking-widest text-muted-foreground md:mb-10">
          <span>(Portfolio) Alfred BIAM</span>
          <span className="hidden sm:inline">{t.common.location}</span>
        </div>
        <h1 className="text-[16vw] font-black uppercase leading-[0.82] tracking-tighter md:text-[13vw]">
          <span className="block overflow-hidden pb-[0.04em]">
            <span className="hero-line block">Data &amp; AI</span>
          </span>
          <span className="block overflow-hidden pb-[0.04em]">
            <span className="hero-line block text-dutch-orange">Engineer</span>
          </span>
        </h1>
        <div className="mt-10 grid grid-cols-1 gap-8 border-t border-foreground pt-8 md:grid-cols-12 md:items-end md:gap-6">
          <div className="hero-fade md:col-span-6">
            <p className="max-w-[46ch] text-lg leading-relaxed md:text-xl">{t.home.intro}</p>
            <p className="mt-5 font-mono text-xs uppercase leading-relaxed tracking-widest text-muted-foreground">
              {t.home.internshipLine}
            </p>
          </div>
          <div className="hero-fade flex flex-wrap gap-3 md:col-span-4 md:col-start-7">
            <Link to="/projets" className="btn-ink">
              {t.common.seeProjects} <ArrowRight size={14} aria-hidden="true" />
            </Link>
            <Link to="/cv" className="btn-paper">
              {t.common.readCv}
            </Link>
          </div>
          <div className="hero-fade group hidden overflow-hidden border border-foreground md:col-span-2 md:block">
            <img src={profilePhoto} alt="Alfred BIAM" className="img-reveal aspect-[4/5] w-full object-cover object-bottom" />
          </div>
        </div>
      </section>

      <Marquee label={t.home.marqueeLabel} items={t.home.marquee} />

      {/* Outils */}
      {tools.length > 0 && (
        <section aria-label={t.home.tools} className="px-4 pt-20 md:px-8 md:pt-28">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">({pad(next())}) {t.home.tools}</p>
          <ul data-reveal className="mt-6 grid grid-cols-2 border-l border-t border-foreground sm:grid-cols-4 xl:grid-cols-8">
            {tools.slice(0, 8).map((tool) => (
              <li
                key={tool.id}
                className="flex h-24 items-center justify-center gap-3 border-b border-r border-foreground px-3 font-mono text-xs font-bold uppercase tracking-widest transition-colors hover:bg-dutch-orange"
              >
                <img src={tool.image} alt="" loading="lazy" className="h-5 w-5 shrink-0 brightness-0" />
                <span className="truncate">{tool.name}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Projets sélectionnés */}
      {projects.length > 0 && (
        <section className="px-4 pt-24 md:px-8 md:pt-32">
          <SectionHead index={next()} eyebrow={t.home.featuredEyebrow} title={t.home.featuredTitle} link={{ to: "/projets", label: t.home.allProjects }} />
          {projects.map((project, i) => (
            <article key={project.id} className="group grid grid-cols-1 gap-8 border-b border-foreground py-12 md:grid-cols-12 md:gap-12 md:py-16">
              <Link
                to={`/projet/${project.slug}`}
                tabIndex={-1}
                aria-hidden="true"
                className={`block overflow-hidden border border-foreground md:col-span-7 ${i % 2 ? "md:order-2" : ""}`}
              >
                <img src={project.image} alt="" loading="lazy" className="img-reveal aspect-[16/10] w-full object-cover" />
              </Link>
              <div data-reveal className="flex flex-col md:col-span-5">
                <div className="flex justify-between gap-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  <span>{pad(i + 1)}</span>
                  <span>
                    {categoryLabel(project.category)} · {formatMonth(project.date, t.locale)}
                  </span>
                </div>
                <h3 className="mt-6 text-3xl font-black uppercase leading-[0.95] tracking-tighter md:text-5xl">
                  <Link to={`/projet/${project.slug}`} className="transition-colors hover:text-dutch-orange">
                    {project.title}
                  </Link>
                </h3>
                <p className="mt-5 max-w-[48ch] leading-relaxed text-muted-foreground">{project.shortDescription}</p>
                <ul className="mt-6 flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-wider">
                  {project.techStack.slice(0, 6).map((tech) => (
                    <li key={tech} className="border border-foreground/30 px-2 py-1">
                      {tech}
                    </li>
                  ))}
                </ul>
                <Link to={`/projet/${project.slug}`} className="link-arrow mt-8 self-start">
                  {t.common.viewProject} <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </section>
      )}

      {/* Chiffres */}
      {(figures.length > 0 || isAdmin) && (
        <section aria-label={t.home.figures} className="px-4 pt-24 md:px-8 md:pt-32">
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">({pad(next())}) {t.home.figures}</p>
            {isAdmin && (
              <button onClick={openEditStats} className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest hover:text-dutch-orange">
                <PencilSimple size={14} aria-hidden="true" /> Modifier les chiffres
              </button>
            )}
          </div>
          <div data-reveal className="mt-6 grid grid-cols-1 border-l border-t border-foreground sm:grid-cols-2 lg:grid-cols-4">
            {figures.map(({ count, label, to }) => (
              <Link key={to} to={to} className="group border-b border-r border-foreground p-6 transition-colors hover:bg-deep-black hover:text-off-white md:p-8">
                <p className="text-7xl font-black tracking-tighter md:text-8xl">{count}</p>
                <p className="mt-6 flex items-center justify-between font-mono text-xs uppercase tracking-widest">
                  {label} <ArrowUpRight size={14} aria-hidden="true" className="group-hover:text-dutch-orange" />
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Compétences */}
      {skillCategories.length > 0 && (
        <section className="px-4 pt-24 md:px-8 md:pt-32">
          <SectionHead index={next()} eyebrow={t.home.skillsEyebrow} title={t.home.skillsTitle} link={{ to: "/competences", label: t.home.seeAll }} />
          <div data-reveal className="mt-10">
            <SkillsExplorer categories={skillCategories} />
          </div>
        </section>
      )}

      {/* La collection */}
      {collection.length > 0 && (
        <section data-dark className="mt-24 bg-deep-black px-4 py-24 text-off-white md:mt-32 md:px-8 md:py-32">
          <SectionHead
            index={next()}
            eyebrow={t.home.collectionEyebrow}
            title={t.home.collectionTitle}
            link={{ to: "/projets", label: t.home.seeAllProjects(allProjects.length) }}
            dark
          />
          <ul className="mt-12 grid grid-cols-1 gap-px bg-off-white/20 sm:grid-cols-2 lg:grid-cols-3">
            {collection.map((project) => (
              <li key={project.id} data-reveal className="bg-deep-black">
                <Link to={`/projet/${project.slug}`} className="group relative block overflow-hidden">
                  <img src={project.image} alt="" loading="lazy" className="img-reveal aspect-[4/3] w-full object-cover" />
                  {/* Caption below the image on touch screens, revealed on hover with a mouse. */}
                  <div className="bg-dutch-orange p-5 text-deep-black transition-transform duration-500 ease-out md:absolute md:inset-x-0 md:bottom-0 md:translate-y-full md:group-hover:translate-y-0 md:group-focus-visible:translate-y-0">
                    <p className="font-mono text-[11px] uppercase tracking-widest">{categoryLabel(project.category)}</p>
                    <p className="mt-2 text-xl font-black uppercase leading-tight tracking-tighter">{project.title}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Blog */}
      {latestPosts.length > 0 && (
        <section className="px-4 pt-24 md:px-8 md:pt-32">
          <SectionHead index={next()} eyebrow={t.home.blogEyebrow} title={t.home.blogTitle} link={{ to: "/blog", label: t.home.allArticles }} />
          <ul>
            {latestPosts.map((post) => (
              <li key={post.id} data-reveal>
                <Link
                  to={`/blog/${post.slug}`}
                  className="group grid grid-cols-1 gap-x-8 gap-y-2 border-b border-foreground py-7 md:grid-cols-12 md:items-baseline"
                >
                  <time dateTime={post.date} className="font-mono text-xs uppercase tracking-widest text-muted-foreground md:col-span-2">
                    {new Date(post.date).toLocaleDateString(t.locale, { day: "2-digit", month: "short", year: "numeric" })}
                  </time>
                  <span className="text-2xl font-black uppercase leading-tight tracking-tighter transition-colors group-hover:text-dutch-orange md:col-span-7">
                    {post.title}
                  </span>
                  <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground md:col-span-3 md:text-right">
                    {t.blog.categoryNames[post.category] ?? post.category} · {post.readTime}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Me trouver */}
      <section className="mt-24 bg-dutch-orange px-4 py-20 text-deep-black md:mt-32 md:px-8 md:py-28">
        <p className="font-mono text-xs uppercase tracking-widest">({pad(next())}) {t.home.findEyebrow}</p>
        <h2 data-reveal className="mt-4 text-[13vw] font-black uppercase leading-[0.85] tracking-tighter md:text-[8vw]">
          {t.home.findTitle[0]}
          <br />
          {t.home.findTitle[1]}
        </h2>
        <dl data-reveal className="mt-14 grid grid-cols-1 gap-10 border-t border-deep-black pt-10 font-mono text-sm uppercase leading-relaxed md:grid-cols-3">
          <div>
            <dt className="text-xs tracking-widest opacity-70">{t.home.locationLabel}</dt>
            <dd className="mt-3">
              {t.home.locationLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </dd>
          </div>
          <div>
            <dt className="text-xs tracking-widest opacity-70">{t.home.availabilityLabel}</dt>
            <dd className="mt-3">
              {t.home.availabilityLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </dd>
          </div>
          <div>
            <dt className="text-xs tracking-widest opacity-70">{t.home.contactLabel}</dt>
            <dd className="mt-3 flex flex-col items-start gap-1 normal-case">
              <a href="mailto:fredbiam9@gmail.com" className="underline-offset-4 hover:underline">
                fredbiam9@gmail.com
              </a>
              <a href="https://github.com/mysteriodataweb" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 uppercase underline-offset-4 hover:underline">
                GitHub <ArrowUpRight size={12} aria-hidden="true" />
              </a>
              <a href="https://www.linkedin.com/in/alfredbiam" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 uppercase underline-offset-4 hover:underline">
                LinkedIn <ArrowUpRight size={12} aria-hidden="true" />
              </a>
            </dd>
          </div>
        </dl>
        <Link
          to="/contact"
          className="mt-14 inline-flex h-14 items-center gap-3 bg-deep-black px-8 font-mono text-xs font-bold uppercase tracking-widest text-off-white transition-colors hover:bg-off-white hover:text-deep-black"
        >
          {t.home.writeMessage} <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </section>

      {/* Stats Dialog */}
      <Dialog open={showStatsDialog} onOpenChange={setShowStatsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier les chiffres</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label htmlFor="stats-years" className="text-sm font-medium">
                Années d'expérience
              </label>
              <Input
                id="stats-years"
                type="number"
                value={statsForm.yearsExperience}
                onChange={(e) => setStatsForm({ ...statsForm, yearsExperience: Number(e.target.value) })}
              />
            </div>
            <div>
              <label htmlFor="stats-clients" className="text-sm font-medium">
                Clients accompagnés
              </label>
              <Input
                id="stats-clients"
                type="number"
                value={statsForm.clientsCount}
                onChange={(e) => setStatsForm({ ...statsForm, clientsCount: Number(e.target.value) })}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Les projets et les articles sont comptés automatiquement. Un chiffre à zéro n'est pas affiché.
            </p>
          </div>
          <DialogFooter>
            <button onClick={() => setShowStatsDialog(false)} className="btn-paper btn-sm">
              Annuler
            </button>
            <button onClick={saveStats} className="btn-ink btn-sm">
              Enregistrer
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Index;
