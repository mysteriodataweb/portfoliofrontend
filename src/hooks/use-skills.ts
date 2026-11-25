import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";

export interface Skill {
  id: number;
  name: string;
  level: number;
  categoryId: number;
  sortOrder: number;
  icon?: string;
}

export interface SkillCategory {
  id: number;
  name: string;
  /** English name, empty until translated. */
  nameEn?: string | null;
  icon: string;
  color: string;
  sortOrder: number;
  skills: Skill[];
}

export interface Certification {
  id: number;
  name: string;
  org: string;
  year: string;
  /** Link to the certificate online (Credly, Coursera…), opened when the card is clicked. */
  url: string | null;
}

interface SkillsData {
  skillCategories: SkillCategory[];
  certifications: Certification[];
}

export function useSkills() {
  return useQuery({
    queryKey: ["skills"],
    queryFn: () => api.get<SkillsData>("/skills"),
  });
}
