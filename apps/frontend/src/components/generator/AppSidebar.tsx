import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar"
import { CollapsibleTrigger, Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { FolderOpen, Settings, HelpCircle, PlusCircle, ChevronRight } from "lucide-react"
import type { LibraryWithComponents } from "@compkit/types";
import { getLibraryById } from '@/api/client';
import { ProjectDropdown } from './ProjectDropdown';

export function AppSidebar({ 
  libraries, 
  onLoadLibrary 
}: { 
  libraries: LibraryWithComponents[];
  onLoadLibrary?: (library: LibraryWithComponents) => void;
}) {
  const handleLoadProject = async (libraryId: string) => {
    try {
      const response = await getLibraryById(libraryId);
      
      if (onLoadLibrary) {
        // If components are missing from the library object but exist in the response
        // ensure they are passed correctly
        const libraryToLoad = {
          ...response.library,
          components: response.library.components || []
        };
        
        onLoadLibrary(libraryToLoad);
      }
    } catch (error) {
      console.error('Failed to load project:', error);
    }
  };

  const handleNewProject = () => {
    sessionStorage.removeItem('generator-prompt');
    sessionStorage.removeItem('generator-code');
    sessionStorage.removeItem('generator-components');
    sessionStorage.removeItem('generator-selected');
    sessionStorage.removeItem('generator-conversation-mode');
    window.location.reload();
  };

  return (
    <Sidebar collapsible='icon'>
      <SidebarContent className="mt-10">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="mt-6 text-[13px] text-muted-foreground">
              <Collapsible className="group" defaultOpen={false}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="cursor-pointer">
                      <FolderOpen strokeWidth={2.5} className="size-5" />
                      <span className="text-[13px]">Projects</span>
                      <ChevronRight className="ml-auto size-4 transition-transform group-data-[state=open]:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {libraries.length === 0 ? (
                        <div className="px-2 py-1 text-xs text-muted-foreground">No projects yet</div>
                      ) : (
                        libraries.map((project) => (
                          <div key={project.id} className="group/item flex items-center gap-1">
                            <SidebarMenuButton
                              className="cursor-pointer flex-1 truncate justify-between"
                              onClick={() => handleLoadProject(project.id)}
                            >
                              <span className="text-xs max-w-30 overflow-hidden text-ellipsis font-medium">{project.name}</span>
                              <ProjectDropdown 
                              projectId={project.id} 
                              projectName={project.name || 'Untitled'} 
                            />
                            </SidebarMenuButton>
                            
                          </div>
                        ))
                      )}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/help">
                    <HelpCircle strokeWidth={2.5} className="size-5" />
                    <span className="text-[13px]">Help & Support</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a onClick={handleNewProject} className="bg-accent/60 cursor-pointer">
                    <PlusCircle strokeWidth={2.5} className="size-5" />
                    <span className="text-[13px]">New Component</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/settings" className="text-xs text-muted-foreground">
                <Settings className="size-4" />
                <span className="text-xs">Settings</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}