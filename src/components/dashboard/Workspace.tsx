import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, Filter, LayoutGrid, Merge, GitCommitHorizontal } from "lucide-react";

export function Workspace() {
  const operations = [
    { name: "Source Data", icon: Database, color: "bg-blue-100 text-blue-800" },
    { name: "Filter Rows", icon: Filter, color: "bg-green-100 text-green-800" },
    { name: "Merge Data", icon: Merge, color: "bg-purple-100 text-purple-800" },
    { name: "Output", icon: Database, color: "bg-yellow-100 text-yellow-800" },
  ];

  return (
    <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <LayoutGrid className="h-6 w-6" />
          No-Code Workspace
        </CardTitle>
        <CardDescription>Drag and drop components to build your data science pipeline.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center bg-muted/30 rounded-b-lg p-6 min-h-64">
        <div className="w-full flex items-center justify-center space-x-2 md:space-x-4 overflow-x-auto pb-4">
          {operations.map((op, index) => (
            <>
              <div key={op.name} className="flex flex-col items-center space-y-2 flex-shrink-0">
                <div className={`flex items-center justify-center h-20 w-20 rounded-lg border-2 border-dashed shadow-sm ${op.color.replace('bg-', 'border-')}`}>
                  <op.icon className={`h-8 w-8 ${op.color.replace('bg-', 'text-')}`} />
                </div>
                <Badge variant="secondary" className="font-semibold">{op.name}</Badge>
              </div>
              {index < operations.length - 1 && (
                <GitCommitHorizontal className="h-8 w-8 text-muted-foreground hidden md:block flex-shrink-0" />
              )}
            </>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted-foreground text-center">
            This is a visual representation. Actual drag-and-drop functionality is not implemented.
        </p>
      </CardContent>
    </Card>
  );
}
