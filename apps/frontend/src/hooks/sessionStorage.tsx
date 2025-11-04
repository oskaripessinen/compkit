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

  const clearState = () => {
    sessionStorage.removeItem('generator-prompt');
    sessionStorage.removeItem('generator-code');
    sessionStorage.removeItem('generator-components');
    sessionStorage.removeItem('generator-selected');
    sessionStorage.removeItem('generator-conversation-mode');
    setPrompt('');
    setGeneratedCode(null);
    setComponents([]);
    setSelectedComponent(0);
    setConversationMode(false);
  };

  const loadLibraryToState = (library: LibraryWithComponents) => {
    if (!library || !library.components || library.components.length === 0) {
      console.warn('Cannot load empty library');
      return;
    }

    // Combine all component codes
    const combinedCode = library.components
      .map(component => component.code)
      .join('\n\n');

    // Map components to the expected format
    const formattedComponents = library.components.map(component => ({
      name: component.name,
      code: component.code,
    }));

    // Update session storage with library data
    setPrompt(`Loaded from library: ${library.name || 'Untitled'}`);
    setGeneratedCode(combinedCode);
    setComponents(formattedComponents);
    setSelectedComponent(0);
    setConversationMode(true);

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
    clearState,
    loadLibraryToState,
  };
}