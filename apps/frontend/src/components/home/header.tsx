import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

const Header = ({ signInWithGoogle }: { signInWithGoogle: () => void | Promise<void> }) => {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="flex h-16 items-center justify-between mx-auto px-10">
        <nav className="hidden items-center gap-2 text-sm md:flex">
          <img width={'28px'} src="../src/assets/logo.png" alt="logo" className="brightness-0 invert mr-3" />
          <Button size='sm' variant='ghost'>Features</Button>
          <Button size='sm' variant='ghost'>GitHub</Button>
        </nav>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="border-border text-foreground hover:bg-muted">
              Sign In
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Sign In</DialogTitle>
              <DialogDescription>
                <div className="flex flex-col gap-4 mt-2">
                  <p className="text-sm text-muted-foreground">
                    Please enter your email to sign in.
                  </p>
                  <div className="flex flex-row gap-3">
                    <Input placeholder="Email" />
                    <Button variant='outline' className="border-border text-foreground">Continue</Button>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 border-t border-border" />
                    <span className="text-sm text-muted-foreground">or</span>
                    <div className="flex-1 border-t border-border" />
                  </div>

                  <Button
                    variant='secondary'
                    className="w-full"
                    onClick={signInWithGoogle}
                >
                    <div className="flex flex-row items-center justify-center gap-0">
                        <svg className="mr-2 h-10 w-10" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                        </svg>
                        Continue with Google
                    </div>
                </Button>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>


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
            <div className="mt-4 flex gap-2">
              <Button variant="outline" className="border-border text-foreground hover:bg-muted">
                Sign In
              </Button>
            </div>
        </div>
      )}
    </header>
  )
}

export { Header };