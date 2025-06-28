import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, Filter, LayoutGrid, Merge, GitCommitHorizontal, FileSpreadsheet, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

const PipelineVisual = () => {
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
          Data Pipeline
        </CardTitle>
        <CardDescription>Visually represent your data transformation steps.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center bg-muted/30 rounded-b-lg p-6 min-h-96">
        <div className="w-full flex items-center justify-center space-x-2 md:space-x-4 overflow-x-auto pb-4">
          {operations.map((op, index) => (
            <React.Fragment key={op.name}>
              <div className="flex flex-col items-center space-y-2 flex-shrink-0">
                <div className={`flex items-center justify-center h-20 w-20 rounded-lg border-2 border-dashed shadow-sm ${op.color.replace('bg-', 'border-')}`}>
                  <op.icon className={`h-8 w-8 ${op.color.replace('bg-', 'text-')}`} />
                </div>
                <Badge variant="secondary" className="font-semibold">{op.name}</Badge>
              </div>
              {index < operations.length - 1 && (
                <GitCommitHorizontal className="h-8 w-8 text-muted-foreground hidden md:block flex-shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted-foreground text-center">
            This is a visual representation. Actual drag-and-drop functionality is not implemented.
        </p>
      </CardContent>
    </Card>
  );
};

const WorkspaceSidebar = () => {
    const columns = [ "CustomerID", "Age", "Gender", "Annual Income", "Spending Score" ];

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle className="font-headline">Tools</CardTitle>
                <CardDescription>Interact with your dataset.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
                
                <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Actions</h4>
                    <Button variant="outline" className="w-full justify-start">
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        Load into Excel
                    </Button>
                </div>
                
                <Separator />

                <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Select elements to operate</h4>
                    <div className="space-y-2 rounded-md border p-4 max-h-48 overflow-y-auto">
                        {columns.map(col => (
                             <div key={col} className="flex items-center space-x-2">
                                <Checkbox id={col} />
                                <Label htmlFor={col} className="text-sm font-normal cursor-pointer">
                                    {col}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

                <Separator />

                <div className="space-y-3">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                        <Bot className="h-5 w-5"/>
                        Ask Core Knowledge
                    </h4>
                    <Textarea placeholder="Ask questions about your data..." className="resize-none" rows={4} />
                    <Button className="w-full">
                        Submit Query
                    </Button>
                </div>

            </CardContent>
        </Card>
    );
};

export function Workspace() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        <div className="lg:col-span-4 xl:col-span-3">
            <WorkspaceSidebar />
        </div>
        <div className="lg:col-span-8 xl:col-span-9">
            <PipelineVisual />
        </div>
    </div>
  );
}
