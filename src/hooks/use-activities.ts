import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/client";

export interface Activity {
  id: number;
  title: string;
  category: string | null;
  date: string | null;
  description: string | null;
  mediaUrl: string;
}

export type ActivityInput = Omit<Activity, "id">;

export function useActivities() {
  return useQuery({
    queryKey: ["activities"],
    queryFn: () => api.get<Activity[]>("/activities"),
  });
}

export function useSaveActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id?: number; data: ActivityInput }) =>
      id ? api.put<Activity>(`/admin/activities/${id}`, data) : api.post<Activity>("/admin/activities", data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["activities"] }),
  });
}

export function useDeleteActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/admin/activities/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["activities"] }),
  });
}
