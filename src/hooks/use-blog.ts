import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/client";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  image: string;
  date: string;
  readTime: string;
  content: string;
  published: boolean;
  archived: boolean;
  archivedAt: string | null;
  // English versions, empty until translated (the French text is shown instead).
  titleEn?: string | null;
  excerptEn?: string | null;
  contentEn?: string | null;
}

export function useBlogPosts(category?: string, search?: string) {
  return useQuery({
    queryKey: ["blog", category, search],
    queryFn: () => {
      const params = new URLSearchParams();
      if (category && category !== "Tous") params.set("category", category);
      if (search) params.set("search", search);
      const query = params.toString();
      return api.get<BlogPost[]>(`/blog${query ? `?${query}` : ""}`);
    },
  });
}

export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: ["blog", slug],
    queryFn: () => api.get<BlogPost>(`/blog/${slug}`),
    enabled: !!slug,
  });
}

export function useAllBlogPosts() {
  return useQuery({
    queryKey: ["blog"],
    queryFn: () => api.get<BlogPost[]>("/blog"),
  });
}

export function useArchiveBlogPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.patch(`/admin/blog/${id}/archive`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog"] });
    },
  });
}

export function useUnarchiveBlogPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.patch(`/admin/blog/${id}/unarchive`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog"] });
    },
  });
}
