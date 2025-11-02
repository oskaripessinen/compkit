import { Header } from "@/components/generator/header";
import { useAuth } from "@/hooks/useAuth";
import { generateComponent, modifyComponent, type ApiError } from "@/api/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { ButtonGroup } from "@/components/ui/button-group";
import Layout from "../components/layout/Layout";
import { SendHorizontal, Package, Plus, Loader2, Paperclip, LayoutTemplate } from 'lucide-react';
import { PreviewCard } from "@/components/generator/preview-card";
import { CodeCard } from "@/components/generator/code-card";
import { useGeneratorState } from "@/hooks/sessionStorage";
import { presetOptions, componentOptions, colorOptions } from "@/assets/presetOptions";

const Generator = () => {
  const [importLibraryId, setImportLibraryId] = useState("");
  const [loading, setLoading] = useState(false);
  const [followupPrompt, setFollowupPrompt] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  const {
    prompt,
    setPrompt,
    generatedCode,
    setGeneratedCode,
    components,
    setComponents,
    selectedComponent,
    setSelectedComponent,
    conversationMode,
    setConversationMode,
  } = useGeneratorState();

  const { user, loading: authLoading } = useAuth();

  const [error, setError] = useState<string | null>(null);
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);

  const [templateMode, setTemplateMode] = useState<'preset' | 'manual'>('preset');
  const [selectedPreset, setSelectedPreset] = useState<string>('core');
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>('blue');

  const toggleComponent = (id: string) => {
    setSelectedComponents(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleInsertTemplate = () => {
    let componentsToUse: string[];
    
    if (templateMode === 'preset') {
      const preset = presetOptions.find(p => p.id === selectedPreset);
      componentsToUse = preset?.components || [];
    } else {
      componentsToUse = selectedComponents;
    }

    if (componentsToUse.length === 0) {
      setError('Please select at least one component');
      return;
    }

    const comps = componentsToUse.join(', ');
    const prompt = `Create ${comps} components with Tailwind CSS using ${selectedColor} color theme. Make them modern, accessible and responsive.`;
    setPrompt(prompt);
    setConversationMode(false);
    setIsTemplateOpen(false);
  };

  const onGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setConversationMode(true);
    setError(null);
    
    try {
      const response = await generateComponent(prompt);
      setGeneratedCode(response.code);
      setComponents(response.components || []);
      setSelectedComponent(0);
      setFollowupPrompt("");
    } catch (err) {
      setConversationMode(false);
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
     // Get current selected component
     const currentComponent = components[selectedComponent];
     
     if (!currentComponent) {
       setError('No component selected to modify');
       return;
     }
     
     // Use modify API
     const response = await modifyComponent(currentComponent.code, followupPrompt);
     
     // Replace the selected component with modified version
     const modifiedComponents = [...components];
     modifiedComponents[selectedComponent] = response.components[0] || {
       name: currentComponent.name,
       code: response.code
     };
     
     setComponents(modifiedComponents);
      
      setGeneratedCode(response.code);
      setFollowupPrompt("");
    } catch (err) {
      setError('Failed to modify component');
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

  const handleCopyGeneratedCode = async () => {
    if (!generatedCode || !generatedCode.trim()) {
      setError('No generated code to copy');
      return;
    }
    try {
      await navigator.clipboard.writeText(generatedCode);
    } catch (err) {
      setError('Failed to copy generated code');
      console.error(err);
    }
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files ? Array.from(e.target.files) : [];
    setFiles(selected);
    // TODO: process files (upload / attach to conversation / preview)
    console.log("Selected files:", selected);
  };

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
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
    <div className="flex flex-col min-h-screen text-foreground relative bg-linear-to-b from-background to-black/10">
      <Header />
      
      <Layout>
      <main className="mx-auto w-full max-w-[1200px] px-4 lg:px-8 mt-20 items-center justify-center flex-1 relative">

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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
        )}

          <div className={`flex flex-col transition-all duration-700 ease-in-out ${
            conversationMode 
              ? 'translate-y-0 opacity-100' 
              : '-translate-y-full opacity-0 pointer-events-none absolute'
          }`}>
            <div className="flex justify-end mb-5">
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
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-[500px]">
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
          </div>

        <div className={`absolute top-[30vh] left-0 right-0 transition-all duration-700 ease-in-out ${
          conversationMode 
            ? 'translate-y-[320px]' 
            : 'translate-y-0'
        }`}>
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col gap-10 items-center justify-center">
            <div className={`transition-all duration-500 ${
              conversationMode 
                ? 'opacity-0 h-0 overflow-hidden' 
                : 'opacity-100'
            }`}>
              <span className={`text-3xl font-sans transition-all duration-500`}>Explain your idea</span>
            </div>
            <ButtonGroup className={`[--radius:1rem] justify-center ${conversationMode ? 'w-5xl' : 'w-3xl'} transition-all duration-500`}>
              <ButtonGroup className="flex-1">
                <div className="bg-card rounded-l-2xl flex items-center justify-center px-2 border-r-0 border border-border">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size='icon' variant="ghost" className="p-2">
                        <Plus className="size-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                      <DropdownMenuItem className="cursor-pointer" onClick={() => document.getElementById('file-input')?.click()}>
                        <Paperclip className="-rotate-45" />
                        <span className="font-sans text-[13px]">Add files</span>
     
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="mx-1"/>

                      <DropdownMenuItem className="cursor-pointer" onClick={() => setIsTemplateOpen(true)}>
                        <LayoutTemplate strokeWidth={2.2} className="" />
                        <span className="font-sans text-[13px]">Template</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Input
                  className="h-13 px-0 bg-card placeholder:text-muted-foreground/60 text-sm"
                  value={conversationMode ? followupPrompt : prompt} 
                  onChange={(e) => conversationMode ? setFollowupPrompt(e.target.value) : setPrompt(e.target.value)} 
                  placeholder={conversationMode ? "Modify the component or ask for variations..." : "Describe the component you want to generate..."}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                     if (conversationMode) {
                       handleSendFollowup();
                     } else {
                       onGenerate();
                     }
                    }
                  }}
                />
              </ButtonGroup>
              <ButtonGroup>
                <Button 
                  size="icon" 
                  className="h-13 w-13"
                  onClick={conversationMode ? handleSendFollowup : onGenerate} 
                  disabled={loading || (conversationMode ? !followupPrompt.trim() : !prompt.trim())}
                >
                  {loading ? <Loader2 className="size-5 animate-spin" /> : <SendHorizontal className="size-5" />}
                </Button>
              </ButtonGroup>
            </ButtonGroup>
          </div>
          </div>
        </div>
      </main>
      </Layout>   
      <input
        ref={fileInputRef}
        id="file-input"
        type="file"
        multiple
        className="hidden"
        onChange={handleFiles}
      />

      <Dialog open={isTemplateOpen} onOpenChange={setIsTemplateOpen}>
        <DialogContent className={`shadow-xl border border-border/50 max-w-lg ${templateMode == 'preset' ? 'h-[625px]' : ' h-[500px]'} transition-height duration-300 overflow-y-hidden`}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LayoutTemplate strokeWidth={1.75} className="size-6" />
              Template
            </DialogTitle>
            <DialogDescription>Choose a preset or select components manually</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2 p-1 bg-muted rounded-lg">
              <button
                onClick={() => setTemplateMode('preset')}
                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  templateMode === 'preset' 
                    ? 'bg-background shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Preset
              </button>
              <button
                onClick={() => setTemplateMode('manual')}
                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  templateMode === 'manual' 
                    ? 'bg-background shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Manual
              </button>
            </div>

            {templateMode === 'preset' && (
              <div className="animate-in fade-in duration-500">
                <h4 className="text-sm font-medium mb-2">Component Set</h4>
                <div className="grid gap-2">
                  {presetOptions.map(preset => (
                    <button
                      key={preset.id}
                      onClick={() => setSelectedPreset(preset.id)}
                      className={`text-left p-3 rounded-md border transition-all ${
                        selectedPreset === preset.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:bg-accent/30'
                      }`}
                    >
                      <div className="font-medium text-sm">{preset.label}</div>
                      <div className="text-xs text-muted-foreground mt-1">{preset.description}</div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {preset.components.map(comp => (
                          <span key={comp} className="text-[11px] bg-muted px-2 py-0.5 rounded-xl">
                            {comp}
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {templateMode === 'manual' && (
              <div className="animate-in fade-in duration-500">
                <h4 className="text-sm font-medium mb-2">Select Components</h4>
                <div className="grid grid-cols-2 gap-2">
                  {componentOptions.map(opt => (
                    <label 
                      key={opt.id} 
                      className="flex items-center gap-2 cursor-pointer rounded-md border border-border p-2 hover:bg-accent/30 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedComponents.includes(opt.id)}
                        onChange={() => toggleComponent(opt.id)}
                        className="rounded"
                      />
                      <span className="text-sm">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="text-sm font-medium mb-2">Color</h4>
              <div className="flex gap-2">
                {colorOptions.map(color => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color.id)}
                    className={`px-4 py-2 rounded-md border text-sm transition-all ${
                      selectedColor === color.id 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:bg-accent/30'
                    }`}
                  >
                    {color.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button size="sm" onClick={handleInsertTemplate}>
                Insert
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Generator;