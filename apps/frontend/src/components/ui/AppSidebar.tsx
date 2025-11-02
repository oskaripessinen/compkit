import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { CollapsibleTrigger, Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { FolderOpen, History, Settings, HelpCircle, PlusCircle, ChevronDown, ChevronRight } from "lucide-react"

export function AppSidebar() {

  const handleNewProject = () => {
    sessionStorage.removeItem('generator-prompt');
    sessionStorage.removeItem('generator-code');
    sessionStorage.removeItem('generator-components');
    sessionStorage.removeItem('generator-selected');
    sessionStorage.removeItem('generator-conversation-mode');
    window.location.reload();

  };

  const mockProjects = [
    { id: '1', name: 'Dashboard UI', date: '2 days ago' },
    { id: '2', name: 'Landing Page', date: '1 week ago' },
    { id: '3', name: 'Auth Components', date: '2 weeks ago' },
  ];

  return (
    <Sidebar collapsible='icon'>
      <SidebarContent className="mt-10">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="mt-9 text-[13px] text-muted-foreground">
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
                      {mockProjects.map((project) => (

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
                  <a href="/history">
                    <History strokeWidth={2.5} className="size-5" />
                    <span className="text-[13px]">History</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
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