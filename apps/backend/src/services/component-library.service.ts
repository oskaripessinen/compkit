import { supabase } from '../config/supabase';
import { AIService } from './ai.service';
import type { Response } from 'express';
import sanitize from 'sanitize-filename';
import archiver from 'archiver';

export class ComponentLibraryService {
  /**
   * Creates a new component library and saves generated components
   */
  static async createLibraryFromGeneration(
    userId: string,
    prompt: string,
    generatedCode: string,
    libraryName?: string
  ): Promise<{
    library: any;
    components: any[];
  }> {
    try {
      // Parse components from generated code
      const parsedComponents = AIService.parseComponents(generatedCode);

      // Generate library name from prompt if not provided
      const finalLibraryName = libraryName || this.generateLibraryName(prompt);

      // Create library
      const { data: library, error: libraryError } = await supabase
        .from('libraries')
        .insert({
          user_id: userId,
          name: finalLibraryName,
        })
        .select()
        .single();

      if (libraryError) {
        throw new Error(libraryError.message);
      }

      // Save all components to database
      const componentsToInsert = parsedComponents.map((comp) => ({
        user_id: userId,
        name: comp.name,
        code: comp.code,
        category: comp.name.toLowerCase(),
      }));

      const { data: components, error: componentsError } = await supabase
        .from('components')
        .insert(componentsToInsert)
        .select();

      if (componentsError) {
        throw new Error(componentsError.message);
      }

      // Link components to library
      const libraryComponentLinks = components.map((comp) => ({
        library_id: library.id,
        component_id: comp.id,
      }));

      const { error: linkError } = await supabase
        .from('library_components')
        .insert(libraryComponentLinks);

      if (linkError) {
        throw new Error(linkError.message);
      }

      return {
        library,
        components,
      };
    } catch (error: any) {
      console.error('Failed to create component library:', error);
      throw new Error(error.message || 'Failed to save component library');
    }
  }

  /**
   * Adds a new component to an existing library
   */
  static async addComponentToLibrary(
    userId: string,
    libraryId: string,
    componentName: string,
    componentCode: string,
    category?: string
  ) {
    try {
      // Verify library exists and user has access
      const { data: library, error: libraryError } = await supabase
        .from('libraries')
        .select()
        .eq('id', libraryId)
        .eq('user_id', userId)
        .single();

      if (libraryError || !library) {
        throw new Error('Library not found or access denied');
      }

      // Create component
      const { data: component, error: componentError } = await supabase
        .from('components')
        .insert({
          user_id: userId,
          name: componentName,
          code: componentCode,
          category: category || componentName.toLowerCase(),
        })
        .select()
        .single();

      if (componentError) {
        throw new Error(componentError.message);
      }

      // Link component to library
      const { error: linkError } = await supabase
        .from('library_components')
        .insert({
          library_id: libraryId,
          component_id: component.id,
        });

      if (linkError) {
        throw new Error(linkError.message);
      }

      return component;
    } catch (error: any) {
      console.error('Failed to add component to library:', error);
      throw new Error(error.message || 'Failed to add component');
    }
  }

  /**
   * Updates a component
   */
  static async updateComponent(
    userId: string,
    componentId: string,
    updatedCode: string
  ) {
    try {
      const { data: component, error } = await supabase
        .from('components')
        .update({ code: updatedCode })
        .eq('id', componentId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (!component) {
        throw new Error('Component not found or access denied');
      }

      return component;
    } catch (error: any) {
      console.error('Failed to update component:', error);
      throw new Error(error.message || 'Failed to update component');
    }
  }

  /**
   * Gets all libraries for a user with their components
   */
  static async getUserLibraries(userId: string) {
    try {
      const { data: libraries, error } = await supabase
        .from('libraries')
        .select(`
          *,
          library_components (
            component:components (*)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      // Flatten the structure
      const formattedLibraries = libraries.map((lib) => ({
        ...lib,
        components: lib.library_components.map((lc: any) => lc.component),
      }));

      return formattedLibraries;
    } catch (error: any) {
      console.error('Failed to fetch user libraries:', error);
      throw new Error(error.message || 'Failed to fetch libraries');
    }
  }

  /**
   * Gets a single library with all its components
   */
  static async getLibraryById(libraryId: string, userId: string) {
    try {
      const { data: library, error } = await supabase
        .from('libraries')
        .select(`
          *,
          library_components (
            component:components (*)
          )
        `)
        .eq('id', libraryId)
        .eq('user_id', userId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (!library) {
        throw new Error('Library not found or access denied');
      }

      // Flatten the structure
      const formattedLibrary = {
        ...library,
        components: library.library_components.map((lc: any) => lc.component),
      };

      return formattedLibrary;
    } catch (error: any) {
      console.error('Failed to fetch library:', error);
      throw new Error(error.message || 'Failed to fetch library');
    }
  }

  /**
   * Deletes a library and its component links (components remain)
   */
  static async deleteLibrary(libraryId: string, userId: string) {
    try {
      const { error } = await supabase
        .from('libraries')
        .delete()
        .eq('id', libraryId)
        .eq('user_id', userId);

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    } catch (error: any) {
      console.error('Failed to delete library:', error);
      throw new Error(error.message || 'Failed to delete library');
    }
  }

  /**
   * Deletes a component and its library links
   */
  static async deleteComponent(componentId: string, userId: string) {
    try {
      const { error } = await supabase
        .from('components')
        .delete()
        .eq('id', componentId)
        .eq('user_id', userId);

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    } catch (error: any) {
      console.error('Failed to delete component:', error);
      throw new Error(error.message || 'Failed to delete component');
    }
  }

  /**
   * Generates a library name from user prompt
   */
  private static generateLibraryName(prompt: string): string {
    // Extract key words from prompt
    const words = prompt
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3 && !['create', 'make', 'with', 'using'].includes(word));

    if (words.length === 0) {
      return `Library ${new Date().toLocaleDateString()}`;
    }

    // Take first 2-3 meaningful words
    const libraryName = words
      .slice(0, 3)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return libraryName || `Library ${new Date().toLocaleDateString()}`;
  }

  /**
   * Streams a ZIP archive of a library or a single component to the provided Express response.
   * Public: does not require authentication (use with caution).
   */
  static async streamLibraryZip(
    res: Response,
    libraryId: string,
    componentName?: string
  ): Promise<void> {
    try {
      // Fetch library with components (no user restriction)
      const { data: library, error } = await supabase
        .from('libraries')
        .select(`
          *,
          library_components (
            component:components (*)
          )
        `)
        .eq('id', libraryId)
        .single();

      if (error || !library) {
        res.status(404).json({ error: 'Library not found' });
        return;
      }

      const components = (library.library_components || []).map((lc: any) => lc.component);

      // Optionally filter by component name (case-insensitive)
      const selected = componentName
        ? components.filter((c: any) => c.name.toLowerCase() === componentName.toLowerCase())
        : components;

      if (selected.length === 0) {
        res.status(404).json({ error: 'Component not found in library' });
        return;
      }

      const archive = archiver('zip', { zlib: { level: 9 } });

      const safeLibName = sanitize(library.name || `library-${libraryId}`);
      const fileName = componentName
        ? `${safeLibName}-${sanitize(componentName)}.zip`
        : `${safeLibName}.zip`;

      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

      archive.on('error', (err) => {
        console.error('Archive error:', err);
        // If headers not sent yet, send error
        try {
          if (!res.headersSent) res.status(500).json({ error: 'Failed to create archive' });
        } catch {}
        archive.abort();
      });

      archive.pipe(res);

      // Add a simple README describing the package
      const readme = `Compkit export: ${library.name || libraryId}\n\nContains ${selected.length} component(s).\n`;
      archive.append(readme, { name: 'README.md' });

      // Add each component as a .tsx file under components/
      for (const comp of selected) {
        const fileBase = sanitize(comp.name || comp.id);
        const filePath = `components/${fileBase}.tsx`;
        const content = typeof comp.code === 'string' ? comp.code : JSON.stringify(comp.code, null, 2);
        archive.append(content, { name: filePath });
      }

      await archive.finalize();
      // stream will end when archive finalizes
    } catch (err: any) {
      console.error('Failed to stream library zip:', err);
      try {
        if (!res.headersSent) res.status(500).json({ error: 'Internal server error' });
      } catch {}
    }
  }
}