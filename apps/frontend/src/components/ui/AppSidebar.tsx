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
import type { Library } from "@compkit/types";

export function AppSidebar({ libraries }: { libraries: Library[] }) {



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
                      {libraries.map((project) => (

                          <SidebarMenuButton asChild>
                            <a href={`/project/${project.id}`} className="">
                              <span className="text-xs font-medium">{project.name}</span>
                            </a>
                          </SidebarMenuButton>

                      ))}
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