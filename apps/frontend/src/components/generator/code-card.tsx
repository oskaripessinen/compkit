import { useState } from "react";
import { LiveProvider, LiveEditor } from 'react-live';
import { Copy, CopyCheck, Loader2, Code } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { themes } from 'prism-react-renderer';

const customTheme = {
    ...themes.vsDark,
    plain: {
      ...themes.vsDark.plain,
      backgroundColor: 'oklch(17.304% 0.00002 271.152)',
      color: '#ffffff',
    },
  };

const CodeCard = ({ 
  generatedCode, 
  components, 
  selectedComponent 
}: { 
  generatedCode: string | null;
  components: Array<{ name: string; code: string }>;
  selectedComponent: number;
}) => {
  const currentComponent = components[selectedComponent];
  const displayCode = currentComponent ? currentComponent.code : generatedCode;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (displayCode) {
      navigator.clipboard.writeText(displayCode);
      setCopied(true);
      toast.success("Code copied to clipboard");
      setTimeout(() => setCopied(false), 4000);
    }
  };

  return (
   <div className="flex flex-col rounded-2xl border border-border/50 bg-card shadow-lg shadow-black/10 min-h-[500px] max-h-[500px] ring-1 ring-white/5">
      <div className="flex items-center justify-between border-b border-border px-5 h-15">
        <div className="flex items-center gap-2 h-8">
            <Code className="size-5" stroke='#a4a4a4' />
          <span className="text-sm font-medium text-foreground">Code</span>
        </div>
        {displayCode && (
        <Button onClick={handleCopy} variant="ghost" size="icon" className="h-8 w-8" disabled={copied}>
          {copied ? <CopyCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>)}
      </div>
      <div className="flex-1 overflow-hidden rounded-2xl bg-card">
        {displayCode ? (
          <LiveProvider code={displayCode} noInline={true} theme={customTheme}>
            <div className="h-full overflow-hidden">
              <LiveEditor 
                className="h-full flex bg-card p-4 overflow-auto font-mono text-sm leading-relaxed" 
              />
            </div>
          </LiveProvider>
        ) : (
          <div className="flex items-center justify-center flex-col gap-3 h-full">
            <Loader2 size={24} className="animate-spin" />
            <p className="text-sm text-muted-foreground">Generated code will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export { CodeCard };