import { Button } from "@/components/ui/button";
import { useState } from "react";
import { SignInDialog } from "./SignInDialog";

const Header = ({ signInWithGoogle }: { signInWithGoogle: () => void | Promise<void> }) => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="flex h-16 items-center justify-between mx-auto px-10">
        <nav className="hidden items-center gap-2 text-sm md:flex">
          <img width={'28px'} src="../src/assets/logo.png" alt="logo" className="brightness-0 invert mr-3" />
          <Button size='sm' variant='ghost'>Features</Button>
          <Button size='sm' variant='ghost'>GitHub</Button>
        </nav>

        <SignInDialog
          signInWithGoogle={signInWithGoogle}
          trigger={
            <Button variant="outline" className="border-border text-foreground hover:bg-muted">
              Sign In
            </Button>
          }
        />

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-foreground hover:bg-muted md:hidden"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="pointer-events-none">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="grid gap-2 text-sm">
            <a className="rounded-md px-2 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground" href="#">
              Home
            </a>
            <a className="rounded-md px-2 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground" href="#">
              GitHub
            </a>
          </nav>
          <div className="mt-4 flex gap-2 px-2">
            <SignInDialog
              signInWithGoogle={signInWithGoogle}
              trigger={<Button variant="outline" className="w-full border-border text-foreground hover:bg-muted">Sign In</Button>}
            />
          </div>
        </div>
      )}
    </header>
  );
};

export { Header };