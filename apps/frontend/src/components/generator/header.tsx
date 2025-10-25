import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { useState } from "react";



const Header = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out error:", error);
        return;
      }
      navigate("/");
    } catch (error) {
      console.error("Unexpected sign out error:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <img width={'28px'} src="../src/assets/logo.png" alt="logo" className="brightness-0 invert" />
          <span className="text-lg font-semibold text-foreground">Compkit</span>
          <Badge variant="secondary" className="ml-2 text-xs">Generator</Badge>
        </div>
        <nav className="hidden items-center gap-4 text-sm md:flex">
          <Button
            onClick={handleSignOut}
            disabled={loading}
            size="sm"
            variant="outline"
            className="border-border text-foreground hover:bg-muted"
          >
            {loading ? "Signing out..." : "Sign Out"}
          </Button>
        </nav>
      </div>
    </header>
  );
};

export { Header };