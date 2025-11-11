import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Codesandbox } from 'lucide-react';
import { useMemo } from 'react';


const PreviewCard = ({ 
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
  
  const previewHtml = useMemo(() => {
    if (!currentComponent) return null;
    
    // Transform JSX to createElement calls (simple regex-based transformation)
    const jsxCode = currentComponent.code
      .replace(/export\s+default\s+\w+;?\s*$/gm, '')
      .replace(/const\s+(\w+)\s*=\s*\(\s*\)\s*=>\s*\{?\s*return\s*\(/gm, 'function $1() { return (')
      .replace(/const\s+(\w+)\s*=\s*\(\s*\)\s*=>\s*/gm, 'function $1() { return ')
      .trim();

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { margin: 0; padding: 2rem; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: oklch(17.304% 0.00002 271.152); }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    ${jsxCode}
    
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(React.createElement(${currentComponent.name}));
  </script>
</body>
</html>`;
  }, [currentComponent]);

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
      <div className="flex-1 rounded-b-2xl overflow-hidden bg-card">
        {previewHtml ? (
          <iframe
            srcDoc={previewHtml}
            className="w-full h-full border-0 bg-card"
            sandbox="allow-scripts allow-same-origin"
            title="Component Preview"
            
          />
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