import { Header } from "@/components/generator/header";
import { PromptSection } from "@/components/generator/prompt-section";
import { SettingsPanel } from "@/components/generator/settings-panel";
import { Footer } from "@/components/home/footer";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { generateComponent, type ApiError } from "@/api/client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { toast } from 'sonner';
import { LiveProvider, LivePreview, LiveEditor, LiveError } from 'react-live';
import { themes } from 'prism-react-renderer';
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { ButtonGroup } from "@/components/ui/button-group";
import { SendHorizontal, Package, Copy, CopyCheck } from 'lucide-react';




  const customTheme = {
    ...themes.vsDark,
    plain: {
      ...themes.vsDark.plain,
      backgroundColor: 'oklch(17.304% 0.00002 271.152)',
      color: '#ffffff',
    },
  };

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

  return (
   <div className="flex flex-col rounded-2xl border border-border/50 bg-card shadow-lg shadow-black/10 h-full max-h-[550px] ring-1 ring-white/5">
      <div className="flex items-center justify-between border-b border-border px-5 h-15">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="size-5" viewBox="0 0 24 24" fill="none" stroke='#a4a4a4' strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            <polyline points="7.5 4.21 12 6.81 16.5 4.21"/>
            <polyline points="7.5 19.79 7.5 14.6 3 12"/>
            <polyline points="21 12 16.5 14.6 16.5 19.79"/>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
            <line x1="12" x2="12" y1="22.08" y2="12"/>
          </svg>
          <span className="text-sm font-medium text-foreground">Preview</span>
        </div>
        {components.length > 1 && (
          <Select value={selectedComponent.toString()} onValueChange={(value) => setSelectedComponent(parseInt(value))}>
            <SelectTrigger className="h-8 text-sm border-0 hover:bg-accent/50 cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {components.map((comp, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {comp.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
      <div className="flex-1 flex items-center rounded-2xl justify-center bg-card p-8 overflow-hidden">
        {displayCode ? (
          <LiveProvider code={displayCode} noInline={false} theme={customTheme}>
            <div className="w-full flex items-center justify-center min-h-full">
              <LivePreview  />
            </div>
            <LiveError className="mt-4 text-sm text-destructive" />
          </LiveProvider>
        ) : (
          <div className="flex items-center justify-center flex-col gap-3">
            <p className="text-sm text-muted-foreground">Component preview will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
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
   <div className="flex flex-col rounded-2xl border border-border/50 bg-card shadow-lg shadow-black/10 h-full max-h-[550px] ring-1 ring-white/5">
      <div className="flex items-center justify-between border-b border-border px-5 h-15">
        <div className="flex items-center gap-2 h-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="size-5" viewBox="0 0 24 24" fill="none" stroke='#a4a4a4' strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m16 18 6-6-6-6"/>
            <path d="m8 6-6 6 6 6"/>
          </svg>
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
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-muted-foreground">Generated code will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Generator = () => {
  const [importLibraryId, setImportLibraryId] = useState("");
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

  const [conversationMode, setConversationMode] = useState(false);
  const [followupPrompt, setFollowupPrompt] = useState("");

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
      setConversationMode(true);
      setFollowupPrompt("");
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

  const handleSendFollowup = async () => {
    if (!followupPrompt.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await generateComponent(followupPrompt);
      setComponents((prev) => {
        const merged = [...prev];
        if (response.components && response.components.length) {
          merged.push(...response.components);
          setSelectedComponent(prev.length);
        } else if (response.code) {
          merged.push({ name: `Component${merged.length + 1}`, code: response.code });
          setSelectedComponent(prev.length);
        }
        return merged;
      });
      setFollowupPrompt("");
    } catch (err) {
      setError('Failed to generate follow-up component');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadLibrary = () => {
    if (!importLibraryId.trim()) return;
    window.open(`/api/libraries/${encodeURIComponent(importLibraryId)}/download`, "_blank");
  };

  const handleCopyInstallCmd = () => {
    if (!importLibraryId.trim()) return;
    navigator.clipboard.writeText(`npx compkit install ${importLibraryId}`);
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
    <div className="flex flex-col min-h-screen bg-background text-foreground relative bg-linear-gradient-to-b from-primary/5 via-background to-background">
      <Header />
      <main className="mx-auto min-h-screen w-full max-w-[1200px] px-4 lg:px-8 py-6 mt-16">
        {error && (
          <div className="mb-6 rounded-2xl border border-destructive/50 bg-destructive/10 p-4">
            <div className="flex items-start gap-3">
              <svg className="size-5 text-destructive shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-destructive">Generation failed</h4>
                <p className="mt-1 text-sm text-destructive/90">{error}</p>
              </div>
              <button onClick={() => setError(null)} className="text-destructive hover:text-destructive/80 transition-colors">
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        <div className={`transition-all duration-300 ease-in-out ${conversationMode ? 'opacity-0 -translate-y-4 h-0 overflow-hidden pointer-events-none' : 'opacity-100 translate-y-0 mb-6'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
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
        </div>

        {/* Import library button (appears after generation) */}
        {generatedCode && (
          <div className="flex justify-end mb-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Package className="size-4" />
                  Import Library
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Import library</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                  Enter the library ID to import. You can download the library or copy the install command.
                </DialogDescription>
                <div className="mt-4 flex flex-col gap-3">
                  <input
                    value={importLibraryId}
                    onChange={(e) => setImportLibraryId(e.target.value)}
                    placeholder="Library ID (e.g. awesome-ui-kit-a7f3)"
                    className="w-full rounded-md border border-border px-3 py-2 bg-background text-sm outline-none"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleDownloadLibrary} variant="default" size="sm" className="flex-1">
                      Download ZIP
                    </Button>
                    <Button onClick={handleCopyInstallCmd} variant="outline" size="sm" className="flex-1">
                      Copy install command
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Preview + Code (2-column grid with fixed height) */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-[600px]">
          <PreviewCard 
            generatedCode={generatedCode} 
            components={components}
            selectedComponent={selectedComponent}
            setSelectedComponent={setSelectedComponent}
          />
          <CodeCard 
            generatedCode={generatedCode}
            components={components}
            selectedComponent={selectedComponent}
          />
        </div>

        {/* Follow-up prompt input (bottom, expands when conversation mode active) */}
        <div className={`transition-all duration-300 ease-in-out ${conversationMode ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 h-0 overflow-hidden pointer-events-none'}`}>
          <div className="max-w-6xl mx-auto">
            <ButtonGroup className="w-full [--radius:1rem]">
              <ButtonGroup className="flex-1">
                <Input 
                  className="h-13 px-4 bg-card placeholder:text-muted-foreground/60 text-sm" 
                  value={followupPrompt} 
                  onChange={(e) => setFollowupPrompt(e.target.value)} 
                  placeholder="Modify the component or ask for variations..." 
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendFollowup();
                    }
                  }}
                />
              </ButtonGroup>
              <ButtonGroup>
                <Button 
                  size="icon" 
                  className="h-13 w-13"
                  onClick={handleSendFollowup} 
                  disabled={followupPrompt.trim() === "" || loading}
                >
                  <SendHorizontal className="size-5" />
                </Button>
              </ButtonGroup>
            </ButtonGroup>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Generator;