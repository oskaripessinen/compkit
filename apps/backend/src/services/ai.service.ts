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
    css: string;
  }> {
    if (!config.openRouter.apiKey) {
      throw new Error("OPENROUTER_API_KEY not configured");
    }

    try {
      // Read base components
      const fs = require('fs').promises;
      const path = require('path');
      const basePath = path.join(__dirname, '../base');
      
      const [button, card, input, modal, table, css] = await Promise.all([
        fs.readFile(path.join(basePath, 'button.tsx'), 'utf-8'),
        fs.readFile(path.join(basePath, 'card.tsx'), 'utf-8'),
        fs.readFile(path.join(basePath, 'input.tsx'), 'utf-8'),
        fs.readFile(path.join(basePath, 'modal.tsx'), 'utf-8'),
        fs.readFile(path.join(basePath, 'table.tsx'), 'utf-8'),
        fs.readFile(path.join(basePath, 'index.css'), 'utf-8'),
      ]);

      const baseComponentsPrompt = `
BASE COMPONENTS TO MODIFY:

=== Button.tsx ===
${button}

=== Card.tsx ===
${card}

=== Input.tsx ===
${input}

=== Modal.tsx ===
${modal}

=== Table.tsx ===
${table}

=== index.css ===
${css}

USER STYLE REQUEST: ${prompt}

Modify the components and CSS to match the user's style request. Return as JSON with "components" and "css" keys.`;

      const response = await this.client.chat.completions.create({
        model: config.openRouter.model,
        messages: [
          {
            role: "system",
            content: COMPONENT_GENERATION_PROMPT,
          },
          {
            role: "user",
            content: baseComponentsPrompt,
          },
        ],
        max_tokens: 8000,
        temperature: 0.5,
        top_p: 0.9,
        response_format: { type: "json_object" },
      });

      const generatedContent = response.choices[0]?.message?.content?.trim();

      if (!generatedContent) {
        throw new Error("No code generated from AI");
      }

      const parsed = JSON.parse(generatedContent);
      const componentsObj = parsed.components;
      const modifiedCss = parsed.css;

      // Transform components object to array format
      const parsedComponents = Object.entries(componentsObj).map(([name, code]) => ({
        name,
        code: code as string,
      }));

      // Combine all component code for storage
      const allCode = parsedComponents.map(c => c.code).join('\n\n');
      const fullCode = `${modifiedCss}\n\n/* Components */\n\n${allCode}`;

      // Save to database and create library
      const { library, components: dbComponents } = await ComponentLibraryService.createLibraryFromGeneration(
        userId,
        prompt,
        fullCode,
        libraryName
      );

      return {
        code: fullCode,
        library,
        components: parsedComponents,
        css: modifiedCss,
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
  ): Promise<{
    code: string;
    components: any[];
    css: string;
  }> {
    if (!config.openRouter.apiKey) {
      throw new Error("OPENROUTER_API_KEY not configured");
    }

    try {
      // Read base CSS
      const fs = require('fs').promises;
      const path = require('path');
      const basePath = path.join(__dirname, '../base');
      const css = await fs.readFile(path.join(basePath, 'index.css'), 'utf-8');

      const response = await this.client.chat.completions.create({
        model: config.openRouter.model,
        messages: [
          {
            role: "system",
            content: COMPONENT_MODIFICATION_PROMPT,
          },
          {
            role: "user",
            content: `Current component:\n${currentCode}\n\nCurrent CSS:\n${css}\n\nModification request: ${modificationRequest}\n\nReturn as JSON with "component" and "css" keys.`,
          },
        ],
        max_tokens: 2000,
        temperature: 0.3,
        top_p: 0.9,
        response_format: { type: "json_object" },
      });

      const modifiedContent = response.choices[0]?.message?.content?.trim();

      if (!modifiedContent) {
        throw new Error("No modified code generated from AI");
      }

      const parsed = JSON.parse(modifiedContent);
      const cleanedCode = this.cleanCode(parsed.component || modifiedContent);
      const modifiedCss = parsed.css || css;

      if (userId && componentId) {
        await ComponentLibraryService.updateComponent(userId, componentId, cleanedCode);
      }

      const components = this.parseComponents(cleanedCode);

      return {
        code: cleanedCode,
        components,
        css: modifiedCss,
      };
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
    if (lowerCode.includes('modal') || lowerCode.includes('dialog')) return 'Modal';
    if (lowerCode.includes('<span') && lowerCode.includes('badge')) return 'Badge';
    if (lowerCode.includes('card') || (lowerCode.includes('<div') && lowerCode.includes('rounded'))) return 'Card';
    
    return 'Component';
  }
}