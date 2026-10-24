import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Link2, Linkedin, Twitter, Pencil, Save, X } from "lucide-react";
import { motion, useScroll } from "framer-motion";
import { useBlogPost, useBlogPosts } from "@/hooks/use-blog";
import type { BlogPost } from "@/hooks/use-blog";
import { useAdmin } from "@/contexts/AdminContext";
import { api } from "@/api/client";
import { toast } from "sonner";
import profilePhoto from "@/assets/profile-photo.jpg";

const escapeHtml = (text: string) =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// The text is escaped first, so only the bold and code markup below can produce HTML.
const inline = (text: string) =>
  escapeHtml(text)
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
    .replace(/`(.*?)`/g, "<code>$1</code>");

const headingId = (index: number) => `section-${index}`;

const renderContent = (content: string) =>
  content.split("\n\n").map((block, i) => {
    if (block.startsWith("## ")) {
      return (
        <h2
          key={i}
          id={headingId(i)}
          className="mt-14 mb-5 scroll-mt-28 text-2xl font-medium tracking-tight text-foreground"
        >
          {block.replace("## ", "")}
        </h2>
      );
    }
    if (block.startsWith("### ")) {
      return (
        <h3 key={i} className="mt-10 mb-3 font-heading text-xl font-semibold text-foreground">
          {block.replace("### ", "")}
        </h3>
      );
    }
    if (block.startsWith("- ")) {
      return (
        <ul key={i} className="mb-6 list-disc space-y-2 pl-6 text-lg leading-[1.7] text-foreground/80 marker:text-foreground">
          {block.split("\n").filter(Boolean).map((item, j) => (
            <li key={j} dangerouslySetInnerHTML={{ __html: inline(item.replace(/^- /, "")) }} />
          ))}
        </ul>
      );
    }
    if (block.startsWith("1. ")) {
      return (
        <ol key={i} className="mb-6 list-decimal space-y-2 pl-6 text-lg leading-[1.7] text-foreground/80 marker:font-semibold marker:text-foreground">
          {block.split("\n").filter(Boolean).map((item, j) => (
            <li key={j} dangerouslySetInnerHTML={{ __html: inline(item.replace(/^\d+\. /, "")) }} />
          ))}
        </ol>
      );
    }
    return (
      <p key={i} className="mb-6 text-lg leading-[1.8] text-foreground/80" dangerouslySetInnerHTML={{ __html: inline(block) }} />
    );
  });

const Article = ({ post, posts }: { post: BlogPost; posts: BlogPost[] }) => {
  const { isAdmin } = useAdmin();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ title: "", excerpt: "", content: "" });
  const [activeId, setActiveId] = useState<string | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  const headings = useMemo(
    () =>
      post.content
        .split("\n\n")
        .map((block, i) => ({ id: headingId(i), text: block.replace("## ", ""), isHeading: block.startsWith("## ") }))
        .filter((h) => h.isHeading),
    [post.content],
  );
  const hasSummary = headings.length > 1 && !editing;

  // Highlight in the summary the section currently being read.
  useEffect(() => {
    if (!hasSummary || !bodyRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-100px 0px -65% 0px" },
    );
    bodyRef.current.querySelectorAll("h2[id]").forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [hasSummary, post.content]);

  const startEdit = () => {
    setForm({ title: post.title, excerpt: post.excerpt || "", content: post.content });
    setEditing(true);
  };

  const saveEdit = async () => {
    try {
      await api.put(`/admin/blog/${post.id}`, form);
      toast.success("Article mis à jour !");
      setEditing(false);
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message || "Erreur");
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Lien copié");
    } catch {
      toast.error("Impossible de copier le lien");
    }
  };

  const currentIdx = posts.findIndex((p) => p.slug === post.slug);
  const prev = currentIdx > 0 ? posts[currentIdx - 1] : null;
  const next = currentIdx >= 0 && currentIdx < posts.length - 1 ? posts[currentIdx + 1] : null;

  const shareUrl = encodeURIComponent(window.location.href);
  const shareClass =
    "inline-flex items-center gap-2 rounded-md bg-foreground/5 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-foreground hover:text-background";

  return (
    <article className="pb-24">
      <motion.div
        aria-hidden="true"
        className="fixed left-0 right-0 top-0 z-[60] h-1 origin-left bg-foreground"
        style={{ scaleX: scrollYProgress }}
      />

      <header className="container mx-auto px-6 pt-12 md:pt-16">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={16} /> Tous les articles
        </Link>
        <p className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{post.category}</span>
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
          </time>
          <span>{post.readTime} de lecture</span>
        </p>
        {editing ? (
          <input
            aria-label="Titre"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="mt-4 w-full rounded-none border border-border bg-white px-4 py-3 font-heading text-3xl md:text-4xl font-bold text-foreground"
          />
        ) : (
          <h1 className="display-title mt-4 text-foreground">
            {post.title}
          </h1>
        )}
        {!editing && post.excerpt && (
          <p className="mt-6 max-w-[52ch] text-xl md:text-2xl leading-snug text-muted-foreground">{post.excerpt}</p>
        )}
        {isAdmin && (
          <div className="mt-6 flex gap-2">
            {editing ? (
              <>
                <button onClick={saveEdit} className="pill-btn text-sm">
                  <Save className="h-4 w-4 mr-2" /> Enregistrer
                </button>
                <button onClick={() => setEditing(false)} className="pill-btn-outline text-sm">
                  <X className="h-4 w-4 mr-2" /> Annuler
                </button>
              </>
            ) : (
              <button onClick={startEdit} className="pill-btn-outline text-sm">
                <Pencil className="h-4 w-4 mr-2" /> Modifier
              </button>
            )}
          </div>
        )}
      </header>

      {post.image && (
        <div className="container mx-auto mt-12 px-6">
          <img src={post.image} alt="" className="aspect-[16/9] w-full border border-foreground bg-secondary object-cover grayscale md:aspect-[21/9]" />
        </div>
      )}

      <div className="container mx-auto mt-16 grid grid-cols-1 gap-12 px-6 lg:grid-cols-12">
        {hasSummary && (
          <aside className="hidden lg:col-span-3 lg:block">
            <nav aria-label="Dans cet article" className="sticky top-28">
              <p className="font-heading font-semibold text-foreground">Dans cet article</p>
              <ul className="mt-4 space-y-1 border-l border-foreground/15">
                {headings.map((h) => (
                  <li key={h.id}>
                    <a
                      href={`#${h.id}`}
                      aria-current={activeId === h.id ? "location" : undefined}
                      className={`-ml-px block border-l py-1.5 pl-4 text-sm leading-snug transition-colors ${
                        activeId === h.id
                          ? "border-border font-medium text-foreground"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        )}

        <div className={hasSummary ? "lg:col-span-8" : "lg:col-span-8 lg:col-start-3"}>
          <div ref={bodyRef} className="relative max-w-[68ch]">
            {editing ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor="excerpt" className="mb-1 block text-sm font-medium text-foreground">Extrait</label>
                  <textarea id="excerpt" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="h-20 w-full rounded-none border border-border bg-white px-4 py-3 text-foreground" />
                </div>
                <div>
                  <label htmlFor="content" className="mb-1 block text-sm font-medium text-foreground">Contenu (Markdown supporté)</label>
                  <textarea id="content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="h-[400px] w-full rounded-none border border-border bg-white px-4 py-3 font-mono text-sm text-foreground" />
                </div>
              </div>
            ) : (
              <div className="[&>*:first-child]:mt-0">{renderContent(post.content)}</div>
            )}
          </div>

          <div className="mt-16 max-w-[68ch] border-t border-foreground/15 pt-8">
            <p className="font-heading font-semibold text-foreground">Partager cet article</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button onClick={copyLink} className={shareClass}>
                <Link2 size={16} /> Copier le lien
              </button>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className={shareClass}
              >
                <Linkedin size={16} /> LinkedIn
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className={shareClass}
              >
                <Twitter size={16} /> X
              </a>
            </div>
          </div>

          <div className="mt-10 flex max-w-[68ch] items-center gap-5">
            <img src={profilePhoto} alt="" className="h-16 w-16 rounded-md object-cover" />
            <div>
              <p className="font-heading font-semibold text-foreground">Alfred BIAM</p>
              <p className="text-sm text-muted-foreground">
                Data &amp; AI Engineer.{" "}
                <Link to="/about" className="text-foreground underline decoration-foreground underline-offset-4 hover:text-foreground">
                  En savoir plus
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {(prev || next) && (
        <nav aria-label="Autres articles" className="container mx-auto mt-20 grid grid-cols-1 gap-8 px-6 md:grid-cols-2">
          {prev ? (
            <Link to={`/blog/${prev.slug}`} className="group border-t border-foreground/15 pt-6">
              <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> Article précédent
              </span>
              <span className="mt-2 block text-xl font-semibold text-foreground transition-colors group-hover:underline">
                {prev.title}
              </span>
            </Link>
          ) : (
            <div className="hidden md:block" />
          )}
          {next && (
            <Link to={`/blog/${next.slug}`} className="group border-t border-foreground/15 pt-6 md:text-right">
              <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                Article suivant <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </span>
              <span className="mt-2 block text-xl font-semibold text-foreground transition-colors group-hover:underline">
                {next.title}
              </span>
            </Link>
          )}
        </nav>
      )}
    </article>
  );
};

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = useBlogPost(slug || "");
  const { data: blogPosts = [] } = useBlogPosts();

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-32" aria-busy="true">
        <p className="text-muted-foreground">Chargement de l'article…</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-6 py-32">
        <h1 className="display-title text-foreground">Cet article est introuvable.</h1>
        <Link to="/blog" className="link-arrow mt-6">
          <ArrowLeft size={16} /> Voir tous les articles
        </Link>
      </div>
    );
  }

  // Keyed so reading progress and edit state reset from one article to the next.
  return <Article key={post.id} post={post} posts={blogPosts} />;
};

export default BlogPostPage;
