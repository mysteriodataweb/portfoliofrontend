import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { api } from "@/api/client";
import type { SkillCategory } from "@/hooks/use-skills";

interface SkillsAdminProps {
  /** Domains as stored, with their French names. */
  categories: SkillCategory[];
  onChange: () => void;
}

interface CategoryForm {
  id?: number;
  name: string;
  nameEn: string;
}

interface SkillForm {
  id?: number;
  categoryId: number;
  name: string;
  level: number;
}

const clampLevel = (value: number) => Math.min(100, Math.max(0, Math.round(value || 0)));
const nextOrder = (items: { sortOrder: number }[]) => Math.max(0, ...items.map((item) => item.sortOrder ?? 0)) + 1;
const showError = (err: unknown) => toast.error(err instanceof Error && err.message ? err.message : "Erreur");

/** Admin only: add, rename or remove the skill domains, and the skills in each with their level. */
const SkillsAdmin = ({ categories, onChange }: SkillsAdminProps) => {
  const [categoryForm, setCategoryForm] = useState<CategoryForm | null>(null);
  const [skillForm, setSkillForm] = useState<SkillForm | null>(null);
  const [saving, setSaving] = useState(false);

  const saveCategory = async () => {
    if (!categoryForm) return;
    const existing = categories.find((c) => c.id === categoryForm.id);
    const body = {
      name: categoryForm.name.trim(),
      name_en: categoryForm.nameEn.trim(),
      // Not edited here: kept as they are, or the usual defaults for a new domain.
      icon: existing?.icon ?? "Code2",
      color: existing?.color ?? "primary",
      sort_order: existing?.sortOrder ?? nextOrder(categories),
    };
    setSaving(true);
    try {
      if (existing) await api.put(`/admin/skills/categories/${existing.id}`, body);
      else await api.post("/admin/skills/categories", body);
      toast.success(existing ? "Domaine mis à jour !" : "Domaine ajouté !");
      setCategoryForm(null);
      onChange();
    } catch (err) {
      showError(err);
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async (category: SkillCategory) => {
    const count = category.skills.length;
    if (!confirm(`Supprimer le domaine "${category.name}"${count ? ` et ses ${count} compétence${count > 1 ? "s" : ""}` : ""} ?`)) return;
    try {
      await api.delete(`/admin/skills/categories/${category.id}`);
      toast.success("Domaine supprimé !");
      onChange();
    } catch (err) {
      showError(err);
    }
  };

  const saveSkill = async () => {
    if (!skillForm) return;
    const existing = categories.flatMap((c) => c.skills).find((s) => s.id === skillForm.id);
    const target = categories.find((c) => c.id === skillForm.categoryId);
    const body = {
      category_id: skillForm.categoryId,
      name: skillForm.name.trim(),
      level: clampLevel(skillForm.level),
      // A skill moved to another domain goes to the end of it.
      sort_order: existing && existing.categoryId === skillForm.categoryId ? existing.sortOrder : nextOrder(target?.skills ?? []),
    };
    setSaving(true);
    try {
      if (existing) await api.put(`/admin/skills/${existing.id}`, body);
      else await api.post("/admin/skills", body);
      toast.success(existing ? "Compétence mise à jour !" : "Compétence ajoutée !");
      setSkillForm(null);
      onChange();
    } catch (err) {
      showError(err);
    } finally {
      setSaving(false);
    }
  };

  const deleteSkill = async (id: number, name: string) => {
    if (!confirm(`Supprimer "${name}" ?`)) return;
    try {
      await api.delete(`/admin/skills/${id}`);
      toast.success("Compétence supprimée !");
      onChange();
    } catch (err) {
      showError(err);
    }
  };

  return (
    <div className="mt-8 border border-dashed border-foreground/40 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-foreground">Gérer les compétences</p>
          <p className="text-sm text-muted-foreground">Visible par vous seul. Le niveau va de 0 à 100.</p>
        </div>
        <button onClick={() => setCategoryForm({ name: "", nameEn: "" })} className="pill-btn-outline text-sm">
          <Plus className="mr-2 h-4 w-4" /> Domaine
        </button>
      </div>

      {categories.map((category) => (
        <div key={category.id} className="mt-6 border-t border-border pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-foreground">
              {category.name}
              {category.nameEn && <span className="font-normal text-muted-foreground"> · {category.nameEn}</span>}
            </h3>
            <button
              aria-label={`Modifier le domaine ${category.name}`}
              onClick={() => setCategoryForm({ id: category.id, name: category.name, nameEn: category.nameEn ?? "" })}
              className="p-1 hover:bg-foreground/5"
            >
              <Pencil size={14} className="text-muted-foreground" />
            </button>
            <button aria-label={`Supprimer le domaine ${category.name}`} onClick={() => deleteCategory(category)} className="p-1 hover:bg-red-50">
              <Trash2 size={14} className="text-red-500" />
            </button>
            <button
              onClick={() => setSkillForm({ categoryId: category.id, name: "", level: 50 })}
              className="ml-auto inline-flex items-center gap-1 text-sm font-medium hover:underline"
            >
              <Plus size={14} /> Compétence
            </button>
          </div>
          <ul className="mt-3 flex flex-wrap gap-2">
            {category.skills.map((skill) => (
              <li key={skill.id} className="flex items-center gap-1 border border-border bg-card py-1 pl-3 pr-1 text-sm">
                <span className="text-foreground">{skill.name}</span>
                <span className="ml-1 font-mono text-xs text-muted-foreground">{skill.level}</span>
                <button
                  aria-label={`Modifier ${skill.name}`}
                  onClick={() => setSkillForm({ id: skill.id, categoryId: category.id, name: skill.name, level: skill.level })}
                  className="p-1 hover:bg-foreground/5"
                >
                  <Pencil size={12} className="text-muted-foreground" />
                </button>
                <button aria-label={`Supprimer ${skill.name}`} onClick={() => deleteSkill(skill.id, skill.name)} className="p-1 hover:bg-red-50">
                  <Trash2 size={12} className="text-red-500" />
                </button>
              </li>
            ))}
            {category.skills.length === 0 && <li className="text-sm text-muted-foreground">Aucune compétence.</li>}
          </ul>
        </div>
      ))}

      <Dialog open={categoryForm !== null} onOpenChange={(open) => !open && setCategoryForm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{categoryForm?.id ? "Modifier le domaine" : "Ajouter un domaine"}</DialogTitle>
          </DialogHeader>
          {categoryForm && (
            <div className="space-y-4 py-4">
              <div>
                <label htmlFor="category-name" className="text-sm font-medium">Nom *</label>
                <Input id="category-name" value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} className="rounded-md" />
              </div>
              <div>
                <label htmlFor="category-name-en" className="text-sm font-medium">Nom (EN)</label>
                <Input id="category-name-en" lang="en" value={categoryForm.nameEn} onChange={(e) => setCategoryForm({ ...categoryForm, nameEn: e.target.value })} className="rounded-md" />
                <p className="mt-1 text-xs text-muted-foreground">Affiché sur la version anglaise du site. Vide : le nom français.</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <button onClick={() => setCategoryForm(null)} className="pill-btn-outline text-sm">Annuler</button>
            <button onClick={saveCategory} disabled={saving || !categoryForm?.name.trim()} className="pill-btn text-sm">
              {categoryForm?.id ? "Mettre à jour" : "Ajouter"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={skillForm !== null} onOpenChange={(open) => !open && setSkillForm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{skillForm?.id ? "Modifier la compétence" : "Ajouter une compétence"}</DialogTitle>
          </DialogHeader>
          {skillForm && (
            <div className="space-y-4 py-4">
              <div>
                <label htmlFor="skill-name" className="text-sm font-medium">Nom *</label>
                <Input id="skill-name" value={skillForm.name} onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })} className="rounded-md" />
              </div>
              <div>
                <label htmlFor="skill-level" className="text-sm font-medium">Niveau (0 à 100)</label>
                <Input
                  id="skill-level"
                  type="number"
                  min={0}
                  max={100}
                  value={skillForm.level}
                  onChange={(e) => setSkillForm({ ...skillForm, level: Number(e.target.value) })}
                  className="rounded-md"
                />
              </div>
              <div>
                <label htmlFor="skill-category" className="text-sm font-medium">Domaine</label>
                <select
                  id="skill-category"
                  value={skillForm.categoryId}
                  onChange={(e) => setSkillForm({ ...skillForm, categoryId: Number(e.target.value) })}
                  className="h-10 w-full rounded-md border border-border bg-background px-3 text-foreground"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
          <DialogFooter>
            <button onClick={() => setSkillForm(null)} className="pill-btn-outline text-sm">Annuler</button>
            <button onClick={saveSkill} disabled={saving || !skillForm?.name.trim()} className="pill-btn text-sm">
              {skillForm?.id ? "Mettre à jour" : "Ajouter"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SkillsAdmin;
