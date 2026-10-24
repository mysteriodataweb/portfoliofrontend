import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Plus, PencilSimple, Archive } from "@phosphor-icons/react";
import { useProjects, useArchiveProject } from "@/hooks/use-projects";
import { useAdmin } from "@/contexts/AdminContext";
import ImageUpload from "@/components/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { api } from "@/api/client";
import { toast } from "sonner";
import { PROJECT_CATEGORIES } from "@/data/project-categories";
import { useLanguage } from "@/i18n";
import { localizeProject } from "@/i18n/content";

const emptyProject = {
  title: "", slug: "", category: "web-app", shortDescription: "", fullDescription: "",
  image: "/placeholder.svg", techStack: "", demoUrl: "", githubUrl: "", date: new Date().toISOString().split("T")[0],
  featured: false, published: true, context: "", approach: "", results: "", challenges: "",
  titleEn: "", shortDescriptionEn: "", contextEn: "", approachEn: "", resultsEn: "", challengesEn: "",
};

// English version of the texts, shown to visitors who read the site in English (French when left empty).
const englishFields = [
  { key: "titleEn", label: "Titre", multiline: false },
  { key: "shortDescriptionEn", label: "Description courte", multiline: false },
  { key: "contextEn", label: "Contexte", multiline: true },
  { key: "approachEn", label: "Approche", multiline: true },
  { key: "resultsEn", label: "Résultats", multiline: true },
  { key: "challengesEn", label: "Défis", multiline: true },
] as const;

const chipBase = "border px-4 py-2 font-mono text-xs font-bold uppercase tracking-widest transition-colors";
const chipActive = "border-dutch-orange bg-dutch-orange text-deep-black";
const chipIdle = "border-off-white/30 text-off-white hover:border-off-white";

const pad = (n: number) => String(n).padStart(2, "0");

const ProjectsPage = () => {
  const { data: projects = [], isLoading } = useProjects();
  const { isAdmin } = useAdmin();
  const [showDialog, setShowDialog] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [form, setForm] = useState<any>(emptyProject);
  const [saving, setSaving] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const archiveProject = useArchiveProject();
  const { lang, t } = useLanguage();
  const categoryLabel = (value: string) => t.categories[value] ?? value;

  const filtered =
    activeCategory === "all" ? projects : projects.filter((p) => p.category === activeCategory);

  const countOf = (category: string) => projects.filter((p) => p.category === category).length;

  const openAdd = () => {
    setEditingProject(null);
    setForm(emptyProject);
    setShowDialog(true);
  };

  const openEdit = (project: any) => {
    setEditingProject(project);
    setForm({
      title: project.title,
      slug: project.slug,
      category: project.category,
      shortDescription: project.shortDescription || "",
      fullDescription: project.fullDescription || "",
      image: project.image || "",
      techStack: (project.techStack || []).join(", "),
      demoUrl: project.demoUrl || "",
      githubUrl: project.githubUrl || "",
      date: project.date || "",
      featured: project.featured || false,
      context: project.context || "",
      approach: project.approach || "",
      results: project.results || "",
      challenges: project.challenges || "",
      ...Object.fromEntries(englishFields.map(({ key }) => [key, project[key] || ""])),
    });
    setShowDialog(true);
  };

  const saveProject = async () => {
    setSaving(true);
    try {
      const payload = { ...form, techStack: form.techStack.split(",").map((s: string) => s.trim()).filter(Boolean) };
      if (editingProject) {
        await api.put(`/admin/projects/${editingProject.id}`, payload);
        toast.success("Projet mis à jour !");
      } else {
        await api.post("/admin/projects", payload);
        toast.success("Projet créé !");
      }
      setShowDialog(false);
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message || "Erreur");
    } finally {
      setSaving(false);
    }
  };

  const handleArchive = async (project: any) => {
    if (!confirm(`Archiver "${project.title}" ? Il sera supprimé automatiquement dans 3 jours.`)) return;
    try {
      await archiveProject.mutateAsync(project.id);
      toast.success("Projet archivé. Suppression dans 3 jours.");
    } catch (err: any) {
      toast.error(err.message || "Erreur");
    }
  };

  return (
    <section data-dark className="min-h-screen bg-deep-black px-4 pb-24 pt-28 text-off-white md:px-8 md:pb-32 md:pt-36">
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-off-white/30 pb-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-off-white/50">
            {t.projects.eyebrow(projects.length)}
          </p>
          <h1 data-reveal className="mt-4 text-5xl font-black uppercase leading-[0.9] tracking-tighter md:text-8xl">
            {t.projects.titleStart} <span className="text-dutch-orange">{t.projects.titleAccent}</span>
          </h1>
        </div>
        {isAdmin && (
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 border border-off-white px-5 py-3 font-mono text-xs font-bold uppercase tracking-widest transition-colors hover:bg-off-white hover:text-deep-black"
          >
            <Plus size={14} aria-hidden="true" /> Nouveau projet
          </button>
        )}
      </div>

      {/* Category filter bar */}
      <div role="group" aria-label={t.projects.filterLabel} className="mt-8 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory("all")}
          aria-pressed={activeCategory === "all"}
          className={`${chipBase} ${activeCategory === "all" ? chipActive : chipIdle}`}
        >
          {t.projects.all} ({projects.length})
        </button>
        {PROJECT_CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => setActiveCategory(c.value)}
            aria-pressed={activeCategory === c.value}
            className={`${chipBase} ${activeCategory === c.value ? chipActive : chipIdle}`}
          >
            {categoryLabel(c.value)} ({countOf(c.value)})
          </button>
        ))}
      </div>

      {isLoading && filtered.length === 0 ? (
        <p className="mt-16 font-mono text-xs uppercase tracking-widest text-off-white/50">{t.common.loading}</p>
      ) : filtered.length === 0 ? (
        <p className="mt-16 font-mono text-xs uppercase tracking-widest text-off-white/50">
          {activeCategory === "all" ? t.projects.empty : t.projects.emptyCategory}
        </p>
      ) : (
        <ul className="mt-10 grid grid-cols-1 gap-px border border-off-white/20 bg-off-white/20 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((original, i) => {
            const project = localizeProject(original, lang);
            return (
            <li key={project.id} className="relative bg-deep-black">
              <Link to={`/projet/${project.slug}`} className="group block">
                <div className="relative overflow-hidden">
                  <img src={project.image || "/placeholder.svg"} alt="" loading="lazy" className="img-reveal aspect-[4/3] w-full object-cover" />
                  {/* Revealed on hover with a mouse; on touch screens the title below is enough. */}
                  <div className="absolute inset-x-0 bottom-0 hidden translate-y-full bg-dutch-orange p-5 text-deep-black transition-transform duration-500 ease-out group-hover:translate-y-0 group-focus-visible:translate-y-0 md:block">
                    <p className="line-clamp-3 text-sm leading-relaxed">{project.shortDescription}</p>
                    <p className="mt-3 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest">
                      {t.common.viewProject} <ArrowRight size={14} aria-hidden="true" />
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-5">
                  <span className="font-mono text-xs text-off-white/50">{pad(i + 1)}</span>
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-widest text-off-white/50">{categoryLabel(project.category)}</p>
                    <h2 className="mt-2 text-xl font-black uppercase leading-tight tracking-tighter transition-colors group-hover:text-dutch-orange">
                      {project.title}
                    </h2>
                  </div>
                </div>
              </Link>
              {isAdmin && (
                <div className="absolute right-3 top-3 z-10 flex gap-1">
                  <button
                    onClick={() => openEdit(original)}
                    aria-label={`Modifier ${project.title}`}
                    className="flex h-9 w-9 items-center justify-center bg-off-white text-deep-black hover:bg-dutch-orange"
                  >
                    <PencilSimple size={14} aria-hidden="true" />
                  </button>
                  <button
                    onClick={() => handleArchive(project)}
                    aria-label={`Archiver ${project.title}`}
                    className="flex h-9 w-9 items-center justify-center bg-off-white text-deep-black hover:bg-dutch-orange"
                  >
                    <Archive size={14} aria-hidden="true" />
                  </button>
                </div>
              )}
            </li>
            );
          })}
        </ul>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProject ? "Modifier le projet" : "Nouveau projet"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium">Titre *</label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div><label className="text-sm font-medium">Slug *</label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium">Catégorie</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full h-10 px-3 rounded-md border border-border bg-background text-foreground">
                  {PROJECT_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div><label className="text-sm font-medium">Date</label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
            </div>
            <div><label className="text-sm font-medium">Description courte</label><Input value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} /></div>
            <div><label className="text-sm font-medium">Image</label><ImageUpload value={form.image} onChange={(url) => setForm({ ...form, image: url })} /></div>
            <div><label className="text-sm font-medium">Technologies (séparées par virgules)</label><Input value={form.techStack} onChange={(e) => setForm({ ...form, techStack: e.target.value })} placeholder="React, TypeScript, PostgreSQL" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium">Demo URL</label><Input value={form.demoUrl} onChange={(e) => setForm({ ...form, demoUrl: e.target.value })} /></div>
              <div><label className="text-sm font-medium">GitHub URL</label><Input value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} /></div>
            </div>
            <div><label className="text-sm font-medium">Contexte</label><textarea value={form.context} onChange={(e) => setForm({ ...form, context: e.target.value })} className="w-full h-24 px-3 py-2 rounded-md border border-border bg-background text-foreground" /></div>
            <div><label className="text-sm font-medium">Approche</label><textarea value={form.approach} onChange={(e) => setForm({ ...form, approach: e.target.value })} className="w-full h-24 px-3 py-2 rounded-md border border-border bg-background text-foreground" /></div>
            <div><label className="text-sm font-medium">Résultats</label><textarea value={form.results} onChange={(e) => setForm({ ...form, results: e.target.value })} className="w-full h-24 px-3 py-2 rounded-md border border-border bg-background text-foreground" /></div>
            <div><label className="text-sm font-medium">Défis</label><textarea value={form.challenges} onChange={(e) => setForm({ ...form, challenges: e.target.value })} className="w-full h-24 px-3 py-2 rounded-md border border-border bg-background text-foreground" /></div>

            <fieldset className="space-y-4 border-t border-border pt-4">
              <legend className="text-sm font-semibold">Version anglaise</legend>
              <p className="text-xs text-muted-foreground">Affichée sur la version anglaise du site. Un champ vide affiche le texte français.</p>
              {englishFields.map(({ key, label, multiline }) => (
                <div key={key}>
                  <label htmlFor={`project-${key}`} className="text-sm font-medium">{label} (EN)</label>
                  {multiline ? (
                    <textarea id={`project-${key}`} lang="en" value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="w-full h-24 px-3 py-2 rounded-md border border-border bg-background text-foreground" />
                  ) : (
                    <Input id={`project-${key}`} lang="en" value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
                  )}
                </div>
              ))}
            </fieldset>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Annuler</Button>
            <Button onClick={saveProject} disabled={saving || !form.title || !form.slug}>{saving ? "Enregistrement..." : "Enregistrer"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ProjectsPage;
