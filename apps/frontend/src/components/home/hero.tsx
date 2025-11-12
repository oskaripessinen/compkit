import { Button } from "@/components/ui/button";
import { Header } from "./header";
import { SignInDialog } from "./SignInDialog";
import { ArrowRight, Zap, Code2, Sparkles } from "lucide-react";

const Hero = ({ signInWithGoogle }: { signInWithGoogle: () => void | Promise<void> }) => {
  const scrollToShowcase = () => {
    const showcaseSection = document.querySelector('#showcase');
    if (showcaseSection) {
      showcaseSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative border-b min-h-screen border-border bg-background overflow-hidden">
      <Header signInWithGoogle={signInWithGoogle} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] py-20">
          <div className="text-center max-w-4xl space-y-6">
            {/* Status Badge */}
            <div className="flex justify-center">
            </div>

            {/* Brand */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl lg:text-5xl font-bold tracking-tight text-[#E5E5E5]">
                CompKit
              </h1>
              <p className="text-xl sm:text-2xl font-medium text-[#A1A1A1]">
                AI-Powered Component Libraries
              </p>
            </div>
            
            {/* Subheading */}
            <p className="text-base sm:text-lg text-[#A1A1A1] max-w-2xl mx-auto">
              Describe your design vision in natural language and watch as AI generates production-ready React components tailored to your style.
            </p>

            {/* Features */}
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <div className="flex items-center gap-2 text-sm text-[#A1A1A1] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-lg px-3 py-2">
                <Code2 className="size-4" />
                <span>React + TypeScript</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#A1A1A1] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-lg px-3 py-2">
                <Zap className="size-4" />
                <span>Tailwind CSS</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#A1A1A1] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-lg px-3 py-2">
                <Sparkles className="size-4" />
                <span>shadcn/ui Compatible</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <SignInDialog
                signInWithGoogle={signInWithGoogle}
                trigger={
                  <Button size="lg" className="bg-[#E5E5E5] text-[#0A0A0A] hover:bg-[rgba(255,255,255,0.9)] shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all">
                    Get Started
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                }
              />
              
              <Button 
                size="lg" 
                variant="outline"
                onClick={scrollToShowcase}
                className="bg-[#141414] text-[#E5E5E5] border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.06)] shadow-[0_0_20px_rgba(255,255,255,0.05)]"
              >
                Learn more
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero };