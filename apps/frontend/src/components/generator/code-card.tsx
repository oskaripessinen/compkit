import { useState, useMemo } from "react";
import { Copy, CopyCheck, Code } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SandpackCodeEditor, SandpackProvider } from '@codesandbox/sandpack-react';


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

  const sandpackFiles = useMemo(() => {
    if (!displayCode) return null;
    
    return {
      "/App.tsx": {
        code: displayCode,
        active: true,
      },
    };
  }, [displayCode]);

  return (
    <div className="flex flex-col rounded-2xl border border-border/50 bg-card shadow-lg shadow-black/10 h-full max-h-[400px] ring-1 ring-white/5">
      <div className="flex items-center justify-between border-b border-border px-4 h-12 shrink-0">
        <div className="flex items-center gap-2 h-8">
          <Code className="size-5" stroke='#a4a4a4' />
          <span className="text-sm font-medium text-foreground">Code</span>
        </div>
        {displayCode && (
          <Button onClick={handleCopy} variant="ghost" size="icon" className="h-8 w-8" disabled={copied}>
            {copied ? <CopyCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto rounded-b-2xl min-h-0">
        {sandpackFiles ? (
          <SandpackProvider
            template="react-ts"
            files={sandpackFiles}
            theme={{
            colors: {
              surface1: "oklch(17.304% 0.00002 271.152)", // taustaväri
              surface2: "#161b22",
              surface3: "#21262d",
              clickable: "#58a6ff",
              base: "#c9d1d9",
            },
          }}
          >
            <SandpackCodeEditor
              showLineNumbers
              showInlineErrors
              wrapContent
              style={{ height: '100%', maxHeight: '100%', overflow: 'auto' }}
            />
          </SandpackProvider>
        ) : (
          <div className="flex items-center justify-center flex-col gap-3 h-full p-6">
            <p className="text-sm text-muted-foreground">Generated code will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export { CodeCard };