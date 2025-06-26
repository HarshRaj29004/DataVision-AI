
'use client';

import { Button } from "@/components/ui/button";
import { Database, LayoutGrid } from "lucide-react";

interface NavbarProps {
  activeView: string;
  setActiveView: (view: 'data' | 'workspace') => void;
}

export function Navbar({ activeView, setActiveView }: NavbarProps) {
  return (
    <nav className="flex items-center justify-center border-b bg-card px-4 py-2 md:px-6">
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
    </nav>
  );
}
