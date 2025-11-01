import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Home, Sparkles, FolderOpen, History, Settings, HelpCircle, PlusSquare, PlusCircle } from "lucide-react"

export function AppSidebar() {
  return (
    <Sidebar collapsible='icon'>
      <SidebarContent className="mt-5">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="mt-9 text-[13px] text-muted-foreground">
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/projects">
                    <FolderOpen strokeWidth={2.5} className="size-5" />
                    <span className="text-[13px]">My Projects</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
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
                  <a href="/generator" className="bg-accent/60">
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