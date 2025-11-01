import { SidebarProvider, useSidebar } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/ui/AppSidebar"

function LayoutContent({ children }: { children: React.ReactNode }) {
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
        <AppSidebar />
      </div>
      <main className="w-full">
        {children}
      </main>
    </div>
  )
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={false}>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  )
}