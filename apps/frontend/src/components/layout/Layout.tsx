import { SidebarProvider, useSidebar } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/ui/AppSidebar"
import type { Library } from "@compkit/types";

function LayoutContent({ children, libraries }: { children: React.ReactNode; libraries: Library[] }) {
  const { setOpen, setOpenMobile } = useSidebar()

  const handleMouseEnter = () => {
    setOpen(true)
    setOpenMobile(false) 
  }

  const handleMouseLeave = () => {
    setOpen(false)
  }

  return (
    <div className="relative w-full">
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="group"
      >
        <AppSidebar libraries={libraries} />
      </div>
      <main className="w-full">
        {children}
      </main>
    </div>
  )
}

export default function Layout({ children, libraries }: { children: React.ReactNode; libraries: Library[] }) {
  return (
    <SidebarProvider defaultOpen={false}>
      <LayoutContent libraries={libraries}>{children}</LayoutContent>
    </SidebarProvider>
  )
}