import { SidebarProvider, useSidebar } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/generator/AppSidebar"
import type { LibraryWithComponents } from "@compkit/types";
import { useEffect, useState } from "react";

function LayoutContent({ 
  children, 
  libraries,
  onLoadLibrary 
}: { 
  children: React.ReactNode; 
  libraries: LibraryWithComponents[];
  onLoadLibrary?: (library: LibraryWithComponents) => void;
}) {
  const { setOpen, setOpenMobile } = useSidebar()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Check if any dropdown is open by looking for open dropdown menu
  useEffect(() => {
    const checkDropdownState = () => {
      const dropdownOpen = document.querySelector('[data-state="open"][role="menu"]');
      setIsDropdownOpen(!!dropdownOpen);
    };

    const observer = new MutationObserver(checkDropdownState);
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: true,
      attributeFilter: ['data-state']
    });

    return () => observer.disconnect();
  }, []);

  const handleMouseEnter = () => {
    setOpen(true)
    setOpenMobile(false) 
  }

  const handleMouseLeave = () => {
    // Don't close if dropdown is open
    if (!isDropdownOpen) {
      setOpen(false)
    }
  }

  return (
    <div className="relative w-full">
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="group"
      >
        <AppSidebar libraries={libraries} onLoadLibrary={onLoadLibrary} />
      </div>
      <main className="w-full">
        {children}
      </main>
    </div>
  )
}

export default function Layout({ 
  children, 
  libraries,
  onLoadLibrary 
}: { 
  children: React.ReactNode; 
  libraries: LibraryWithComponents[];
  onLoadLibrary?: (library: LibraryWithComponents) => void;
}) {
  return (
    <SidebarProvider defaultOpen={false}>
      <LayoutContent libraries={libraries} onLoadLibrary={onLoadLibrary}>
        {children}
      </LayoutContent>
    </SidebarProvider>
  )
}