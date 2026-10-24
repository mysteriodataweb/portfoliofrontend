import { useState } from "react";
import {
  Award,
  ArrowUpRight,
  Pencil,
  Plus,
  Trash2,
  ArrowRight,
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import ImageUpload from "@/components/ImageUpload";
import { useSkills } from "@/hooks/use-skills";
import { useTools } from "@/hooks/use-tools";
import { track } from "@/lib/analytics";
import CollectionSurfer from "@/components/ui/collection-surfer";
import { useAdmin } from "@/contexts/AdminContext";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { api } from "@/api/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import SkillsExplorer from "@/components/SkillsExplorer";
import { useLanguage } from "@/i18n";
import { localizeCategory } from "@/i18n/content";

const SkillsPage = () => {
  const { data, isLoading, refetch } = useSkills();
  const { data: tools = [], refetch: refetchTools } = useTools();
  const { isAdmin } = useAdmin();
  const { lang, t } = useLanguage();

  // Certification dialog
  const [showCertDialog, setShowCertDialog] = useState(false);
  const [editingCert, setEditingCert] = useState<any>(null);
  const [certForm, setCertForm] = useState({ name: "", org: "", year: new Date().getFullYear(), url: "" });

  // Tool dialog
  const [showToolDialog, setShowToolDialog] = useState(false);
  const [editingTool, setEditingTool] = useState<any>(null);
  const [toolForm, setToolForm] = useState({ name: "", image: "" });

  const skillCategories = (data?.skillCategories || []).map((c) => localizeCategory(c, lang));
  const certifications = data?.certifications || [];

  const openAddCert = () => {
    setEditingCert(null);
    setCertForm({ name: "", org: "", year: new Date().getFullYear(), url: "" });
    setShowCertDialog(true);
  };

  const openEditCert = (cert: any) => {
    setEditingCert(cert);
    setCertForm({ name: cert.name, org: cert.org, year: cert.year, url: cert.url || "" });
    setShowCertDialog(true);
  };

  const saveCert = async () => {
    try {
      if (editingCert) {
        await api.put(`/admin/skills/certifications/${editingCert.id}`, certForm);
        toast.success("Certification mise à jour !");
      } else {
        await api.post("/admin/skills/certifications", certForm);
        toast.success("Certification ajoutée !");
      }
      setShowCertDialog(false);
      refetch();
    } catch (err: any) { toast.error(err.message || "Erreur"); }
  };

  const deleteCert = async (cert: any) => {
    if (!confirm(`Supprimer "${cert.name}" ?`)) return;
    try {
      await api.delete(`/admin/skills/certifications/${cert.id}`);
      toast.success("Certification supprimée !");
      refetch();
    } catch (err: any) { toast.error(err.message || "Erreur"); }
  };

  const openAddTool = () => {
    setEditingTool(null);
    setToolForm({ name: "", image: "" });
    setShowToolDialog(true);
  };

  const openEditTool = (tool: any) => {
    setEditingTool(tool);
    setToolForm({ name: tool.name, image: tool.image || "" });
    setShowToolDialog(true);
  };

  const saveTool = async () => {
    try {
      if (editingTool) {
        await api.put(`/admin/tools/${editingTool.id}`, toolForm);
        toast.success("Outil mis à jour !");
      } else {
        await api.post("/admin/tools", toolForm);
        toast.success("Outil ajouté !");
      }
      setShowToolDialog(false);
      refetchTools();
    } catch (err: any) { toast.error(err.message || "Erreur"); }
  };

  const deleteTool = async (tool: any) => {
    if (!confirm(`Supprimer "${tool.name}" ?`)) return;
    try {
      await api.delete(`/admin/tools/${tool.id}`);
      toast.success("Outil supprimé !");
      refetchTools();
    } catch (err: any) { toast.error(err.message || "Erreur"); }
  };

  if (isLoading) {
    return <div className="py-32 text-center"><p className="text-muted-foreground">{t.common.loading}</p></div>;
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        <AnimatedSection>
          <div className="mb-16">
            <h1 className="display-title text-foreground mb-4">{t.skills.title}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">{t.skills.intro}</p>
          </div>
        </AnimatedSection>

        {/* Compétences */}
        <AnimatedSection>
          <div className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="section-title text-foreground">{t.skills.byDomain}</h2>
            </div>
            <SkillsExplorer categories={skillCategories} />
          </div>
        </AnimatedSection>

        {/* Certifications */}
        <AnimatedSection>
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title text-foreground">{t.skills.certifications}</h2>
            {isAdmin && (
              <button onClick={openAddCert} className="pill-btn-outline text-sm">
                <Plus className="h-4 w-4 mr-2" /> Ajouter
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {certifications.map((cert) => (
              <div key={cert.id} className="group/cert relative bg-white border border-border rounded-none p-6 flex items-start gap-4 card-hover">
                <div className="p-2 rounded-none bg-secondary text-foreground"><Award size={20} /></div>
                <div className="flex-1">
                  <h3 className="font-heading font-semibold text-foreground text-sm">
                    {cert.url ? (
                      // The link covers the whole card, so a click anywhere opens the certificate.
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => track("certification", { nom: cert.name })}
                        className="after:absolute after:inset-0 hover:underline"
                      >
                        {cert.name}
                      </a>
                    ) : (
                      cert.name
                    )}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">{cert.org} · {cert.year}</p>
                  {cert.url && (
                    <p className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-foreground">
                      {t.skills.seeCertificate} <ArrowUpRight size={12} aria-hidden="true" />
                    </p>
                  )}
                </div>
                {isAdmin && (
                  <div className="relative z-10 flex gap-1 opacity-0 group-hover/cert:opacity-100 transition-opacity">
                    <button className="p-1 rounded hover:bg-foreground/5" onClick={() => openEditCert(cert)}><Pencil size={12} className="text-muted-foreground" /></button>
                    <button className="p-1 rounded hover:bg-red-50" onClick={() => deleteCert(cert)}><Trash2 size={12} className="text-red-500" /></button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Outils */}
        <AnimatedSection>
          <div className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="section-title text-foreground">{t.skills.tools}</h2>
              {isAdmin && (
                <button onClick={openAddTool} className="pill-btn-outline text-sm">
                  <Plus className="h-4 w-4 mr-2" /> Ajouter
                </button>
              )}
            </div>
            <CollectionSurfer tools={tools} isAdmin={isAdmin} onEdit={openEditTool} onDelete={deleteTool} />
          </div>
        </AnimatedSection>

        <AnimatedSection className="text-center">
          <Link to="/projets" className="link-arrow">
            {t.skills.projectsLink} <ArrowRight size={16} />
          </Link>
        </AnimatedSection>
      </div>

      {/* Certification Dialog */}
      <Dialog open={showCertDialog} onOpenChange={setShowCertDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingCert ? "Modifier" : "Ajouter"} une certification</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div><label className="text-sm font-medium">Nom *</label><Input value={certForm.name} onChange={(e) => setCertForm({ ...certForm, name: e.target.value })} className="rounded-md" /></div>
            <div><label className="text-sm font-medium">Organisme</label><Input value={certForm.org} onChange={(e) => setCertForm({ ...certForm, org: e.target.value })} className="rounded-md" /></div>
            <div><label className="text-sm font-medium">Année</label><Input type="number" value={certForm.year} onChange={(e) => setCertForm({ ...certForm, year: Number(e.target.value) })} className="rounded-md" /></div>
            <div>
              <label className="text-sm font-medium" htmlFor="cert-url">Lien du certificat</label>
              <Input id="cert-url" type="url" placeholder="https://www.credly.com/badges/..." value={certForm.url} onChange={(e) => setCertForm({ ...certForm, url: e.target.value })} className="rounded-md" />
              <p className="mt-1 text-xs text-muted-foreground">Facultatif. La carte s'ouvrira sur ce lien dans un nouvel onglet.</p>
            </div>
          </div>
          <DialogFooter>
            <button onClick={() => setShowCertDialog(false)} className="pill-btn-outline text-sm">Annuler</button>
            <button onClick={saveCert} disabled={!certForm.name} className="pill-btn text-sm">{editingCert ? "Mettre a jour" : "Ajouter"}</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tool Dialog */}
      <Dialog open={showToolDialog} onOpenChange={setShowToolDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingTool ? "Modifier" : "Ajouter"} un outil</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div><label className="text-sm font-medium">Nom *</label><Input value={toolForm.name} onChange={(e) => setToolForm({ ...toolForm, name: e.target.value })} className="rounded-md" /></div>
            <div><label className="text-sm font-medium">Image (logo)</label><ImageUpload value={toolForm.image} onChange={(url) => setToolForm({ ...toolForm, image: url })} /></div>
          </div>
          <DialogFooter>
            <button onClick={() => setShowToolDialog(false)} className="pill-btn-outline text-sm">Annuler</button>
            <button onClick={saveTool} disabled={!toolForm.name} className="pill-btn text-sm">{editingTool ? "Mettre a jour" : "Ajouter"}</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default SkillsPage;
