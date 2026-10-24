import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Github, ExternalLink, Pencil, Save, X } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { useProject, useAllProjects } from "@/hooks/use-projects";
import { track } from "@/lib/analytics";
import { useAdmin } from "@/contexts/AdminContext";
import { categoryLabel } from "@/data/project-categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/api/client";
import { toast } from "sonner";

const ProjectDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, isLoading } = useProject(slug || "");
  const { data: projects = [] } = useAllProjects();
  const { isAdmin } = useAdmin();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<any>(null);

  if (isLoading) {
    return <div className="py-32 text-center"><p className="text-muted-foreground">Chargement...</p></div>;
  }

  if (!project) {
    return (
      <div className="py-32 text-center">
        <h1 className="display-title text-foreground">Projet non trouvé</h1>
        <Link to="/projets" className="text-primary mt-4 inline-block">← Retour aux projets</Link>
      </div>
    );
  }

  const startEdit = () => {
    setForm({
      title: project.title,
      slug: project.slug,
      category: project.category,
      shortDescription: project.shortDescription,
      fullDescription: project.fullDescription,
      image: project.image,
      techStack: (project.techStack || []).join(", "),
      demoUrl: project.demoUrl || "",
      githubUrl: project.githubUrl || "",
      date: project.date || "",
      featured: project.featured || false,
      published: project.published !== false,
      context: project.context || "",
      approach: project.approach || "",
      results: project.results || "",
      challenges: project.challenges || "",
    });
    setEditing(true);
  };

  const saveEdit = async () => {
    try {
      const payload = {
        ...form,
        techStack: typeof form.techStack === "string"
          ? form.techStack.split(",").map((s: string) => s.trim()).filter(Boolean)
          : form.techStack,
      };
      await api.put(`/admin/projects/${project.id}`, payload);
      toast.success("Projet mis à jour !");
      setEditing(false);
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message || "Erreur");
    }
  };

  const currentIdx = projects.findIndex((p) => p.slug === slug);
  const prev = currentIdx > 0 ? projects[currentIdx - 1] : null;
  const next = currentIdx < projects.length - 1 ? projects[currentIdx + 1] : null;

  return (
    <>
      {/* Hero */}
      <div className="relative h-[440px] overflow-hidden border-b border-foreground">
        <img src={project.image} alt={project.title} className="h-full w-full object-cover grayscale" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-6 pb-8">
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            <Link to="/" className="transition-colors hover:text-dutch-orange">Accueil</Link>
            {" / "}
            <Link to="/projets" className="transition-colors hover:text-dutch-orange">Projets</Link>
            {" / "}
            <span className="text-foreground">{categoryLabel(project.category)}</span>
          </p>

          {editing ? (
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="text-3xl md:text-5xl font-heading font-bold bg-background/50 border-primary/50" />
          ) : (
            <h1 className="display-title text-foreground">{project.title}</h1>
          )}

          {isAdmin && !editing && (
            <button className="pill-btn-outline text-sm mt-3" onClick={startEdit}>
              <Pencil className="h-4 w-4 mr-2" /> Modifier
            </button>
          )}
          {editing && (
            <div className="flex gap-2 mt-3">
              <button onClick={saveEdit} className="pill-btn text-sm">
                <Save className="h-4 w-4 mr-2" /> Enregistrer
              </button>
              <button onClick={() => setEditing(false)} className="pill-btn-outline text-sm">
                <X className="h-4 w-4 mr-2" /> Annuler
              </button>
            </div>
          )}
        </div>
      </div>

      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main */}
            <div className="lg:col-span-2 space-y-12">
              <AnimatedSection>
                <h2 className="section-title text-foreground mb-4">Contexte</h2>
                {editing ? (
                  <textarea value={form.context} onChange={(e) => setForm({ ...form, context: e.target.value })} className="w-full h-32 px-4 py-3 rounded-none border border-border bg-white text-foreground" />
                ) : (
                  <p className="text-muted-foreground leading-relaxed">{project.context}</p>
                )}
              </AnimatedSection>
              <AnimatedSection>
                <h2 className="section-title text-foreground mb-4">Approche et méthode</h2>
                {editing ? (
                  <textarea value={form.approach} onChange={(e) => setForm({ ...form, approach: e.target.value })} className="w-full h-32 px-4 py-3 rounded-none border border-border bg-white text-foreground" />
                ) : (
                  <p className="text-muted-foreground leading-relaxed">{project.approach}</p>
                )}
              </AnimatedSection>
              <AnimatedSection>
                <h2 className="section-title text-foreground mb-4">Résultats</h2>
                {editing ? (
                  <textarea value={form.results} onChange={(e) => setForm({ ...form, results: e.target.value })} className="w-full h-32 px-4 py-3 rounded-none border border-border bg-white text-foreground" />
                ) : (
                  <p className="text-muted-foreground leading-relaxed">{project.results}</p>
                )}
              </AnimatedSection>
              <AnimatedSection>
                <h2 className="section-title text-foreground mb-4">Défis et apprentissages</h2>
                {editing ? (
                  <textarea value={form.challenges} onChange={(e) => setForm({ ...form, challenges: e.target.value })} className="w-full h-32 px-4 py-3 rounded-none border border-border bg-white text-foreground" />
                ) : (
                  <p className="text-muted-foreground leading-relaxed">{project.challenges}</p>
                )}
              </AnimatedSection>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="panel sticky top-28 space-y-6 p-6">
                <div>
                  <span className="eyebrow">Catégorie</span>
                  <p className="mt-1 font-semibold text-foreground">{categoryLabel(project.category)}</p>
                </div>
                <div>
                  <span className="eyebrow">Date</span>
                  <p className="mt-1 font-semibold text-foreground">{project.date}</p>
                </div>
                <div>
                  <span className="eyebrow">Technologies</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {project.techStack.map((t) => (
                      <span key={t} className="border border-foreground/30 px-2 py-1 font-mono text-[11px] uppercase tracking-wider text-foreground">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-3 pt-2">
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" onClick={() => track("projet-code", { projet: project.slug })} className="btn-paper w-full">
                      <Github size={16} /> Voir le code
                    </a>
                  )}
                  {project.demoUrl && (
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" onClick={() => track("projet-demo", { projet: project.slug })} className="btn-ink w-full">
                      <ExternalLink size={16} /> Demo live
                    </a>
                  )}
                </div>
              </div>
            </aside>
          </div>

          {/* Nav */}
          <div className="mt-20 flex justify-between gap-6 border-t border-foreground pt-10">
            {prev ? (
              <Link to={`/projet/${prev.slug}`} className="group flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                <div><p className="eyebrow">Précédent</p><p className="mt-1 font-bold uppercase tracking-tight">{prev.title}</p></div>
              </Link>
            ) : <div />}
            {next ? (
              <Link to={`/projet/${next.slug}`} className="group flex items-center gap-3 text-right text-muted-foreground hover:text-foreground transition-colors">
                <div><p className="eyebrow">Suivant</p><p className="mt-1 font-bold uppercase tracking-tight">{next.title}</p></div>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : <div />}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-dutch-orange px-4 py-20 text-deep-black md:px-8 md:py-28">
        <p className="font-mono text-xs uppercase tracking-widest">(Contact)</p>
        <h2 data-reveal className="mt-4 text-5xl font-black uppercase leading-[0.9] tracking-tighter md:text-7xl">
          Un projet similaire ?
        </h2>
        <Link
          to="/contact"
          className="mt-10 inline-flex h-14 items-center gap-3 bg-deep-black px-8 font-mono text-xs font-bold uppercase tracking-widest text-off-white transition-colors hover:bg-off-white hover:text-deep-black"
        >
          Discutons-en <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </section>
    </>
  );
};

export default ProjectDetailPage;
