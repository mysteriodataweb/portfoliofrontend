import { useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, FolderGit2, Handshake, PenLine, Pencil } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import profilePhoto from "@/assets/profile-photo.jpg";
import SkillsExplorer from "@/components/SkillsExplorer";
import { useFeaturedProjects } from "@/hooks/use-projects";
import type { Project } from "@/hooks/use-projects";
import { useBlogPosts } from "@/hooks/use-blog";
import { useSkills } from "@/hooks/use-skills";
import { useTools } from "@/hooks/use-tools";
import { useStats } from "@/hooks/use-stats";
import { useAdmin } from "@/contexts/AdminContext";
import { categoryLabel } from "@/data/project-categories";
import { internship } from "@/data/availability";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { api } from "@/api/client";
import { toast } from "sonner";

const sectionTitle = "text-2xl font-normal text-foreground";

const formatMonth = (date: string) => {
  const parsed = new Date(`${date.slice(0, 7)}-01T00:00:00`);
  return Number.isNaN(parsed.getTime())
    ? date
    : parsed.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
};

const shortUrl = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

/** Featured projects, one per tab: a reading pane and the project's spec sheet as a terminal. */
const ProjectShowcase = ({ projects }: { projects: Project[] }) => {
  const [selected, setSelected] = useState(0);
  const project = projects[Math.min(selected, projects.length - 1)];

  const sheet: [string, React.ReactNode][] = [
    ["catégorie", categoryLabel(project.category)],
    ["date", formatMonth(project.date)],
    [
      "stack",
      <ul>
        {project.techStack.map((tech) => (
          <li key={tech}>{tech}</li>
        ))}
      </ul>,
    ],
  ];
  if (project.demoUrl) sheet.push(["démo", <ExternalLink href={project.demoUrl} />]);
  if (project.githubUrl) sheet.push(["code", <ExternalLink href={project.githubUrl} />]);

  return (
    <div className="border border-border bg-card">
      <div role="tablist" aria-label="Projets sélectionnés" className="no-scrollbar flex gap-1 overflow-x-auto p-3">
        {projects.map((p, i) => (
          <button
            key={p.id}
            role="tab"
            id={`project-tab-${p.id}`}
            aria-selected={i === selected}
            aria-controls="project-panel"
            onClick={() => setSelected(i)}
            className={`h-9 shrink-0 px-4 text-sm font-semibold transition-colors ${
              i === selected ? "bg-foreground text-background" : "text-foreground hover:bg-secondary"
            }`}
          >
            {p.title}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id="project-panel"
        aria-labelledby={`project-tab-${project.id}`}
        className="relative border-t border-border bg-secondary"
      >
        <img
          src={project.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover contrast-125 grayscale"
        />
        <div className="relative mx-auto grid max-w-[920px] grid-cols-1 px-4 py-10 md:grid-cols-[5fr_4fr] md:px-0 md:py-12">
          <div className="flex min-h-[26rem] flex-col bg-[#F7F7F7]">
            <p className="border-b border-border px-4 py-3 text-sm font-medium text-foreground">
              {categoryLabel(project.category)}
            </p>
            <div className="flex flex-1 flex-col justify-center px-6 py-8 md:px-10">
              <h3 className="text-2xl font-medium text-foreground">{project.title}</h3>
              <p className="mt-4 max-w-[46ch] leading-relaxed text-muted-foreground">{project.shortDescription}</p>
              <div className="mt-8">
                <Link to={`/projet/${project.slug}`} className="btn-ink btn-sm">
                  Voir le projet
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-[#1A1A1A] font-mono text-[13px] leading-6 text-white">
            <p className="flex justify-between gap-4 border-b border-white/10 px-4 py-3">
              <span>fiche</span>
              <span className="truncate text-white/60">{project.slug}</span>
            </p>
            <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 gap-y-3 px-4 py-5">
              {sheet.map(([label, value]) => (
                <div key={label} className="contents">
                  <dt className="text-white/50">{label}</dt>
                  <dd className="min-w-0 break-words">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

const ExternalLink = ({ href }: { href: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="underline decoration-white/40 decoration-dashed underline-offset-4 hover:decoration-white"
  >
    {shortUrl(href)}
  </a>
);

// Column count follows the number of figures shown, so no slot is left empty.
const figureColumns: Record<number, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

const Index = () => {
  const { data: featured = [] } = useFeaturedProjects();
  const { data: allPosts = [] } = useBlogPosts();
  const { data: tools = [] } = useTools();
  const { data: skillsData } = useSkills();
  const { data: stats, refetch: refetchStats } = useStats();
  const { isAdmin } = useAdmin();

  const projects = featured.slice(0, 4);
  const latestPosts = allPosts.slice(0, 3);
  const skillCategories = skillsData?.skillCategories ?? [];

  const [showStatsDialog, setShowStatsDialog] = useState(false);
  const [statsForm, setStatsForm] = useState({ yearsExperience: 0, clientsCount: 0 });

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

  const plural = (n: number, one: string, many: string) => `${n} ${n > 1 ? many : one}`;

  // A figure still at zero is left out rather than shown as "0".
  const figures: { icon: LucideIcon; title: string; text: string; to: string; count: number }[] = stats
    ? [
        {
          icon: FolderGit2,
          count: stats.projectsCount,
          title: plural(stats.projectsCount, "projet réalisé", "projets réalisés"),
          text: "Data science, IA et applications web.",
          to: "/projets",
        },
        {
          icon: PenLine,
          count: stats.articlesCount,
          title: plural(stats.articlesCount, "article publié", "articles publiés"),
          text: "Notes et tutoriels sur le blog.",
          to: "/blog",
        },
        {
          icon: Briefcase,
          count: stats.yearsExperience,
          title: plural(stats.yearsExperience, "an d'expérience", "ans d'expérience"),
          text: "Le parcours complet est dans le CV.",
          to: "/cv",
        },
        {
          icon: Handshake,
          count: stats.clientsCount,
          title: plural(stats.clientsCount, "client accompagné", "clients accompagnés"),
          text: "Parlons de votre projet.",
          to: "/contact",
        },
      ].filter((figure) => figure.count > 0)
    : [];

  return (
    <div className="container mx-auto px-6 pb-32">
      {/* Hero */}
      <section className="flex flex-col gap-10 pb-20 pt-14 md:pt-24 lg:flex-row lg:items-end lg:justify-between">
        <div className="order-2 lg:order-1">
          <h1 className="text-2xl font-normal text-foreground">Data &amp; AI Engineer</h1>
          <p className="mt-5 max-w-[46rem] text-base leading-relaxed text-foreground">
            Je suis Alfred, étudiant en dernière année. Je construis des pipelines de données et des applications d'IA
            qui sortent du notebook : de la donnée brute au modèle, puis à l'API et à l'interface qu'une personne utilise
            vraiment.
          </p>
          <p className="mt-4 max-w-[46rem] text-sm leading-relaxed text-muted-foreground">
            Je cherche un stage de fin d'études de {internship.duration} à partir de {internship.start}, avec une
            embauche possible ensuite. Ouvert aux missions freelance. {internship.location}.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/projets" className="btn-ink">
              Voir mes projets
            </Link>
            <Link to="/cv" className="btn-paper">
              Lire mon CV
            </Link>
          </div>
          <p className="mt-5 text-sm text-foreground">
            Ou{" "}
            <Link to="/contact" className="link-plain">
              écrivez-moi directement
            </Link>
            .
          </p>
        </div>
        <div className="panel order-1 w-40 shrink-0 p-1.5 lg:order-2 lg:w-60">
          <img src={profilePhoto} alt="Portrait d'Alfred BIAM" className="aspect-[4/5] w-full object-cover object-bottom" />
        </div>
      </section>

      {/* Outils */}
      {tools.length > 0 && (
        <section aria-label="Outils du quotidien">
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8">
            {tools.slice(0, 8).map((tool) => (
              <li
                key={tool.id}
                className="flex h-20 items-center justify-center gap-2.5 rounded-md bg-secondary px-3 text-sm font-semibold text-foreground"
              >
                <img src={tool.image} alt="" loading="lazy" className="h-5 w-5 shrink-0 brightness-0" />
                <span className="truncate">{tool.name}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Projets */}
      {projects.length > 0 && (
        <section className="mt-24">
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4">
            <h2 className={sectionTitle}>Projets sélectionnés</h2>
            <Link to="/projets" className="link-plain text-sm">
              Tous les projets
            </Link>
          </div>
          <ProjectShowcase projects={projects} />
        </section>
      )}

      {/* Chiffres */}
      {(figures.length > 0 || isAdmin) && (
        <section className="mt-20" aria-label="En chiffres">
          {isAdmin && (
            <div className="mb-4 flex justify-end">
              <button
                onClick={openEditStats}
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-sm font-medium hover:border-foreground"
              >
                <Pencil size={14} /> Modifier les chiffres
              </button>
            </div>
          )}
          <div className={`grid grid-cols-1 gap-5 ${figureColumns[figures.length] ?? ""}`}>
            {figures.map(({ icon: Icon, title, text, to }) => (
              <Link key={to} to={to} className="panel block p-5 transition-colors hover:border-foreground">
                <Icon size={40} strokeWidth={1.25} aria-hidden="true" />
                <p className="mt-6 text-sm font-semibold text-foreground">{title}</p>
                <p className="mt-4 text-sm text-foreground">{text}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Compétences */}
      {skillCategories.length > 0 && (
        <section className="mt-32">
          <h2 className={sectionTitle}>Compétences</h2>
          <div className="mt-6">
            <SkillsExplorer categories={skillCategories} moreLink="/competences" />
          </div>
        </section>
      )}

      {/* Blog */}
      {latestPosts.length > 0 && (
        <section className="mt-32">
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4">
            <h2 className={sectionTitle}>Derniers articles</h2>
            <Link to="/blog" className="link-plain text-sm">
              Tous les articles
            </Link>
          </div>
          <ul className="space-y-3">
            {latestPosts.map((post) => (
              <li key={post.id}>
                <Link
                  to={`/blog/${post.slug}`}
                  className="grid grid-cols-1 gap-x-8 gap-y-2 border border-border bg-card px-6 py-5 transition-colors hover:border-foreground md:grid-cols-[9rem_minmax(0,1fr)_auto] md:items-baseline"
                >
                  <time dateTime={post.date} className="font-mono text-[13px] text-muted-foreground">
                    {new Date(post.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                  </time>
                  <span>
                    <span className="block font-semibold text-foreground">{post.title}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">{post.excerpt}</span>
                  </span>
                  <span className="font-mono text-[13px] text-muted-foreground">
                    {post.category}, {post.readTime}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

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
    </div>
  );
};

export default Index;
