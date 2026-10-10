import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Pencil } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import ProjectCard from "@/components/ProjectCard";
import BlogCard from "@/components/BlogCard";
import MorphButton from "@/components/MorphButton";
import IdentityCard from "@/components/IdentityCard";
import { useFeaturedProjects } from "@/hooks/use-projects";
import { useBlogPosts } from "@/hooks/use-blog";
import { useStats } from "@/hooks/use-stats";
import { useAdmin } from "@/contexts/AdminContext";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { api } from "@/api/client";
import { toast } from "sonner";

const Index = () => {
  const { data: featured = [] } = useFeaturedProjects();
  const { data: allPosts = [] } = useBlogPosts();
  const { data: stats, refetch: refetchStats } = useStats();
  const { isAdmin } = useAdmin();
  const featuredSliced = featured.slice(0, 4);
  const latestPosts = allPosts.slice(0, 3);

  const [showStatsDialog, setShowStatsDialog] = useState(false);
  const [statsForm, setStatsForm] = useState({ yearsExperience: 5, clientsCount: 15 });

  const openEditStats = () => {
    setStatsForm({
      yearsExperience: stats?.yearsExperience ?? 5,
      clientsCount: stats?.clientsCount ?? 15,
    });
    setShowStatsDialog(true);
  };

  const saveStats = async () => {
    try {
      await api.put("/admin/stats", statsForm);
      toast.success("Statistiques mises à jour !");
      setShowStatsDialog(false);
      refetchStats();
    } catch (err: any) {
      toast.error(err.message || "Erreur");
    }
  };

  const years = stats?.yearsExperience ?? 5;
  const clients = stats?.clientsCount ?? 15;
  const projectsCount = stats?.projectsCount ?? 0;
  const articlesCount = stats?.articlesCount ?? 0;

  return (
    <>
      {/* Hero */}
      <section className="min-h-[90vh] flex items-center relative overflow-hidden bg-background">
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #171717 1px, transparent 0)", backgroundSize: "40px 40px" }} />

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
            <div className="lg:col-span-3">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-[#6B6B6B] font-medium mb-4"
              >
                Bonjour, je suis
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-5xl md:text-7xl font-heading font-bold text-foreground mb-4 leading-tight"
              >
                Alfred <span className="text-accent">Mysterio</span>WebData
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xl md:text-2xl font-heading font-medium text-foreground mb-6"
              >
                Data Scientist & <span className="text-accent">Fullstack Developer</span>
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-lg text-[#6B6B6B] max-w-lg mb-10 leading-relaxed"
              >
                Je transforme les donnees en insights actionnables et les idees en applications web performantes. Passionne par l'IA et le developpement moderne.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <MorphButton to="/projets">Voir mes projets</MorphButton>
                <Link to="/contact" className="pill-btn-outline">
                  Contact Me
                </Link>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-2 flex justify-center items-center"
            >
              <IdentityCard />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Band */}
      <div className="stats-band relative">
        {isAdmin && (
          <button
            onClick={openEditStats}
            className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white/70 bg-white/10 hover:bg-white/20 hover:text-white transition-colors"
            title="Modifier les statistiques"
          >
            <Pencil size={12} /> Modifier
          </button>
        )}
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{years}<span className="text-accent">+</span></p>
              <p className="text-xs text-white/60 mt-1 uppercase tracking-wider">Annees d'experience</p>
            </div>
            <div className="w-px h-10 bg-white/20 hidden md:block" />
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{projectsCount}<span className="text-accent">+</span></p>
              <p className="text-xs text-white/60 mt-1 uppercase tracking-wider">Projets realises</p>
            </div>
            <div className="w-px h-10 bg-white/20 hidden md:block" />
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{clients}<span className="text-accent">+</span></p>
              <p className="text-xs text-white/60 mt-1 uppercase tracking-wider">Clients satisfaits</p>
            </div>
            <div className="w-px h-10 bg-white/20 hidden md:block" />
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{articlesCount}<span className="text-accent">+</span></p>
              <p className="text-xs text-white/60 mt-1 uppercase tracking-wider">Articles publies</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Projects */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">Projets <span className="text-accent">selectionnes</span></h2>
            <p className="text-[#6B6B6B] mb-12">Une selection de mes travaux les plus recents.</p>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredSliced.map((project, i) => (
              <AnimatedSection key={project.id} delay={i * 0.1}>
                <ProjectCard project={project} />
              </AnimatedSection>
            ))}
          </div>
          <AnimatedSection className="mt-12 text-center">
            <Link to="/projets" className="link-arrow">
              Voir tous les projets <ArrowRight size={16} />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Blog */}
      <section className="py-24 bg-card border-y border-border">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">Du <span className="text-accent">blog</span></h2>
            <p className="text-[#6B6B6B] mb-12">Reflexions et tutoriels sur la data science et le developpement.</p>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestPosts.map((post, i) => (
              <AnimatedSection key={post.id} delay={i * 0.1}>
                <BlogCard post={post} />
              </AnimatedSection>
            ))}
          </div>
          <AnimatedSection className="mt-12 text-center">
            <Link to="/blog" className="link-arrow">
              Voir tous les articles <ArrowRight size={16} />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats Dialog */}
      <Dialog open={showStatsDialog} onOpenChange={setShowStatsDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Modifier les statistiques</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div><label className="text-sm font-medium">Annees d'experience</label><Input type="number" value={statsForm.yearsExperience} onChange={(e) => setStatsForm({ ...statsForm, yearsExperience: Number(e.target.value) })} className="rounded-full" /></div>
            <div><label className="text-sm font-medium">Clients satisfaits</label><Input type="number" value={statsForm.clientsCount} onChange={(e) => setStatsForm({ ...statsForm, clientsCount: Number(e.target.value) })} className="rounded-full" /></div>
            <p className="text-xs text-[#6B6B6B]">
              Projets realises et Articles publies sont calcules automatiquement depuis le site.
            </p>
          </div>
          <DialogFooter>
            <button onClick={() => setShowStatsDialog(false)} className="pill-btn-outline text-sm">Annuler</button>
            <button onClick={saveStats} className="pill-btn text-sm">Enregistrer</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Index;
