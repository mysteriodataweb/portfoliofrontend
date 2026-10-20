import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLoginPage() {
  const { isAdmin, isLoading, login } = useAdmin();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (isLoading) return null;
  if (isAdmin) return <Navigate to="/" replace />;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(username, password);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    }
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        <div className="panel mx-auto w-full max-w-sm p-6">
          <h1 className="mb-5 text-xl font-normal text-foreground">Administration</h1>
          <form onSubmit={handleLogin} className="space-y-3">
            {error && <p className="text-xs text-destructive">{error}</p>}
            <Input
              placeholder="Nom d'utilisateur"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="h-10 text-sm"
            />
            <Input
              type="password"
              placeholder="Mot de passe"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-10 text-sm"
            />
            <Button type="submit" size="sm" className="w-full">
              Se connecter
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
