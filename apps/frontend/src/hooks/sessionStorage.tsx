import { useState, useEffect } from 'react';
import type { LibraryWithComponents } from '@compkit/types';

export function useSessionStorage<T>(key: string, initialValue: T) {
  // Initialize state with value from sessionStorage or initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update sessionStorage when state changes
  useEffect(() => {
    try {
      sessionStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error setting sessionStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}

// Specialized hook for generator state
export function useGeneratorState() {
  const [prompt, setPrompt] = useSessionStorage('generator-prompt', '');
  const [generatedCode, setGeneratedCode] = useSessionStorage<string | null>('generator-code', null);
  const [components, setComponents] = useSessionStorage<Array<{ name: string; code: string }>>('generator-components', []);
  const [selectedComponent, setSelectedComponent] = useSessionStorage('generator-selected', 0);
  const [conversationMode, setConversationMode] = useSessionStorage('generator-conversation-mode', false);
  const [css, setCss] = useSessionStorage<string>('generator-css', '');

  const clearState = () => {
    sessionStorage.removeItem('generator-prompt');
    sessionStorage.removeItem('generator-code');
    sessionStorage.removeItem('generator-components');
    sessionStorage.removeItem('generator-selected');
    sessionStorage.removeItem('generator-conversation-mode');
    sessionStorage.removeItem('generator-css');
    setPrompt('');
    setGeneratedCode(null);
    setComponents([]);
    setSelectedComponent(0);
    setConversationMode(false);
    setCss('');
  };

  const loadLibraryToState = (library: LibraryWithComponents) => {
    if (!library || !library.components || library.components.length === 0) {
      console.warn('Cannot load empty library');
      return;
    }

    // Separate CSS from component code
    const componentCode = library.components
      .map(component => component.code)
      .join('\n\n');

    // Use library's CSS if available, otherwise extract from component code
    let css = library.css || '';
    let cleanComponentCode = componentCode;

    if (!css) {
      // Extract CSS from the beginning (before first import or component definition)
      const importIndex = componentCode.indexOf('import');
      if (importIndex > 0) {
        css = componentCode.substring(0, importIndex).trim();
        cleanComponentCode = componentCode.substring(importIndex);
      }
    }

    // Map components to the expected format
    const formattedComponents = library.components.map(component => {
      // Keep the code as is from database, don't try to strip anything
      // The backend now handles CSS separation and cleanup properly
      return {
        name: component.name,
        code: component.code,
      };
    });
    console.log('formattedComponents', formattedComponents);

    // Update session storage with library data
    setPrompt(`Loaded from library: ${library.name || 'Untitled'}`);
    setGeneratedCode(cleanComponentCode);
    setComponents(formattedComponents);
    setSelectedComponent(0);
    setConversationMode(true);
    setCss(css);

    console.log(`Loaded library "${library.name}" with ${formattedComponents.length} components`);
  };

  return {
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
    css,
    setCss,
    clearState,
    loadLibraryToState,
  };
}