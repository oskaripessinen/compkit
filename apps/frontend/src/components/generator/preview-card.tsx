import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LiveProvider, LivePreview, LiveError } from 'react-live';
import { Loader2, Codesandbox } from 'lucide-react';
import { useMemo } from 'react';
import { convertCodeToInline } from '@/utils/tailwind-converter';


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
  
  const previewCode = useMemo(() => {
    if (!displayCode) return null;
    return convertCodeToInline(displayCode);
  }, [displayCode]);
  
  const wrappedCode = previewCode 
    ? `${previewCode.trim()}`
    : null;
  console.log('Wrapped Code:', wrappedCode);
  return (
   <div className="flex flex-col rounded-2xl border border-border/50 bg-card shadow-lg shadow-black/10 h-full max-h-[550px] ring-1 ring-white/5">
      <div className="flex items-center justify-between border-b border-border px-5 h-15">
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
      <div className="flex-1 flex items-center rounded-2xl justify-center p-8 overflow-hidden">
        {wrappedCode ? (
          <LiveProvider code={wrappedCode} noInline={false}>
            <div className="w-full flex items-center justify-center min-h-full">
              <LivePreview  />
            </div>
            <LiveError className="mt-4 text-sm text-destructive" />
          </LiveProvider>
        ) : (
          <div className="flex items-center justify-center flex-col gap-3">
            <Loader2 size={24} className="animate-spin" />
            <p className="text-sm text-muted-foreground">Component preview will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};


export { PreviewCard };