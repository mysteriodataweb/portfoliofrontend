import { useState } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogIn, LogOut } from "lucide-react";

export default function AdminLoginButton() {
  const { isAdmin, isLoading, login, logout } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (isLoading) return null;

  if (isAdmin) {
    return (
      <button
        onClick={logout}
        className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-sm font-medium text-foreground transition-colors hover:border-foreground"
      >
        <LogOut size={14} /> Admin
      </button>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(username, password);
      setShowForm(false);
      setUsername("");
      setPassword("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowForm(!showForm)}
        className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-sm font-medium text-foreground transition-colors hover:border-foreground"
      >
        <LogIn size={14} /> Admin
      </button>

      {showForm && (
        <div className="panel absolute right-0 top-full z-50 mt-3 w-72 p-5 max-xl:left-0 max-xl:right-auto">
          <form onSubmit={handleLogin} className="space-y-3">
            {error && <p className="text-xs text-destructive">{error}</p>}
            <Input
              placeholder="Nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="h-10 text-sm"
            />
            <Input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-10 text-sm"
            />
            <Button
              type="submit"
              size="sm"
              className="w-full"
            >
              Se connecter
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
