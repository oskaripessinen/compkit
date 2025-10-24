import { useState } from "react"
import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const Container = ({ children, className = "" }: { children: ReactNode; className?: string }) => {
  return <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
}

const Header = () => {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="flex h-16 items-center justify-between mx-auto px-10">
        <nav className="hidden items-center gap-2 text-sm md:flex">
          <img width={'28px'} src="../src/assets/logo.png" alt="logo" className="brightness-0 invert mr-3" />
          <Button size='sm' variant='ghost'>Features</Button>
          <Button size='sm' variant='ghost'>GitHub</Button>
        </nav>

        <Button variant="outline" className="border-border text-foreground hover:bg-muted">
            Sign In
        </Button>

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
          <Container className="py-4">
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
          </Container>
        </div>
      )}
    </header>
  )
}


const Hero = () => {
  return (
    <section className="relative border-b min-h-screen border-border bg-background overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-linear-to-tr from-primary/5 via-transparent to-transparent"
      />
      <Header/>
      <Container className="flex h-[calc(100vh-10rem)] items-center justify-between gap-12 px-4">
        <div className="flex-1">
          <Badge className="mb-4 gap-2 border-border bg-card/60 text-muted-foreground shadow-sm inline-flex justify-center">
            <span className="inline-block h-2 w-2 rounded-full bg-success" />
            AI component builder
          </Badge>
          <h1 className="line-clamp-2 text-balance text-4xl font-semibold text-foreground sm:text-5xl">
            Build beautiful web components in seconds with AI.
          </h1>
          <p className="mt-5 text-pretty text-base text-muted-foreground max-w-xl">
            Compkit helps you generate modern, reusable React & Tailwind components instantly from simple prompts.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="default">Try it now</Button>
            <Button variant="outline" className="border-border text-foreground hover:bg-muted">
              See how it works
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}

const Showcase = () => {


  return (
    <section className="border-b border-border bg-background min-h-screen grid place-items-center">
      <Container className="flex min-h-[60vh] flex-col items-center justify-center py-16 sm:py-20">
        <div className="mx-auto max-w-3xl text-center justify-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">See it in action</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Generate and preview your components in real time before exporting.
          </p>
        </div>

        <div className="mt-10 grid w-full max-w-5xl mx-auto gap-6 lg:grid-cols-2 justify-center place-items-center">

        </div>
      </Container>
    </section>
  )
}


const Footer = () => {
  return (
    <footer className="bg-background border-t border-border">
      <Container className="py-16">
        <div className="">
          <div className="flex flex-row justify-between">
            <div className="space-y-1">
              <div className="text-2xl font-semibold text-foreground">Compkit</div>
              <p className="text-sm text-muted-foreground">Assemble beautiful UI with AI.</p>
            </div>


            <button
              type="button"
              aria-label="Back to top"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition-colors hover:bg-muted"
              title="Back to top"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 5l-7 7m7-7 7 7M12 5v14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <hr className="my-3 border-0 border-border/70" />

          <div className="flex flex-row items-center justify-between">
            <p className="text-sm text-muted-foreground">©2025 compkit</p>
            <nav className="flex flex-row items-center gap-5 text-sm">
              <a className="text-muted-foreground hover:text-foreground" href="#">Home</a>
              <a className="text-muted-foreground hover:text-foreground" href="#">GitHub</a>
            </nav>
          </div>
          
        </div>
      </Container>
    </footer>
  )
}

const Home = () => {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Hero />
      <Showcase />
      <Footer />
    </div>
  )
}

export default Home