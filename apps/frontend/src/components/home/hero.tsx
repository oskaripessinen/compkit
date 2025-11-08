import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge";
import { Header } from "./header";
import { SignInDialog } from "./SignInDialog";




const Hero = ({ signInWithGoogle }: { signInWithGoogle: () => void | Promise<void> }) => {
  return (
    <section className="relative border-b min-h-screen border-border bg-background overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-linear-to-tr from-primary/5 via-transparent to-transparent"
      />
      <Header signInWithGoogle={signInWithGoogle} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center min-h-[calc(100vh-4rem)]">
        <div className="pb-24">
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
            <SignInDialog signInWithGoogle={signInWithGoogle} />
            <Button variant="outline" className="border-border text-foreground hover:bg-muted">
              See how it works
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
};

export { Hero };