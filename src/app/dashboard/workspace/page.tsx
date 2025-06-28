"use client";

import { Navbar } from '@/components/dashboard/Navbar';
import { Workspace } from '@/components/dashboard/Workspace';

export default function WorkspacePage() {
  return (
    <div className="flex flex-1 flex-col">
        <Navbar />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
            <div className="h-full">
                <Workspace />
            </div>
        </main>
    </div>
  );
}
