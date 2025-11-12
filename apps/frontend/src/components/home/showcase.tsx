
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { SignInDialog } from "./SignInDialog";
import { ArrowRight } from "lucide-react";

const Showcase = ({ signInWithGoogle }: { signInWithGoogle: () => void | Promise<void> }) => {
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [showComponents, setShowComponents] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  
  const fullText = "generate an minimal dark UI library with matte surfaces and soft gray highlights";
  
  const components = [
    { name: "Button", delay: 0 },
    { name: "Card", delay: 0.2 },
    { name: "Navbar", delay: 0.4 },
    { name: "Input", delay: 0.6 },
    { name: "Modal", delay: 0.8 },
    { name: "Table", delay: 1.0 },
  ];
  
  // Intersection Observer to detect when section is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStarted) {
            setHasStarted(true);
          }
        });
      },
      { threshold: 0.3 } // Start when 30% of section is visible
    );

    const currentSection = sectionRef.current;
    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, [hasStarted]);
  
  useEffect(() => {
    // Only start typewriter effect when section is visible
    if (!hasStarted) return;
    
    // Typewriter effect
    if (typedText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText(fullText.slice(0, typedText.length + 1));
      }, 40);
      return () => clearTimeout(timeout);
    } else {
      // Text complete, blink cursor for a moment
      const timeout = setTimeout(() => {
        setShowCursor(false);
        setShowComponents(true);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [typedText, hasStarted]);

  return (
    <section id="showcase" ref={sectionRef} className="border-b border-border bg-background min-h-screen flex items-center py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">

        <div className="flex flex-col items-center justify-center w-full">
          {/* Typewriter text */}
          <div className="mb-8 text-center max-w-5xl px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="inline-flex items-center gap-2 text-sm sm:text-base md:text-lg font-mono text-foreground whitespace-nowrap overflow-x-auto max-w-full"
            >
              <span className="text-muted-foreground shrink-0">&gt;</span>
              <span className="text-left">{typedText}</span>
              {showCursor && <span className="animate-pulse">|</span>}
            </motion.div>
            
            {showComponents && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-xs text-muted-foreground mt-3"
              >
                From your style prompt to installable React components — instantly.
              </motion.p>
            )}
          </div>

          {/* Components Grid */}
          {showComponents && (
            <div className="w-full max-w-4xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {components.map((component) => (
                  <motion.div
                    key={component.name}
                    initial={{ opacity: 0, scale: 1, y: 0 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: component.delay,
                      type: "spring",
                      stiffness: 100 
                    }}
                    className="bg-card backdrop-blur-xl border border-border rounded-2xl p-4 transition-transform cursor-default"
                  >
                    {component.name === "Button" && (
                      <div className="space-y-2">
                        <div className="text-[10px] font-semibold text-[#A1A1A1] uppercase tracking-wide">Button</div>
                        <button className="w-full bg-[#141414] text-[#E5E5E5] rounded-lg py-2 px-3 text-xs font-semibold shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.06)] transition-all border border-[rgba(255,255,255,0.06)]">
                          Click me
                        </button>
                      </div>
                    )}
                    
                    {component.name === "Card" && (
                      <div className="space-y-2">
                        <div className="text-[10px] font-semibold text-[#A1A1A1] uppercase tracking-wide">Card</div>
                        <div className="bg-[#141414] border border-[rgba(255,255,255,0.06)] rounded-lg p-3 space-y-2 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                          <div className="w-full h-16 bg-[rgba(255,255,255,0.03)] rounded-lg shadow-inner"></div>
                          <div className="w-3/4 h-2 bg-[rgba(255,255,255,0.06)] rounded-full"></div>
                          <div className="w-1/2 h-2 bg-[rgba(255,255,255,0.03)] rounded-full"></div>
                        </div>
                      </div>
                    )}
                    
                    {component.name === "Navbar" && (
                      <div className="space-y-2">
                        <div className="text-[10px] font-semibold text-[#A1A1A1] uppercase tracking-wide">Navbar</div>
                        <div className="flex items-center justify-between bg-[#141414] border border-[rgba(255,255,255,0.06)] rounded-lg p-3 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                          <div className="w-6 h-6 bg-[rgba(255,255,255,0.06)] rounded shadow-[0_0_10px_rgba(255,255,255,0.08)]"></div>
                          <div className="flex gap-2">
                            <div className="w-8 h-2 bg-[rgba(255,255,255,0.03)] rounded-full"></div>
                            <div className="w-8 h-2 bg-[rgba(255,255,255,0.03)] rounded-full"></div>
                            <div className="w-8 h-2 bg-[rgba(255,255,255,0.03)] rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {component.name === "Input" && (
                      <div className="space-y-2">
                        <div className="text-[10px] font-semibold text-[#A1A1A1] uppercase tracking-wide">Input</div>
                        <div className="space-y-1.5">
                          <div className="w-full bg-[#141414] border border-[rgba(255,255,255,0.06)] rounded-lg p-2.5 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                            <div className="w-2/3 h-2 bg-[rgba(255,255,255,0.06)] rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {component.name === "Modal" && (
                      <div className="space-y-2">
                        <div className="text-[10px] font-semibold text-[#A1A1A1] uppercase tracking-wide">Modal</div>
                        <div className="bg-[#141414] border border-[rgba(255,255,255,0.06)] rounded-lg p-3 space-y-2 shadow-[0_0_20px_rgba(255,255,255,0.08)]">
                          <div className="flex justify-between items-center">
                            <div className="w-16 h-2 bg-[rgba(255,255,255,0.08)] rounded-full"></div>
                          </div>
                          <div className="space-y-1.5">
                            <div className="w-full h-2 bg-[rgba(255,255,255,0.03)] rounded-full"></div>
                            <div className="w-4/5 h-2 bg-[rgba(255,255,255,0.03)] rounded-full"></div>
                          </div>
                          <div className="flex gap-1.5 pt-1">
                            <div className="flex-1 h-6 bg-[rgba(255,255,255,0.03)] rounded border border-[rgba(255,255,255,0.06)]"></div>
                            <div className="flex-1 h-6 bg-[#E5E5E5] text-[#0A0A0A] rounded shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.06)] flex items-center justify-center">
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {component.name === "Table" && (
                      <div className="space-y-2">
                        <div className="text-[10px] font-semibold text-[#A1A1A1] uppercase tracking-wide">Table</div>
                        <div className="bg-[#141414] border border-[rgba(255,255,255,0.06)] rounded-lg overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                          <div className="flex gap-px bg-[#0A0A0A]">
                            <div className="flex-1 h-6 bg-[rgba(255,255,255,0.06)] flex items-center justify-center">
                              <div className="w-3/4 h-1.5 bg-[rgba(255,255,255,0.1)] rounded-full"></div>
                            </div>
                            <div className="flex-1 h-6 bg-[rgba(255,255,255,0.06)] flex items-center justify-center">
                              <div className="w-3/4 h-1.5 bg-[rgba(255,255,255,0.1)] rounded-full"></div>
                            </div>
                          </div>
                          <div className="flex gap-px">
                            <div className="flex-1 h-5 bg-[rgba(255,255,255,0.03)] flex items-center justify-center">
                              <div className="w-2/3 h-1.5 bg-[rgba(255,255,255,0.06)] rounded-full"></div>
                            </div>
                            <div className="flex-1 h-5 bg-[rgba(255,255,255,0.03)] flex items-center justify-center">
                              <div className="w-2/3 h-1.5 bg-[rgba(255,255,255,0.06)] rounded-full"></div>
                            </div>
                          </div>
                          <div className="flex gap-px">
                            <div className="flex-1 h-5 bg-[rgba(255,255,255,0.03)] flex items-center justify-center">
                              <div className="w-2/3 h-1.5 bg-[rgba(255,255,255,0.06)] rounded-full"></div>
                            </div>
                            <div className="flex-1 h-5 bg-[rgba(255,255,255,0.03)] flex items-center justify-center">
                              <div className="w-2/3 h-1.5 bg-[rgba(255,255,255,0.06)] rounded-full"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
              
              {/* CTA Section */}
              <div className="flex flex-col items-center gap-4 mt-8">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                  className="text-sm text-[#A1A1A1] text-center"
                >
                  Ready to create your own component library?
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                >
                  <SignInDialog
                    signInWithGoogle={signInWithGoogle}
                    trigger={
                      <Button size="lg" className="bg-[#E5E5E5] text-[#0A0A0A] hover:bg-[rgba(255,255,255,0.9)] shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all">
                        Generate Your UI Library
                        <ArrowRight className="size-4" />
                      </Button>
                    }
                  />
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export { Showcase };