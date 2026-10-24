import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/client";

export interface CVSection {
  id: number;
  sort_order: number;
  title: string;
  title_en?: string | null;
  type: "experience" | "education" | "skills" | "custom";
  items: CVItem[];
}

export interface CVItem {
  id: number;
  section_id: number;
  sort_order: number;
  title: string;
  subtitle: string;
  date_start: string;
  date_end: string;
  description: string;
  highlights: string[];
  // English versions, empty until translated (the French text is shown instead).
  title_en?: string | null;
  subtitle_en?: string | null;
  description_en?: string | null;
  highlights_en?: string[] | null;
}

export interface CVData {
  sections: CVSection[];
}

export function useCVData() {
  return useQuery({
    queryKey: ["cv"],
    queryFn: () => api.get<CVData>("/cv"),
  });
}

export function useCreateSection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<CVSection>) => api.post<CVSection>("/admin/cv/sections", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cv"] }),
  });
}

export function useUpdateSection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CVSection> }) =>
      api.put(`/admin/cv/sections/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cv"] }),
  });
}

export function useDeleteSection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/admin/cv/sections/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cv"] }),
  });
}

export function useCreateItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<CVItem>) => api.post<CVItem>("/admin/cv/items", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cv"] }),
  });
}

export function useUpdateItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CVItem> }) =>
      api.put(`/admin/cv/items/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cv"] }),
  });
}

export function useDeleteItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/admin/cv/items/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cv"] }),
  });
}
