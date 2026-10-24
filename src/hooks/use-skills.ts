import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";

export interface Skill {
  name: string;
  level: number;
  icon?: string;
}

export interface SkillCategory {
  name: string;
  /** English name, empty until translated. */
  nameEn?: string | null;
  icon: string;
  color: string;
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
