import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/client";

export interface Message {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  archived: boolean;
  archivedAt: string | null;
  createdAt: string;
  /** How the sender first found the site, null for messages sent before it was recorded. */
  source: string | null;
}

export function useMessages(enabled = true) {
  return useQuery({
    queryKey: ["messages"],
    queryFn: () => api.get<Message[]>("/admin/messages"),
    enabled,
  });
}

export function useUnreadCount(enabled = true) {
  return useQuery({
    queryKey: ["messages", "unread"],
    queryFn: () => api.get<{ count: number }>("/admin/messages/unread-count"),
    enabled,
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.patch(`/admin/messages/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      queryClient.invalidateQueries({ queryKey: ["messages", "unread"] });
    },
  });
}

export function useArchiveMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.patch(`/admin/messages/${id}/archive`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      queryClient.invalidateQueries({ queryKey: ["messages", "unread"] });
    },
  });
}

export function useUnarchiveMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.patch(`/admin/messages/${id}/unarchive`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      queryClient.invalidateQueries({ queryKey: ["messages", "unread"] });
    },
  });
}
