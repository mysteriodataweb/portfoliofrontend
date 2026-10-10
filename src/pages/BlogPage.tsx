import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Search, Plus, Pencil, Archive, ArchiveRestore } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import { useBlogPosts, useArchiveBlogPost, useUnarchiveBlogPost } from "@/hooks/use-blog";
import type { BlogPost } from "@/hooks/use-blog";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { api } from "@/api/client";
import { toast } from "sonner";

const categories = ["Tous", "IA/ML", "Fullstack", "Data Science", "Tutoriels"];

const emptyPost = {
  title: "", slug: "", excerpt: "", category: "Data Science", tags: "",
  image: "/placeholder.svg", date: new Date().toISOString().split("T")[0],
  readTime: "5 min", content: "",
};

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [search, setSearch] = useState("");
  const { data: filtered = [], isLoading } = useBlogPosts(activeCategory, search);
  const { isAdmin } = useAdmin();
  const [showDialog, setShowDialog] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [form, setForm] = useState<any>(emptyPost);
  const [saving, setSaving] = useState(false);
  const archivePost = useArchiveBlogPost();
  const unarchivePost = useUnarchiveBlogPost();

  const openAdd = () => {
    setEditingPost(null);
    setForm(emptyPost);
    setShowDialog(true);
  };

  const openEdit = (post: any) => {
    setEditingPost(post);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      category: post.category || "Data Science",
      tags: (post.tags || []).join(", "),
      image: post.image || "",
      date: post.date || "",
      readTime: post.readTime || "5 min",
      content: post.content || "",
    });
    setShowDialog(true);
  };

  const savePost = async () => {
    setSaving(true);
    try {
      const payload = { ...form, tags: form.tags.split(",").map((s: string) => s.trim()).filter(Boolean) };
      if (editingPost) {
        await api.put(`/admin/blog/${editingPost.id}`, payload);
        toast.success("Article mis à jour !");
      } else {
        await api.post("/admin/blog", payload);
        toast.success("Article créé !");
      }
      setShowDialog(false);
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message || "Erreur");
    } finally {
      setSaving(false);
    }
  };

  const handleArchive = async (post: any) => {
    if (!confirm(`Archiver "${post.title}" ? Il sera supprimé automatiquement dans 3 jours.`)) return;
    try {
      await archivePost.mutateAsync(post.id);
      toast.success("Article archivé. Suppression dans 3 jours.");
    } catch (err: any) {
      toast.error(err.message || "Erreur");
    }
  };

  const handleUnarchive = async (post: any) => {
    try {
      await unarchivePost.mutateAsync(post.id);
      toast.success("Article restauré !");
    } catch (err: any) {
      toast.error(err.message || "Erreur");
    }
  };

  const [featured, ...rest] = filtered;

  const postMeta = (post: BlogPost) => (
    <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
      <span className="font-medium text-foreground">{post.category}</span>
      <time dateTime={post.date}>
        {new Date(post.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
      </time>
      <span>{post.readTime} de lecture</span>
      {post.archived && (
        <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-foreground">Archivé</span>
      )}
    </p>
  );

  const adminActions = (post: BlogPost) =>
    isAdmin && (
      <div className="mt-4 flex gap-2">
        <Button size="sm" variant="outline" onClick={() => openEdit(post)}>
          <Pencil size={14} className="mr-1.5" /> Modifier
        </Button>
        {post.archived ? (
          <Button size="sm" variant="outline" onClick={() => handleUnarchive(post)}>
            <ArchiveRestore size={14} className="mr-1.5" /> Restaurer
          </Button>
        ) : (
          <Button size="sm" variant="outline" onClick={() => handleArchive(post)}>
            <Archive size={14} className="mr-1.5" /> Archiver
          </Button>
        )}
      </div>
    );

  return (
    <section className="pb-24">
      <div className="container mx-auto px-6">
        <header className="pt-12 md:pt-20">
          <div className="flex items-start justify-between gap-6">
            <h1 className="font-heading text-[clamp(3.5rem,13vw,11rem)] font-bold leading-[0.85] tracking-[-0.05em] text-foreground">
              Blog
            </h1>
            {isAdmin && (
              <button onClick={openAdd} className="pill-btn shrink-0 text-sm">
                <Plus className="h-4 w-4 mr-2" /> Nouvel article
              </button>
            )}
          </div>
          <p className="mt-8 max-w-[46ch] text-xl md:text-2xl leading-snug text-muted-foreground">
            J'écris pour vérifier que j'ai compris. Des notes sur les modèles, les données et le code
            qui les met en production.
          </p>
        </header>

        <div className="mt-14 flex flex-col gap-5 border-b border-foreground/15 pb-5 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-x-6 gap-y-2" role="group" aria-label="Filtrer par catégorie">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                aria-pressed={activeCategory === c}
                className={`text-base font-medium transition-colors ${
                  activeCategory === c
                    ? "text-foreground underline decoration-accent decoration-2 underline-offset-8"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <label className="relative block md:w-72">
            <span className="sr-only">Rechercher un article</span>
            <Search size={16} className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Rechercher"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border-b border-foreground/15 bg-transparent py-2 pl-7 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground"
            />
          </label>
        </div>

        {isLoading ? (
          <div className="py-10" aria-busy="true">
            <p className="sr-only">Chargement des articles</p>
            {[0, 1, 2].map((i) => (
              <div key={i} className="grid grid-cols-12 gap-8 border-t border-foreground/10 py-8 first:border-t-0">
                <div className="col-span-8 h-8 animate-pulse rounded bg-foreground/10" />
                <div className="col-span-4 h-8 animate-pulse rounded bg-foreground/5" />
              </div>
            ))}
          </div>
        ) : !featured ? (
          <div className="py-20">
            <p className="font-heading text-2xl font-semibold text-foreground">Aucun article ne correspond.</p>
            {(search || activeCategory !== "Tous") && (
              <button
                onClick={() => {
                  setSearch("");
                  setActiveCategory("Tous");
                }}
                className="link-arrow mt-4"
              >
                Afficher tous les articles
              </button>
            )}
          </div>
        ) : (
          <>
            <article
              className={`grid grid-cols-1 gap-8 py-10 md:grid-cols-12 md:gap-12 ${featured.archived ? "opacity-50" : ""}`}
            >
              <Link
                to={`/blog/${featured.slug}`}
                tabIndex={-1}
                aria-hidden="true"
                className="group block overflow-hidden rounded-[1.25rem] bg-secondary md:col-span-7"
              >
                <img
                  src={featured.image}
                  alt=""
                  className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </Link>
              <div className="flex flex-col justify-end md:col-span-5">
                {postMeta(featured)}
                <h2 className="mt-4 font-heading text-3xl md:text-5xl font-bold leading-[1.02] tracking-[-0.03em] text-foreground">
                  <Link to={`/blog/${featured.slug}`} className="transition-colors hover:text-accent">
                    {featured.title}
                  </Link>
                </h2>
                <p className="mt-4 max-w-[44ch] text-lg leading-relaxed text-muted-foreground">{featured.excerpt}</p>
                <Link to={`/blog/${featured.slug}`} className="link-arrow mt-6 w-fit">
                  Lire l'article <ArrowRight size={16} />
                </Link>
                {adminActions(featured)}
              </div>
            </article>

            <ul>
              {rest.map((post) => (
                <li key={post.id} className="border-t border-foreground/15">
                  <article
                    className={`grid grid-cols-1 gap-4 py-8 md:grid-cols-12 md:items-center md:gap-8 ${post.archived ? "opacity-50" : ""}`}
                  >
                    <div className="md:col-span-8">
                      {postMeta(post)}
                      <h2 className="mt-2 font-heading text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                        <Link to={`/blog/${post.slug}`} className="transition-colors hover:text-accent">
                          {post.title}
                        </Link>
                      </h2>
                      <p className="mt-2 max-w-[60ch] leading-relaxed text-muted-foreground">{post.excerpt}</p>
                      {adminActions(post)}
                    </div>
                    <Link
                      to={`/blog/${post.slug}`}
                      tabIndex={-1}
                      aria-hidden="true"
                      className="group block overflow-hidden rounded-xl bg-secondary md:col-span-4"
                    >
                      <img
                        src={post.image}
                        alt=""
                        loading="lazy"
                        className="aspect-[16/9] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    </Link>
                  </article>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPost ? "Modifier l'article" : "Nouvel article"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium">Titre *</label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div><label className="text-sm font-medium">Slug *</label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></div>
            </div>
            <div><label className="text-sm font-medium">Extrait</label><textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="w-full h-20 px-3 py-2 rounded-md border border-border bg-background text-foreground" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium">Catégorie</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full h-10 px-3 rounded-md border border-border bg-background text-foreground">
                  {categories.filter(c => c !== "Tous").map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div><label className="text-sm font-medium">Date</label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium">Temps de lecture</label><Input value={form.readTime} onChange={(e) => setForm({ ...form, readTime: e.target.value })} placeholder="5 min" /></div>
              <div><label className="text-sm font-medium">Tags (séparés par virgules)</label><Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="React, TypeScript, IA" /></div>
            </div>
            <div><label className="text-sm font-medium">Image</label><ImageUpload value={form.image} onChange={(url) => setForm({ ...form, image: url })} /></div>
            <div><label className="text-sm font-medium">Contenu (Markdown supporté)</label><textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full h-[300px] px-3 py-2 rounded-md border border-border bg-background text-foreground font-mono text-sm" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Annuler</Button>
            <Button onClick={savePost} disabled={saving || !form.title || !form.slug}>{saving ? "Enregistrement..." : "Enregistrer"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default BlogPage;
