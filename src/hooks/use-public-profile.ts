import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";

export interface PublicProfile {
  id: number;
  fullName: string;
  title: string;
  bio: string;
  /** English biography, empty until translated. */
  bioEn?: string | null;
  photo: string;
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
}

export function usePublicProfile() {
  return useQuery({
    queryKey: ["public-profile"],
    queryFn: () => api.get<PublicProfile>("/profile"),
  });
}
