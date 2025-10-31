import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";



const PromptSection = ({
  prompt,
  setPrompt,
  onGenerate,
  loading,
}: {
  prompt: string;
  setPrompt: (v: string) => void;
  onGenerate: () => void;
  loading: boolean;
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);

  return (
    <div className="rounded-2xl flex-1 border border-border shadow-lg shadow-black/10 ring-1 ring-white/5 bg-card p-6 backdrop-blur">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-foreground">Describe your component</h2>
        <p className="mt-1 text-xs text-muted-foreground">Type what you want to build and AI will generate it</p>
      </div>
      <textarea
        ref={textareaRef}
        placeholder="e.g. A modern pricing card with gradient border, icon, title, price, features list, and a primary button"
        className="min-h-20 max-h-[300px] w-full resize-none overflow-y-auto rounded-lg border border-border bg-background/80 p-4 shadow-md shadow-black/20 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{prompt.length} characters</span>
        <Button onClick={onGenerate} disabled={loading || !prompt.trim()} size="lg">
          {loading ? (
            <>
              <svg className="size-4 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Generating...
            </>
          ) : (
            <>Generate Component</>
          )}
        </Button>
      </div>
    </div>
  );
};


export { PromptSection };