import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/generator/header";
import { PromptSection } from "@/components/generator/prompt-section";
import { SettingsPanel } from "@/components/generator/settings-panel";
import { Footer } from "@/components/home/footer";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { generateComponent, type ApiError } from "@/api/client";

import { LiveProvider, LivePreview, LiveEditor, LiveError } from 'react-live';
import { themes } from 'prism-react-renderer';

const PreviewCard = ({ 
  generatedCode, 
  components, 
  selectedComponent, 
  setSelectedComponent 
}: { 
  generatedCode: string | null;
  components: Array<{ name: string; code: string }>;
  selectedComponent: number;
  setSelectedComponent: (index: number) => void;
}) => {
  const currentComponent = components[selectedComponent];
  const displayCode = currentComponent ? currentComponent.code : generatedCode;

  console.log(components);

  return (
    <div className="mx-6 flex flex-col rounded-lg border border-border bg-card shadow-sm xl:mx-0">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-2">
          <svg className="size-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span className="text-sm font-medium text-foreground">Preview</span>
        </div>
       {components.length > 1 && (
         <div className="flex gap-1">
           {components.map((comp, index) => (
             <Button
               key={index}
               variant={selectedComponent === index ? "default" : "outline"}
               size="sm"
               onClick={() => setSelectedComponent(index)}
               className="h-7 px-2 text-xs"
             >
               {comp.name}
             </Button>
           ))}
         </div>
       )}
        <Badge variant="secondary" className="text-xs">Live</Badge>
      </div>
      <div className="flex min-h-64 items-center justify-center p-8 bg-muted/30">
       {displayCode ? (
          <LiveProvider 
           code={displayCode}
            theme={themes.nightOwl}
            noInline={false}
          >
            <LivePreview />
            <LiveError className="mt-4 text-sm text-destructive" />
          </LiveProvider>
        ) : (
          <p className="text-sm text-muted-foreground">Component preview will appear here</p>
        )}
      </div>
    </div>
  );
};

const CodeCard = ({ generatedCode }: { generatedCode: string | null }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="mx-6 flex flex-col rounded-lg border border-border bg-card shadow-sm xl:mx-0">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-2">
          <svg className="size-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          <span className="text-sm font-medium text-foreground">Code</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          disabled={!generatedCode}
          className="h-7 px-2 text-xs"
        >
          {copied ? (
            <>
              <svg className="mr-1 size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg className="mr-1 size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </>
          )}
        </Button>
      </div>
      <div className="relative flex-1 overflow-hidden">
        {generatedCode ? (
          <LiveProvider code={generatedCode} theme={themes.nightOwl}>
            <LiveEditor className="overflow-auto p-4 font-mono text-sm" style={{ minHeight: '256px' }} />
          </LiveProvider>
        ) : (
          <div className="flex items-center justify-center p-8 min-h-64">
            <p className="text-sm text-muted-foreground">Generated code will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Generator = () => {
  const [loading, setLoading] = useState(false);
  const [framework, setFramework] = useState("react");
  const [language, setLanguage] = useState("ts");
  const [style, setStyle] = useState("tailwind");
  const [prompt, setPrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [components, setComponents] = useState<Array<{ name: string; code: string }>>([]);
  const [selectedComponent, setSelectedComponent] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user === null) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  const onGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await generateComponent(prompt);
      setGeneratedCode(response.code);
      setComponents(response.components || []);
      setSelectedComponent(0);
    } catch (err) {
      const error = err as ApiError;
      if (error?.statusCode !== undefined) {
        setError(error.message);
        console.error('API Error:', error.details);
      } else {
        setError('An unexpected error occurred');
        console.error('Error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-[1400px] pb-12 pt-24 lg:px-8">
        <div className="space-y-6">
          {error && (
            <div className="mx-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
              <div className="flex items-start gap-3">
                <svg className="size-5 text-destructive shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-destructive">Generation failed</h4>
                  <p className="mt-1 text-sm text-destructive/90">{error}</p>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="text-destructive hover:text-destructive/80 transition-colors"
                >
                  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-row gap-6">
            <SettingsPanel
              framework={framework}
              setFramework={setFramework}
              language={language}
              setLanguage={setLanguage}
              style={style}
              setStyle={setStyle}
            />
            <PromptSection
              prompt={prompt}
              setPrompt={setPrompt}
              onGenerate={onGenerate}
              loading={loading}
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
           <PreviewCard 
             generatedCode={generatedCode} 
             components={components}
             selectedComponent={selectedComponent}
             setSelectedComponent={setSelectedComponent}
           />
            <CodeCard generatedCode={generatedCode} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Generator;