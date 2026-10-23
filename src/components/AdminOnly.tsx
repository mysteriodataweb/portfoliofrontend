import { ReactNode } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import NotFound from "@/pages/NotFound";

/** Pages kept for the admin only: visitors who type the address get the 404 page. */
const AdminOnly = ({ children }: { children: ReactNode }) => {
  const { isAdmin, isLoading } = useAdmin();
  if (isLoading) return null;
  return isAdmin ? <>{children}</> : <NotFound />;
};

export default AdminOnly;
