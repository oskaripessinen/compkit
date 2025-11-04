import { useState } from "react";
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, Trash2, Package } from "lucide-react";

interface ProjectDropdownProps {
  projectId: string;
  projectName: string;
}

export function ProjectDropdown({ projectId, projectName }: ProjectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleImport = () => {
    console.log('Import project:', projectId);
    setIsOpen(false);
    // TODO: Implement import
  };

  const handleDelete = () => {
    console.log('Delete project:', projectId);
    setIsOpen(false);
    // TODO: Implement delete with confirmation
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="h-6 w-8 rounded-sm opacity-0 group-hover/item:opacity-100 transition-opacity data-[state=open]:opacity-100" 
          size="sm"
          onClick={(e) => e.stopPropagation()}
        >
          <Ellipsis className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="start" 
        className="w-48"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DropdownMenuItem 
          onClick={(e) => {
            e.stopPropagation();
            handleImport();
          }}
        >
          <Package className="size-4" />
          <span className="text-muted-foreground">Import</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
        >
          <Trash2 color="#b94642" className="size-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}