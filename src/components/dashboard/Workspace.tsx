"use client"

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, Filter, LayoutGrid, Merge, GitCommitHorizontal, FileSpreadsheet, Bot, ListChecks, Puzzle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type PipelineOperation = {
  id: number;
  name: string;
  icon: React.ElementType;
  color: string;
};

const availableOperations = [
  { name: 'Filter', icon: Filter, color: "bg-green-100 text-green-800", description: "Filter rows based on conditions." },
  { name: 'Merge', icon: Merge, color: "bg-purple-100 text-purple-800", description: "Join with another dataset." },
  { name: 'Group By', icon: GitCommitHorizontal, color: "bg-yellow-100 text-yellow-800", description: "Aggregate data by columns." },
  { name: 'AI Clean', icon: Bot, color: "bg-indigo-100 text-indigo-800", description: "Clean and format data with AI." },
];

const PipelineVisual = ({ operations, onDrop, onDragOver, onDragLeave }: { operations: PipelineOperation[], onDrop: (e: React.DragEvent<HTMLDivElement>) => void, onDragOver: (e: React.DragEvent<HTMLDivElement>) => void, onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void }) => {
  return (
    <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <LayoutGrid className="h-6 w-6" />
          Data Pipeline
        </CardTitle>
        <CardDescription>Visually represent your data transformation steps. Drag columns or elements from the sidebar to start.</CardDescription>
      </CardHeader>
      <CardContent 
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className="flex-grow flex flex-col items-center justify-center bg-muted/30 rounded-b-lg p-6 min-h-96 border-2 border-dashed border-transparent transition-colors"
      >
        {operations.length === 0 ? (
            <div className="text-center text-muted-foreground">
                <LayoutGrid className="h-12 w-12 mx-auto mb-2" />
                <p className="font-semibold">Drag & Drop Area</p>
                <p className="text-sm">Drop columns or elements here to build your pipeline.</p>
            </div>
        ) : (
            <div className="w-full flex items-center justify-center space-x-2 md:space-x-4 overflow-x-auto pb-4">
            {operations.map((op, index) => (
                <React.Fragment key={op.id}>
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
        )}
      </CardContent>
    </Card>
  );
};


// Panel components
const ColumnsPanel = () => {
    const columns = [ "CustomerID", "Age", "Gender", "Annual Income", "Spending Score" ];

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, columnName: string) => {
        const data = JSON.stringify({ type: 'column', name: columnName });
        e.dataTransfer.setData("application/json", data);
    }

    return (
        <div className="p-4 space-y-4 h-full flex flex-col">
            <h3 className="font-semibold text-foreground/90 text-lg">Columns</h3>
            <p className="text-sm text-muted-foreground">Drag columns to the pipeline.</p>
            <div className="flex-grow space-y-2 rounded-md border p-4 overflow-y-auto">
                {columns.map(col => (
                     <div 
                        key={col} 
                        draggable="true"
                        onDragStart={(e) => handleDragStart(e, col)}
                        className="flex items-center space-x-2 p-2 rounded-md bg-secondary hover:bg-secondary/80 cursor-grab active:cursor-grabbing"
                     >
                        <Database className="h-4 w-4 text-secondary-foreground" />
                        <Label htmlFor={col} className="text-sm font-normal cursor-pointer">
                            {col}
                        </Label>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ElementsPanel = ({ operations }: { operations: typeof availableOperations }) => {
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, operationName: string) => {
        const data = JSON.stringify({ type: 'element', name: operationName });
        e.dataTransfer.setData("application/json", data);
    }

    return (
        <div className="p-4 space-y-4 h-full flex flex-col">
            <h3 className="font-semibold text-foreground/90 text-lg">Elements</h3>
            <p className="text-sm text-muted-foreground">Drag elements to the pipeline.</p>
            <div className="flex-grow space-y-2 rounded-md border p-4 overflow-y-auto">
                {operations.map(op => (
                     <div 
                        key={op.name} 
                        draggable="true"
                        onDragStart={(e) => handleDragStart(e, op.name)}
                        className="flex items-center space-x-3 p-3 rounded-md bg-secondary hover:bg-secondary/80 cursor-grab active:cursor-grabbing"
                     >
                        <op.icon className={`h-6 w-6 shrink-0 ${op.color.replace('bg-', 'text-')}`} />
                        <div>
                            <p className="text-sm font-semibold text-secondary-foreground">{op.name}</p>
                            <p className="text-xs text-muted-foreground">{op.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ExportPanel = () => {
    return (
        <div className="p-4 space-y-4">
            <h3 className="font-semibold text-foreground/90 text-lg">Export</h3>
            <p className="text-sm text-muted-foreground">Export or manipulate your dataset.</p>
            <Button variant="outline" className="w-full justify-start">
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Load into Excel
            </Button>
        </div>
    );
};

const AiPanel = () => {
    return (
         <div className="p-4 space-y-4 h-full flex flex-col">
            <h3 className="font-semibold text-foreground/90 text-lg flex items-center gap-2">
                <Bot className="h-5 w-5"/>
                AI Assistant
            </h3>
            <p className="text-sm text-muted-foreground">Ask questions about your data.</p>
            <Textarea placeholder="e.g., 'What is the average age of customers?'" className="flex-grow resize-none" />
            <Button className="w-full">
                Submit Query
            </Button>
        </div>
    );
};


const WorkspaceSidebar = () => {
    const [activeTool, setActiveTool] = React.useState('columns');

    const tools = [
        { id: 'columns', label: 'Columns', icon: ListChecks, panel: <ColumnsPanel /> },
        { id: 'elements', label: 'Elements', icon: Puzzle, panel: <ElementsPanel operations={availableOperations} /> },
        { id: 'export', label: 'Export', icon: FileSpreadsheet, panel: <ExportPanel /> },
        { id: 'ai', label: 'AI Chat', icon: Bot, panel: <AiPanel /> }
    ];

    const activePanel = tools.find(tool => tool.id === activeTool)?.panel;

    return (
        <Card className="h-full flex overflow-hidden transition-all duration-300 hover:shadow-lg">
            {/* Icon bar */}
            <div className="flex flex-col items-center gap-2 p-2 bg-muted/20 border-r">
                 <TooltipProvider delayDuration={0}>
                    {tools.map(tool => (
                        <Tooltip key={tool.id}>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={activeTool === tool.id ? "secondary" : "ghost"}
                                    size="icon"
                                    className="h-12 w-12"
                                    onClick={() => setActiveTool(tool.id)}
                                >
                                    <tool.icon className="h-6 w-6" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                <p>{tool.label}</p>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                 </TooltipProvider>
            </div>
            {/* Content Panel */}
            <div className="flex-grow w-full overflow-y-auto bg-card">
                {activePanel}
            </div>
        </Card>
    );
};

export function Workspace() {
    const [pipelineOperations, setPipelineOperations] = React.useState<PipelineOperation[]>([]);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault(); 
      e.currentTarget.classList.add("border-primary");
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.classList.remove("border-primary");
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.currentTarget.classList.remove("border-primary");
        const dataString = e.dataTransfer.getData("application/json");
        if (dataString) {
            try {
                const data = JSON.parse(dataString);
                if (data.type === 'column') {
                    const newOperation: PipelineOperation = {
                        id: Date.now(),
                        name: data.name,
                        icon: Database,
                        color: "bg-blue-100 text-blue-800",
                    };
                    setPipelineOperations(prev => [...prev, newOperation]);
                } else if (data.type === 'element') {
                    const operationDetails = availableOperations.find(op => op.name === data.name);
                    if (operationDetails) {
                        const newOperation: PipelineOperation = {
                            id: Date.now(),
                            name: operationDetails.name,
                            icon: operationDetails.icon,
                            color: operationDetails.color,
                        };
                        setPipelineOperations(prev => [...prev, newOperation]);
                    }
                }
            } catch (error) {
                console.error("Failed to parse dropped data:", error);
            }
        }
    };

  return (
    <div className="grid h-full grid-cols-1 gap-6 lg:grid-cols-10">
        <div className="lg:col-span-3">
            <WorkspaceSidebar />
        </div>
        <div className="lg:col-span-7">
            <PipelineVisual 
                operations={pipelineOperations} 
                onDrop={handleDrop} 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            />
        </div>
    </div>
  );
}
