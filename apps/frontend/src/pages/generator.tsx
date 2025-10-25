import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/generator/header";
import { PromptSection } from "@/components/generator/prompt-section";
import { SettingsPanel } from "@/components/generator/settings-panel";
import { Footer } from "@/components/home/footer";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

import { LiveProvider, LivePreview, LiveEditor, LiveError } from 'react-live';
import { themes } from 'prism-react-renderer';

const PreviewCard = ({ generatedCode }: { generatedCode: string | null }) => {
  return (
    <div className="rounded-2xl border border-border bg-card/70 p-4 backdrop-blur h-full flex flex-col">
      <div className="mx-1 h-5 mb-6 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Preview</h3>
        <Badge variant="secondary" className="text-xs">Live</Badge>
      </div>
      <div className="flex-1 rounded-lg overflow-hidden border border-border/60 bg-background/70">
        {generatedCode ? (
          <LiveProvider code={generatedCode} theme={themes.vsDark}>
            <div className="h-[400px] p-4 overflow-auto justify-center items-center flex">
              <LivePreview />
              <LiveError className="text-red-500 text-xs mt-4" />
            </div>
          </LiveProvider>
        ) : (
          <div className="flex h-[400px] items-center justify-center">
            <div className="text-center">
              <div className="mb-3 inline-flex size-12 items-center justify-center rounded-full bg-muted">
                <svg className="size-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground">Waiting for generation</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CodeCard = ({ generatedCode }: { generatedCode: string | null }) => {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    if (!generatedCode) return;
    await navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const onDownload = () => {
    if (!generatedCode) return;
    const blob = new Blob([generatedCode], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Component.tsx";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-2xl border border-border bg-card/70 p-4 backdrop-blur h-full flex flex-col">
      <div className="mx-1 h-5 mb-6 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Code</h3>
        <div className="flex gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCopy}
            disabled={!generatedCode}
            className="h-8 px-3"
          >
            {copied ? (
              <>
                <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </>
            )}
          </Button>
          <Button size="sm" onClick={onDownload} disabled={!generatedCode} className="h-8 px-3">
            <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </Button>
        </div>
      </div>
      <div className="flex-1 rounded-lg border overflow-hidden border-border/60">
        {generatedCode ? (
          <LiveProvider code={generatedCode} theme={themes.vsDark} >
            <LiveEditor
              style={{ height: "100%", minHeight: "400px", maxHeight: "400px", overflow: "auto", fontSize: 14, scrollbarWidth: 'thin', scrollbarColor: 'rgba(255, 255, 255, 0.15) #1e1e1e' }}
              disabled
            />
          </LiveProvider>
        ) : (
          <div className="flex h-[400px] items-center justify-center bg-background/70">
            <p className="text-sm text-muted-foreground">No code generated yet</p>
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
  const user = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Ohjaa takaisin etusivulle jos ei kirjautunut
    if (user === null) {
      navigate('/');
    }
  }, [user, navigate]);

  const onGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      const code = `() => (
  <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
    <button
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '0.5rem',
        backgroundColor: '#2563eb',
        padding: '0.75rem 1.5rem',
        fontSize: '0.875rem',
        fontWeight: '500',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
        transition: 'background-color 0.2s',
      }}
      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
    >
      ${prompt || "Generated Component"}
    </button>
  </div>)`;
      setGeneratedCode(code);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-[1400px] pb-12 pt-24 lg:px-8">
        <div className="space-y-6">
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
            <PreviewCard generatedCode={generatedCode} />
            <CodeCard generatedCode={generatedCode} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Generator;