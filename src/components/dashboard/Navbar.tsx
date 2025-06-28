
'use client';

import { buttonVariants } from "@/components/ui/button";
import { Database, FileUp, LayoutGrid } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface NavbarProps {
  onFileSelect?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Navbar({ onFileSelect }: NavbarProps) {
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-between border-b bg-card px-4 py-2 md:px-6">
      <div className="flex-1" />
      <div className="flex gap-2 rounded-lg bg-muted p-1">
        <Link
          href="/dashboard/data"
          className={cn(buttonVariants({ variant: pathname.startsWith('/dashboard/data') ? 'secondary' : 'ghost', className: "font-semibold" }))}
        >
          <Database className="mr-2 h-4 w-4" />
          Data
        </Link>
        <Link
          href="/dashboard/workspace"
          className={cn(buttonVariants({ variant: pathname.startsWith('/dashboard/workspace') ? 'secondary' : 'ghost', className: "font-semibold" }))}
        >
          <LayoutGrid className="mr-2 h-4 w-4" />
          Workspace
        </Link>
      </div>
       <div className="flex flex-1 justify-end">
        {pathname.startsWith('/dashboard/data') && (
          <>
            <Label htmlFor="file-upload-navbar" className={cn(buttonVariants({ variant: "outline" }), "cursor-pointer")}>
              <FileUp className="mr-2 h-4 w-4" />
              Upload Dataset
            </Label>
            <Input id="file-upload-navbar" type="file" className="hidden" onChange={onFileSelect} accept=".csv,.txt,.pdf,.xlsx,.xls" />
          </>
        )}
      </div>
    </nav>
  );
}
