import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { AppUser } from "@compkit/types";
import { mapSupabaseUser } from "@/lib/mapSupabaseUser";

export function useAuth() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(mapSupabaseUser(data.session?.user ?? null));
      setLoading(false);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(mapSupabaseUser(session?.user ?? null));
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return { user, loading };
}
