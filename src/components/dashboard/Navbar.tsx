
'use client';

import { Button, buttonVariants } from "@/components/ui/button";
import { Database, FileUp, LayoutGrid } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

interface NavbarProps {
  activeView: string;
  setActiveView: (view: 'data' | 'workspace') => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Navbar({ activeView, setActiveView, onFileSelect }: NavbarProps) {
  return (
    <nav className="flex items-center justify-between border-b bg-card px-4 py-2 md:px-6">
      <div className="flex-1" />
      <div className="flex gap-2 rounded-lg bg-muted p-1">
        <Button
          variant={activeView === 'data' ? 'secondary' : 'ghost'}
          onClick={() => setActiveView('data')}
          className="font-semibold"
        >
          <Database className="mr-2 h-4 w-4" />
          Data
        </Button>
        <Button
          variant={activeView === 'workspace' ? 'secondary' : 'ghost'}
          onClick={() => setActiveView('workspace')}
          className="font-semibold"
        >
          <LayoutGrid className="mr-2 h-4 w-4" />
          Workspace
        </Button>
      </div>
       <div className="flex flex-1 justify-end">
        {activeView === 'data' && (
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
