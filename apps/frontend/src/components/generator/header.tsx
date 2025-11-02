import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Gem } from "lucide-react";

import { useAuth } from '@/hooks/useAuth'

const Header = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSignOut = async () => {
    setLoading(true);
    try {
      // Clear all session storage
      sessionStorage.removeItem('generator-prompt');
      sessionStorage.removeItem('generator-code');
      sessionStorage.removeItem('generator-components');
      sessionStorage.removeItem('generator-selected');
      sessionStorage.removeItem('generator-conversation-mode');
      
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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto flex h-14 w-full items-center justify-between px-3">
        <div className="flex items-center gap-2">
          <img width={'28px'} src="../src/assets/logo.png" alt="logo" className="brightness-0 invert" />
            <span className="text-lg font-semibold text-foreground">Compkit</span>
        </div>
        <nav className="hidden items-center gap-4 text-sm md:flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="outline-none">
              <Button variant="ghost" className="px-3 py-6 border-0 ring-0 outline-none shadow-none">
                <img
                  src={user?.avatarUrl || `https://www.gravatar.com/avatar/?d=mp&s=64`}
                  alt="User Avatar"
                  className="h-7 w-7 rounded-md"
                />
                <div className="ml-1 flex flex-col items-start leading-tight">
                  <span className="">{user?.name}</span>
                  <span className="text-muted-foreground font-sans text-xs">{user?.tier || 'Free'}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="border-border shadow-md" align="end">
              <DropdownMenuLabel>
                <div className="flex items-center gap-3">
                  <img src={user?.avatarUrl || `https://www.gravatar.com/avatar/?d=mp&s=64`} alt="User Avatar"
                    className="h-9 w-9 rounded-md" />
                  <div className="flex flex-col gap-1">
                    <span className="text-xs">{user?.email}</span>
                    <Badge variant="secondary" className="text-xs">Free</Badge>
                  </div>
                </div>
                <div className="mt-3 items-center rounded-md bg-muted px-3 py-2 text-xs font-semibold flex justify-between">
                    <span className="flex flex-row gap-1"><Gem className="h-4 w-4" strokeWidth={1.4} /> Get Pro</span>
                    <Button size='sm' variant='default' className="text-xs h-7">Upgrade</Button>
                </div>
                <div className="mt-3 items-center rounded-md bg-muted px-3 py-2 text-xs font-semibold">
                  <div className="mb-1 flex justify-between">
                    <span>Credits</span>
                    <span className="text-muted-foreground text-xs">{user?.credits ?? 3} left</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-card mt-3">
                    <div
                      className="h-2 rounded-full bg-amber-50 transition-all duration-300"
                      style={{
                        width: `${((user?.credits ?? 3) / (5)) * 100}%`,
                      }}
                    > 
                    </div>
                  </div>

                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="h-px" />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuSeparator className="h-px" />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="h-4 w-4" /> Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
        </nav>
      </div>
    </header>
  );
};

export { Header };