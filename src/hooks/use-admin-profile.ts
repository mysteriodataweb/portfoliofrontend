import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/client";

export interface Profile {
  id: number;
  fullName: string;
  title: string;
  bio: string;
  photo: string;
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
}

export function useProfile() {
  return useQuery({
    queryKey: ["admin", "profile"],
    queryFn: () => api.get<Profile>("/admin/profile"),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Profile>) =>
      api.put<Profile>("/admin/profile", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "profile"] });
      queryClient.invalidateQueries({ queryKey: ["public-profile"] });
    },
  });
}
