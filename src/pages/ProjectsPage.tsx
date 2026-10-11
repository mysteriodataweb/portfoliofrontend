import { useState } from "react";
import { Plus, Pencil, Archive } from "lucide-react";
import { useProjects, useArchiveProject } from "@/hooks/use-projects";
import { useAdmin } from "@/contexts/AdminContext";
import ImageUpload from "@/components/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { api } from "@/api/client";
import { toast } from "sonner";
import { InteractiveScrollingStory, StorySlide } from "@/components/ui/interactive-scrolling-story";
import { PROJECT_CATEGORIES, categoryLabel } from "@/data/project-categories";

const emptyProject = {
  title: "", slug: "", category: "web-app", shortDescription: "", fullDescription: "",
  image: "/placeholder.svg", techStack: "", demoUrl: "", githubUrl: "", date: new Date().toISOString().split("T")[0],
  featured: false, published: true, context: "", approach: "", results: "", challenges: "",
};

const chipBase = "px-4 py-1.5 rounded-md text-sm font-medium border transition-colors";

const ProjectsPage = () => {
  const { data: projects = [], isLoading } = useProjects();
  const { isAdmin } = useAdmin();
  const [showDialog, setShowDialog] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [form, setForm] = useState<any>(emptyProject);
  const [saving, setSaving] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const archiveProject = useArchiveProject();

  const filtered =
    activeCategory === "all" ? projects : projects.filter((p) => p.category === activeCategory);

  const slides: StorySlide[] = filtered.map((project) => ({
    title: project.title,
    description: project.fullDescription || project.shortDescription,
    image: project.image || "/placeholder.svg",
    bgColor: "#FAFAF9",
    textColor: "#000000",
    badge: categoryLabel(project.category),
    ctaHref: `/projet/${project.slug}`,
  }));

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

  const renderActions = (activeIndex: number) => {
    const project = filtered[activeIndex];
    if (!project) return null;
    return (
      <>
        <Button size="sm" variant="secondary" className="h-9 w-9 p-0 rounded-md bg-white/90 hover:bg-white" onClick={() => openEdit(project)}>
          <Pencil size={14} />
        </Button>
        <Button size="sm" variant="secondary" className="h-9 w-9 p-0 rounded-md bg-white/90 hover:bg-white" onClick={() => handleArchive(project)}>
          <Archive size={14} />
        </Button>
      </>
    );
  };

  return (
    <section className="h-[calc(100vh-80px)] relative flex flex-col">
      {/* Category filter bar */}
      <div className="shrink-0 bg-background border-b border-black/5 px-4 py-3 flex flex-wrap items-center justify-center gap-2 z-10">
        <button
          onClick={() => setActiveCategory("all")}
          className={`${chipBase} ${
            activeCategory === "all"
              ? "bg-black text-white border-black"
              : "bg-white/70 text-black border-black/10 hover:border-black/40"
          }`}
        >
          Tout
        </button>
        {PROJECT_CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => setActiveCategory(c.value)}
            className={`${chipBase} ${
              activeCategory === c.value
                ? "bg-black text-white border-black"
                : "bg-white/70 text-black border-black/10 hover:border-black/40"
            }`}
          >
            {c.label}
          </button>
        ))}
        {isAdmin && (
          <button onClick={openAdd} className={`${chipBase} border-border text-foreground hover:border-foreground`}>
            <Plus className="h-4 w-4 mr-1 inline" /> Nouveau projet
          </button>
        )}
      </div>

      <div className="flex-1 relative min-h-0">
        {isLoading && slides.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">Chargement...</div>
        ) : slides.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-4 text-muted-foreground">
            <p>{activeCategory === "all" ? "Aucun projet publié pour le moment." : "Aucun projet dans cette catégorie."}</p>
            {isAdmin && (
              <button onClick={openAdd} className="pill-btn text-sm">
                <Plus className="h-4 w-4 mr-2" /> Nouveau projet
              </button>
            )}
          </div>
        ) : (
          <InteractiveScrollingStory
            key={activeCategory}
            slides={slides}
            ctaLabel="Voir le projet"
            renderActions={isAdmin ? renderActions : undefined}
          />
        )}
      </div>

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
