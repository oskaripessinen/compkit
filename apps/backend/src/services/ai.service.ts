import OpenAI from "openai";
import { config } from "../config/env";
import { COMPONENT_GENERATION_PROMPT, COMPONENT_MODIFICATION_PROMPT } from "../prompts/system-prompts";
import { ComponentLibraryService } from "./component-library.service";

export class AIService {
  private static client = new OpenAI({
    baseURL: config.openRouter.baseUrl,
    apiKey: config.openRouter.apiKey,
  });

  static async generateComponent(
    prompt: string,
    userId: string,
    libraryName?: string
  ): Promise<{
    code: string;
    library: any;
    components: any[];
  }> {
    if (!config.openRouter.apiKey) {
      throw new Error("OPENROUTER_API_KEY not configured");
    }

    try {
      const response = await this.client.chat.completions.create({
        model: config.openRouter.model,
        messages: [
          {
            role: "system",
            content: COMPONENT_GENERATION_PROMPT,
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

      const cleanedCode = this.cleanCode(generatedCode);

      // Split by "export default" — jokainen komponentti päättyy "export default ComponentName;"
      const componentBlocks = cleanedCode.split(/(?=const\s+\w+\s*=)/g)
        .map(block => block.trim())
        .filter(block => block.length > 0);
      
      const parsedComponents = componentBlocks.map(block => {
        // Varmista että block sisältää export default
        if (!block.includes('export default')) {
          const nameMatch = block.match(/const\s+(\w+)\s*=/);
          if (nameMatch) {
            const componentName = nameMatch[1];
            block = `${block}\n\nexport default ${componentName};`;
          }
        }
        
        // Ekstraoi nimi
        const nameMatch = block.match(/const\s+(\w+)\s*=/);
        const name = nameMatch ? nameMatch[1] : this.detectComponentType(block);
        
        return { name, code: block };
      });

      // Save to database and create library
      const { library, components } = await ComponentLibraryService.createLibraryFromGeneration(
        userId,
        prompt,
        cleanedCode,
        libraryName
      );

      return {
        code: cleanedCode,
        library,
        components: parsedComponents, // return parsed components from our parsing
      };
    } catch (error: any) {
      console.error("OpenRouter API Error:", error);
      throw new Error(error.message || "Failed to generate component");
    }
  }

  static async modifyComponent(
    currentCode: string,
    modificationRequest: string,
    userId?: string,
    componentId?: string
  ): Promise<string> {
    if (!config.openRouter.apiKey) {
      throw new Error("OPENROUTER_API_KEY not configured");
    }

    try {
      const response = await this.client.chat.completions.create({
        model: config.openRouter.model,
        messages: [
          {
            role: "system",
            content: COMPONENT_MODIFICATION_PROMPT,
          },
          {
            role: "user",
            content: `Current component:\n${currentCode}\n\nModification request: ${modificationRequest}`,
          },
        ],
        max_tokens: 2000,
        temperature: 0.3,
        top_p: 0.9,
      });

      const modifiedCode = response.choices[0]?.message?.content?.trim();

      if (!modifiedCode) {
        throw new Error("No modified code generated from AI");
      }

      const cleanedCode = this.cleanCode(modifiedCode);

      if (userId && componentId) {
        await ComponentLibraryService.updateComponent(userId, componentId, cleanedCode);
      }

      return cleanedCode;
    } catch (error: any) {
      console.error("OpenRouter API Error:", error);
      throw new Error(error.message || "Failed to modify component");
    }
  }

  private static cleanCode(code: string): string {
    let cleaned = code
      .replace(/<think>[\s\S]*?<\/think>/g, "")
      .replace(/```(?:jsx?|tsx?|javascript|typescript)?\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    // Wrappaa anonymous componentit
    cleaned = this.wrapAnonymousComponents(cleaned);

    return cleaned;
  }

  private static wrapAnonymousComponents(code: string): string {
    const anonymousArrowRegex = /^\s*\(\s*\)\s*=>\s*{/;
    const anonymousFunctionRegex = /^\s*function\s*\(/;
    
    if (anonymousArrowRegex.test(code) || anonymousFunctionRegex.test(code)) {
      const nameMatch = code.match(/\/\/\s*(\w+)/);
      const componentName = nameMatch ? nameMatch[1] : 'Component';
      
      return `const ${componentName} = ${code}\n\nexport default ${componentName};`;
    }
    
    if (!code.includes('export default')) {
      const nameMatch = code.match(/const\s+(\w+)\s*=/);
      if (nameMatch) {
        const componentName = nameMatch[1];
        return `${code}\n\nexport default ${componentName};`;
      }
    }
    
    return code;
  }

  static parseComponents(code: string): Array<{ name: string; code: string }> {
    const components: Array<{ name: string; code: string }> = [];
    
    const lines = code.split('\n');
    let currentComponent = '';
    let braceCount = 0;
    let inFunction = false;
    
    for (const line of lines) {
      if (line.trim().startsWith('() =>')) {
        if (currentComponent.trim() && inFunction) {
          const componentType = this.detectComponentType(currentComponent);
          components.push({ 
            name: componentType,
            code: currentComponent.trim() 
          });
        }
        currentComponent = line + '\n';
        inFunction = true;
        braceCount = 0;
      } else if (inFunction) {
        currentComponent += line + '\n';
      }
      
      if (inFunction) {
        for (const char of line) {
          if (char === '{') braceCount++;
          if (char === '}') braceCount--;
        }
        
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
    
    if (currentComponent.trim() && inFunction) {
      const componentType = this.detectComponentType(currentComponent);
      components.push({ 
        name: componentType,
        code: currentComponent.trim() 
      });
    }
    
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