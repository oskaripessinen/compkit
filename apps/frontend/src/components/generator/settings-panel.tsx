import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const SettingsPanel = ({
  framework,
  setFramework,
  language,
  setLanguage,
  style,
  setStyle,
}: {
  framework: string;
  setFramework: (v: string) => void;
  language: string;
  setLanguage: (v: string) => void;
  style: string;
  setStyle: (v: string) => void;
}) => {
  return (
    <div className="rounded-2xl min-w-[300px] border border-border bg-card/70 p-6 backdrop-blur">
      <h3 className="mb-8 text-sm font-semibold text-foreground">Configuration</h3>
      <div className="space-y-4">
        <div>
          <Select value={framework} onValueChange={setFramework}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="react">React</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ts">TypeScript</SelectItem>
              <SelectItem value="js">JavaScript</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select value={style} onValueChange={setStyle}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tailwind">Tailwind</SelectItem>
              <SelectItem value="css">CSS</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};


export { SettingsPanel };