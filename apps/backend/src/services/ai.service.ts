import OpenAI from "openai";
import { config } from "../config/env";

export class AIService {
  private static client = new OpenAI({
    baseURL: config.openRouter.baseUrl,
    apiKey: config.openRouter.apiKey,
  });

  private static readonly SYSTEM_PROMPT = `You are an expert React component generator specialized in creating modern, production-ready UI components with Tailwind CSS.

CRITICAL REQUIREMENTS:
- Return ONLY valid JSX code - NO thinking tags, NO explanations, NO markdown
- Generate separate anonymous arrow functions for EACH component
- Each component must be on its own line, separated by blank lines
- DO NOT wrap multiple elements in a parent div
- NO <think> tags, NO reasoning, NO comments
- Each component must be an anonymous arrow function
- Format: () => { return (<element>...</element>) }
- Use Tailwind CSS classes for styling
- Use semantic HTML and ARIA attributes

CORRECT FORMAT FOR MULTIPLE COMPONENTS:

User: "red button, blue card, green badge"
Response:
() => {
  return (
    <button className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-red-600 text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 transition-colors">
      Button
    </button>
  )
}

() => {
  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
      <h3 className="text-xl font-semibold text-blue-900 mb-2">Card Title</h3>
      <p className="text-blue-700">Card content</p>
    </div>
  )
}

() => {
  return (
    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
      Badge
    </span>
  )
}

WRONG EXAMPLES (DO NOT DO THIS):

❌ Multiple elements in wrapper:
() => {
  return (
    <div className="space-y-4">
      <button>...</button>
      <div>...</div>
      <span>...</span>
    </div>
  )
}

❌ Thinking tags:
<think>The user wants a button...</think>
() => { return (...) }

❌ Named exports:
export const Button = () => { return (...) }

COMPONENT PATTERNS:

BUTTON - Interactive element
() => {
  return (
    <button className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 transition-colors">
      Click me
    </button>
  )
}

INPUT - Input field
() => {
  return (
    <input 
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50" 
      placeholder="Type here..."
    />
  )
}

CARD - Container with content
() => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      <h3 className="text-xl font-semibold mb-2">Title</h3>
      <p className="text-muted-foreground">Description text</p>
    </div>
  )
}

BADGE - Label element
() => {
  return (
    <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
      Badge
    </span>
  )
}

TEXTAREA - Multi-line input
() => {
  return (
    <textarea 
      className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50" 
      placeholder="Type here..."
    />
  )
}

MODAL - Overlay with dialog
() => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg border bg-background p-6 shadow-lg">
        <h2 className="text-lg font-semibold mb-2">Modal Title</h2>
        <p className="text-sm text-muted-foreground mb-4">Modal content</p>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">Close</button>
      </div>
    </div>
  )
}

NAVBAR - Header element
() => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between px-4">
        <span className="font-bold text-lg">Logo</span>
        <nav className="flex gap-6">
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Home</a>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">About</a>
        </nav>
      </div>
    </header>
  )
}

TAILWIND TOKENS:
- Colors: bg-background, bg-card, bg-primary, bg-secondary, bg-muted, bg-accent, bg-destructive
- Text: text-foreground, text-muted-foreground, text-primary
- Borders: border-border, border-input
- Always include hover:, focus-visible:, disabled: states
- Use transition-colors for smooth effects

REMEMBER: 
- Separate EACH component with a blank line
- Each component is its own () => { return (...) } function
- DO NOT include <think>, explanations, or wrapper divs`;

  static async generateComponent(prompt: string): Promise<string> {
    if (!config.openRouter.apiKey) {
      throw new Error("OPENROUTER_API_KEY not configured");
    }

    try {
      const response = await this.client.chat.completions.create({
        model: config.openRouter.model,
        messages: [
          {
            role: "system",
            content: this.SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 3000,
        temperature: 0.5,
        top_p: 0.9,
      });

      const generatedCode = response.choices[0]?.message?.content?.trim();

      if (!generatedCode) {
        throw new Error("No code generated from AI");
      }

      return this.cleanCode(generatedCode);
    } catch (error: any) {
      console.error("OpenRouter API Error:", error);
      throw new Error(error.message || "Failed to generate component");
    }
  }

  private static cleanCode(code: string): string {
    let cleaned = code
      // Remove thinking tags
      .replace(/<think>[\s\S]*?<\/think>/g, "")
      // Remove markdown code blocks
      .replace(/```(?:jsx?|tsx?|javascript|typescript)?\n?/g, "")
      .replace(/```\n?/g, "")
      // Remove comments
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/.*/g, "")
      // Remove any explanatory text before the function
      .replace(/^.*?(?=\(\s*\)\s*=>)/s, "")
      // Remove leading/trailing whitespace
      .trim();

    // Remove any export statements if present
    cleaned = cleaned.replace(/^export\s+(const\s+\w+\s*=\s*)?/gm, "");

    return cleaned;
  }

  static parseComponents(code: string): Array<{ name: string; code: string }> {
    const components: Array<{ name: string; code: string }> = [];
    
    // Split by arrow function pattern (looking for () => at the start of a line)
    const lines = code.split('\n');
    let currentComponent = '';
    let braceCount = 0;
    let inFunction = false;
    
    for (const line of lines) {
      // Check if this line starts a new function
      if (line.trim().startsWith('() =>')) {
        // If we were building a component, save it
        if (currentComponent.trim() && inFunction) {
          const componentType = this.detectComponentType(currentComponent);
          components.push({ 
            name: componentType,
            code: currentComponent.trim() 
          });
        }
        // Start new component
        currentComponent = line + '\n';
        inFunction = true;
        braceCount = 0;
      } else if (inFunction) {
        currentComponent += line + '\n';
      }
      
      // Count braces to know when component ends
      if (inFunction) {
        for (const char of line) {
          if (char === '{') braceCount++;
          if (char === '}') braceCount--;
        }
        
        // If braces are balanced and we hit a closing brace, component is complete
        if (braceCount === 0 && line.includes('}')) {
          const componentType = this.detectComponentType(currentComponent);
          components.push({ 
            name: componentType,
            code: currentComponent.trim() 
          });
          currentComponent = '';
          inFunction = false;
        }
      }
    }
    
    // Save last component if exists
    if (currentComponent.trim() && inFunction) {
      const componentType = this.detectComponentType(currentComponent);
      components.push({ 
        name: componentType,
        code: currentComponent.trim() 
      });
    }
    
    // If no components found, return the whole code as one component
    if (components.length === 0) {
      const componentType = this.detectComponentType(code);
      components.push({ name: componentType, code: code.trim() });
    }
    
    return components;
  }

  private static detectComponentType(code: string): string {
    const lowerCode = code.toLowerCase();
    
    if (lowerCode.includes('<button')) return 'Button';
    if (lowerCode.includes('<input')) return 'Input';
    if (lowerCode.includes('<textarea')) return 'Textarea';
    if (lowerCode.includes('<header') || lowerCode.includes('<nav')) return 'Navbar';
    if (lowerCode.includes('modal') || lowerCode.includes('dialog')) return 'Modal';
    if (lowerCode.includes('<span') && lowerCode.includes('badge')) return 'Badge';
    if (lowerCode.includes('card') || (lowerCode.includes('<div') && lowerCode.includes('rounded'))) return 'Card';
    
    return 'Component';
  }
}