import OpenAI from "openai";
import { config } from "../config/env";
import { COMPONENT_GENERATION_PROMPT, COMPONENT_MODIFICATION_PROMPT } from "../prompts/system-prompts";
import { ComponentLibraryService } from "./component-library.service";

export class AIService {
  private static client = new OpenAI({
    baseURL: config.openRouter.baseUrl,
    apiKey: config.openRouter.apiKey,
    timeout: 300000, // 5 minutes timeout for long-running AI requests
    maxRetries: 2,
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

    if (!config.openRouter.model) {
      throw new Error("OPENROUTER_MODEL not configured");
    }

    console.log('Generating component with model:', config.openRouter.model, 'API key present:', !!config.openRouter.apiKey);

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

Modify the components and CSS to match the user's style request. Return as JSON with "components" and "css" keys. Be concise but complete.`;

      // Try with JSON format first, fallback to regular if model doesn't support it
      console.log('AI: Starting API request...', { model: config.openRouter.model, promptLength: prompt.length });
      const startTime = Date.now();
      let response;
      try {
        response = await this.client.chat.completions.create({
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
          max_tokens: 30000,
          temperature: 0, // Deterministic output for code generation
          top_p: 1,
          response_format: { type: "json_object" },
        });
      } catch (error: any) {
        // If JSON format is not supported, try without it
        if (error.message?.includes('json') || error.message?.includes('response_format')) {
          console.warn('Model may not support JSON format, trying without it...');
          response = await this.client.chat.completions.create({
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
            temperature: 0,
            top_p: 1,
          });
        } else {
          throw error;
        }
      }

      const elapsedTime = Date.now() - startTime;
      console.log(`AI: API request completed in ${elapsedTime}ms`);

      // Check response structure
      if (!response.choices || response.choices.length === 0) {
        console.error('AI Response: No choices in response', JSON.stringify(response, null, 2));
        throw new Error("AI returned no choices");
      }

      const choice = response.choices[0];
      const finishReason = choice.finish_reason;
      
      if (finishReason !== 'stop' && finishReason !== null) {
        console.warn('AI Response: Unexpected finish reason', { finishReason, message: choice.message });
      }

      let generatedContent = choice.message?.content?.trim();

      if (!generatedContent) {
        console.error('AI Response: Empty content', {
          finishReason,
          response: JSON.stringify(response, null, 2),
          choice: JSON.stringify(choice, null, 2)
        });
        throw new Error(`No code generated from AI. Finish reason: ${finishReason || 'unknown'}`);
      }

      // Clean up markdown code blocks if present (sometimes AI adds them despite json_mode)
      generatedContent = generatedContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');


      let parsed;
      try {
        parsed = JSON.parse(generatedContent);
      } catch (error) {
        console.error('Failed to parse JSON from AI:', error);
        console.log('Raw content:', generatedContent);
        // Try to salvage partial JSON if possible or throw cleaner error
        throw new Error('Failed to generate valid JSON response from AI');
      }
      const componentsObj = parsed.components;
      const modifiedCss = parsed.css;

      // Transform components object to array format
      // Keep components exactly as AI generated them - don't modify unnecessarily
      const parsedComponents = Object.entries(componentsObj).map(([name, code]) => ({
        name,
        code: code as string, // Use code exactly as AI provided it
      }));

      // Combine all component code for storage
      const allCode = parsedComponents.map(c => c.code).join('\n\n');
      const fullCode = `${modifiedCss}\n\n/* Components */\n\n${allCode}`;

      // Save to database and create library
      // Pass pre-parsed components directly to avoid re-parsing which can break them
      const { library, components: dbComponents } = await ComponentLibraryService.createLibraryFromGeneration(
        userId,
        prompt,
        fullCode,
        libraryName,
        modifiedCss,
        parsedComponents // Pass pre-parsed components directly
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

    // Remove CSS from the beginning (before imports/components)
    const importIndex = cleaned.indexOf('import');
    if (importIndex > 0) {
      const beforeImport = cleaned.substring(0, importIndex);
      // Check if it looks like CSS (contains { and } but no imports)
      if (beforeImport.includes('{') && beforeImport.includes('}') &&
          !beforeImport.includes('import') && !beforeImport.includes('const') &&
          !beforeImport.includes('function') && !beforeImport.includes('export')) {
        cleaned = cleaned.substring(importIndex);
      }
    }

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
    // Remove CSS from the beginning before parsing components
    const importIndex = code.indexOf('import');
    let codeToParse = code;
    if (importIndex > 0) {
      const beforeImport = code.substring(0, importIndex);
      // Check if it looks like CSS
      if (beforeImport.includes('{') && beforeImport.includes('}') &&
          !beforeImport.includes('import') && !beforeImport.includes('const') &&
          !beforeImport.includes('function') && !beforeImport.includes('export')) {
        codeToParse = code.substring(importIndex);
      }
    }

    // Split components by looking for function/const declarations followed by export statements
    const components: Array<{ name: string; code: string }> = [];
    const lines = codeToParse.split('\n');
    let currentComponent = '';
    let componentName = '';
    let braceCount = 0;
    let inComponent = false;
    // Track if we have seen exports for the current component
    let hasExport = false;
    let componentBuffer = '';
    let importsBuffer = '';
    
    // Extract common imports first
    const importRegex = /import\s+[\s\S]*?;/g;
    const imports = codeToParse.match(importRegex) || [];
    const commonImports = imports.join('\n');

    // Helper function to detect component type
    const getComponentType = (name: string, code: string): string => {
        const lowerCode = code.toLowerCase();
        if (lowerCode.includes('dialog') || name.includes('Dialog')) return 'Modal';
        if (lowerCode.includes('button') || name.includes('Button')) return 'Button';
        if (lowerCode.includes('card') || name.includes('Card')) return 'Card';
        if (lowerCode.includes('input') || name.includes('Input')) return 'Input';
        if (lowerCode.includes('table') || name.includes('Table')) return 'Table';
        return name;
    };

    // Split by export statements which is the most reliable way for these generated files
    // They usually follow the pattern: 
    // ... code ...
    // export { Component, ... }
    
    // However, the file structure seems to be:
    // IMPORTS
    // COMPONENT 1
    // COMPONENT 2
    // ...
    // EXPORT { ... }
    
    // So we need to parse the file top-down and identify function blocks.
    
    const functionRegex = /function\s+([A-Z]\w+)\s*\(\{[\s\S]*?\)\s*\{[\s\S]*?\n\}/g;
    // This regex is too simple for nested braces. Let's use a block parser.
    
    let cursor = 0;
    // Skip imports area
    const lastImport = codeToParse.lastIndexOf('import');
    if (lastImport !== -1) {
        const importEnd = codeToParse.indexOf(';', lastImport);
        if (importEnd !== -1) cursor = importEnd + 1;
    }
    
    // If we have a big export statement at the end, we should use that to identify components
    // But the issue is splitting the code.
    
    // Strategy:
    // 1. Identify all top-level function/const declarations that look like components (Start with Uppercase)
    // 2. Extract their full code block
    // 3. Combine with imports and create a component entry
    
    const componentStarts: { index: number; name: string }[] = [];
    const lines2 = codeToParse.split('\n');
    let braceDepth = 0;
    
    for (let i = 0; i < lines2.length; i++) {
        const line = lines2[i].trim();
        
        // Only look for component starts at top level (braceDepth === 0)
        if (braceDepth === 0) {
            // Detect component start
            const funcMatch = line.match(/^function\s+([A-Z]\w+)\s*\(/);
            const constMatch = line.match(/^const\s+([A-Z]\w+)\s*=\s*(\(|React\.forwardRef)/);
            // Also handle export function/const
            const exportFuncMatch = line.match(/^export\s+function\s+([A-Z]\w+)\s*\(/);
            const exportConstMatch = line.match(/^export\s+const\s+([A-Z]\w+)\s*=\s*(\(|React\.forwardRef)/);
            
            if (funcMatch || constMatch || exportFuncMatch || exportConstMatch) {
                 const name = (funcMatch || exportFuncMatch) ? (funcMatch || exportFuncMatch)![1] : (constMatch || exportConstMatch)![1];
                 componentStarts.push({ index: i, name });
            }
        }

        // Update brace depth
        for (const char of line) {
            if (char === '{') braceDepth++;
            if (char === '}') braceDepth--;
        }
    }
    
    if (componentStarts.length > 0) {
        for (let i = 0; i < componentStarts.length; i++) {
            const start = componentStarts[i];
            const endLineIndex = (i < componentStarts.length - 1) ? componentStarts[i+1].index : lines2.length;
            
            // Get code lines for this component
            let componentCodeLines = lines2.slice(start.index, endLineIndex);
            
            // Remove trailing exports from the last component if present
            if (i === componentStarts.length - 1) {
                const lastExportIndex = componentCodeLines.findIndex(l => l.trim().startsWith('export {'));
                if (lastExportIndex !== -1) {
                    componentCodeLines = componentCodeLines.slice(0, lastExportIndex);
                }
            }
            
            const componentCode = componentCodeLines.join('\n').trim();
            
            // Determine category/type
            let type = getComponentType(start.name, componentCode);

            // Special handling for Variants and related helper components
            // If a component is named "buttonVariants", it should belong to "Button"
            if (start.name.toLowerCase().includes('variants')) {
                const baseName = start.name.replace(/variants/i, '');
                if (baseName) {
                     type = getComponentType(baseName.charAt(0).toUpperCase() + baseName.slice(1), componentCode);
                }
            }
            
            // We need to make sure we export it so the preview can find it
            const codeWithExport = `${commonImports}\n\n${componentCode}\n\nexport { ${start.name} };`;
            
            components.push({
                name: type, // Use parsed type (Modal, Button, etc) as name for the tab
                // @ts-ignore
                originalName: start.name,
                code: codeWithExport
            });
        }
    }
    
    // If the intelligent parsing found nothing, use the old method
    if (components.length === 0) {
       // ... (keep existing fallback or improved logic)
    }
    
    // Group components by type
    const groupedComponents: Record<string, { name: string, code: string }[]> = {};
    
    components.forEach(comp => {
        // Ensure we use the cleaned up type mapping
        let type = comp.name; // This is already the type from getComponentType
        
        if (!groupedComponents[type]) {
            groupedComponents[type] = [];
        }
        // We store the original component info here, but 'code' in 'comp' already has exports/imports which we might want to strip for grouping
        // Actually, for grouping, we want to reconstruct the file from the raw chunks we extracted.
        
        // Let's find the raw chunk again from componentStarts
        // This is getting complicated. Let's simplify:
        // We just need to group the *names* that belong to the same type, and then reconstruct the file content.
        
        // Let's use the originalName we added
        // @ts-ignore
        const originalName = comp.originalName || comp.name;
         
        groupedComponents[type].push({
             name: originalName,
             code: comp.code // This has imports/exports, we'll strip them when merging
        });
    });
    
    const finalComponents: Array<{ name: string; code: string }> = [];
    
    Object.keys(groupedComponents).forEach(type => {
        const comps = groupedComponents[type];
        
        // If it's a single component and not a Variant helper, just use it as is
        if (comps.length === 1) {
             // But wait, the current code in 'comps[0].code' has "export { Name }" at the end.
             // If we want to keep it clean, maybe that's fine.
             finalComponents.push({
                 name: type,
                 code: comps[0].code
             });
             return;
        }

        // Merge multiple components (e.g. Button + buttonVariants)
        let mergedCode = commonImports + '\n\n';
        const exportNames: string[] = [];
        
        comps.forEach(comp => {
            exportNames.push(comp.name);
            
            // Extract the body without imports and the synthetic export we added
            // The synthetic export is at the end: export { Name };
            let body = comp.code.replace(commonImports, '').trim();
            body = body.replace(new RegExp(`export\\s*{\\s*${comp.name}\\s*};?$`), '').trim();
            
            mergedCode += body + '\n\n';
        });
        
        mergedCode += `export {\n  ${exportNames.join(',\n  ')}\n}`;
        
        finalComponents.push({
            name: type,
            code: mergedCode
        });
    });

    return finalComponents;

    return components.filter(comp => comp.code.length > 0);
    
    if (components.length === 0) {
      const componentType = this.detectComponentType(code);
      components.push({ name: componentType, code: code.trim() });
    }
    
    return components;
  }

  private static detectComponentType(code: string): string {
    const lowerCode = code.toLowerCase();

    // Try to extract component name from const/function declaration
    const constMatch = code.match(/const\s+(\w+)\s*=/);
    if (constMatch) return constMatch[1];

    const functionMatch = code.match(/function\s+(\w+)\s*\(/);
    if (functionMatch) return functionMatch[1];

    // Fallback to HTML element detection
    if (lowerCode.includes('<button')) return 'Button';
    if (lowerCode.includes('<input')) return 'Input';
    if (lowerCode.includes('<textarea')) return 'Textarea';
    if (lowerCode.includes('modal') || lowerCode.includes('dialog')) return 'Modal';
    if (lowerCode.includes('<span') && lowerCode.includes('badge')) return 'Badge';
    if (lowerCode.includes('card') || (lowerCode.includes('<div') && lowerCode.includes('rounded'))) return 'Card';
    if (lowerCode.includes('table')) return 'Table';

    return 'Component';
  }
}