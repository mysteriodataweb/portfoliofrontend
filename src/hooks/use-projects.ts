import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/client";
import type { ProjectCategory } from "@/data/project-categories";

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: ProjectCategory;
  shortDescription: string;
  fullDescription: string;
  image: string;
  techStack: string[];
  demoUrl?: string;
  githubUrl?: string;
  date: string;
  featured: boolean;
  published: boolean;
  archived: boolean;
  archivedAt: string | null;
  context: string;
  approach: string;
  results: string;
  challenges: string;
  // English versions, empty until translated (the French text is shown instead).
  titleEn?: string | null;
  shortDescriptionEn?: string | null;
  fullDescriptionEn?: string | null;
  contextEn?: string | null;
  approachEn?: string | null;
  resultsEn?: string | null;
  challengesEn?: string | null;
}

export function useProjects(category?: string) {
  return useQuery({
    queryKey: ["projects", category],
    queryFn: () => api.get<Project[]>(`/projects${category && category !== "all" ? `?category=${category}` : ""}`),
  });
}

export function useFeaturedProjects() {
  return useQuery({
    queryKey: ["projects", "featured"],
    queryFn: () => api.get<Project[]>("/projects/featured"),
  });
}

export function useProject(slug: string) {
  return useQuery({
    queryKey: ["projects", slug],
    queryFn: () => api.get<Project>(`/projects/${slug}`),
    enabled: !!slug,
  });
}

export function useAllProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: () => api.get<Project[]>("/projects"),
  });
}

export function useArchiveProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.patch(`/admin/projects/${id}/archive`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useUnarchiveProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.patch(`/admin/projects/${id}/unarchive`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}
