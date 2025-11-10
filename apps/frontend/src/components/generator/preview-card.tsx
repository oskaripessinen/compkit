import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Codesandbox } from 'lucide-react';
import { useMemo } from 'react';
import { SandpackPreview, SandpackProvider } from '@codesandbox/sandpack-react';


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
  
  const sandpackFiles = useMemo(() => {
    if (!displayCode) return null;
    
    return {
      "/App.tsx": {
        code: displayCode,
      },
      "/index.tsx": {
        code: `import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

const root = createRoot(document.getElementById('root')!);
root.render(<App />);`,
      },
      "/styles.css": {
        code: `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}`,
      },
    };
  }, [displayCode]);

  return (
    <div className="flex flex-col rounded-2xl border border-border/50 bg-card shadow-lg shadow-black/10 h-full max-h-[60vh] md:max-h-[550px] ring-1 ring-white/5">
      <div className="flex items-center justify-between border-b border-border px-4 md:px-5 h-14">
        <div className="flex items-center gap-2">
          <Codesandbox className="size-5" stroke='#a4a4a4' />
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
      <div className="flex-1 rounded-b-2xl overflow-hidden">
        {sandpackFiles ? (
          <SandpackProvider
            template="react-ts"
            files={sandpackFiles}
            theme="dark"
            customSetup={{
              dependencies: {
                "tailwindcss": "latest",
              },
            }}
          >
            <SandpackPreview
              showOpenInCodeSandbox={false}
              showRefreshButton={false}
              style={{ height: '100%' }}
            />
          </SandpackProvider>
        ) : (
          <div className="flex items-center justify-center flex-col gap-3 h-full">
            <Loader2 size={24} className="animate-spin" />
            <p className="text-sm text-muted-foreground">Component preview will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};


export { PreviewCard };