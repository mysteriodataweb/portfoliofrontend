import { useAdmin } from "@/contexts/AdminContext";
import { LogOut } from "lucide-react";

// Sign-in lives on /admin, out of the visitors' sight: the header only offers to sign out.
export default function AdminLogoutButton() {
  const { isAdmin, logout } = useAdmin();

  if (!isAdmin) return null;

  return (
    <button
      onClick={logout}
      className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-sm font-medium text-foreground transition-colors hover:border-foreground"
    >
      <LogOut size={14} /> Admin
    </button>
  );
}
