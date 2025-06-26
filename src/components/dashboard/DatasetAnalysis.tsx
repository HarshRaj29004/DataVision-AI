"use client";

import { analyzeDataset, AnalyzeDatasetOutput } from "@/ai/flows/analyze-dataset";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { BrainCircuit, Loader2, Sparkles, Sigma, Type, BarChart as BarChartIcon } from "lucide-react";
import React, { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface DatasetAnalysisProps {
  fileContent: string | null;
  analysisResult: AnalyzeDatasetOutput | null;
  setAnalysisResult: (result: AnalyzeDatasetOutput | null) => void;
}

const getCellColorStyle = (value: number | undefined): React.CSSProperties => {
    if (value === undefined || value === null) {
      return { backgroundColor: 'hsl(var(--muted-foreground) / 0.1)' };
    }
    if (value === 1) {
      return { backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' };
    }
    const hue = value > 0 ? 140 : 0;
    const saturation = 60 + (Math.abs(value) * 20);
    const lightness = 95 - (Math.abs(value) * 45);
    const textColor = lightness > 70 ? 'hsl(var(--foreground))' : 'hsl(var(--primary-foreground))';
    
    return { 
      backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
      color: textColor,
    };
};

const CorrelationHeatmap = ({ matrix, title }: { matrix: NonNullable<AnalyzeDatasetOutput['correlationMatrix']>, title: string }) => {
  if (!matrix || matrix.length === 0) return null;

  const numericColumns = Array.from(new Set(matrix.flatMap(c => [c.column1, c.column2]))).sort();
  
  const correlationMap = new Map<string, number>();
  matrix.forEach(({ column1, column2, correlation }) => {
    correlationMap.set(`${column1}|${column2}`, correlation);
    correlationMap.set(`${column2}|${column1}`, correlation);
  });

  return (
     <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <Sigma className="h-6 w-6" />
            {title}
        </CardTitle>
        <CardDescription>Pearson correlation between numeric columns. Green for positive, red for negative correlation.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full whitespace-nowrap rounded-lg border">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky left-0 bg-card z-10"></TableHead>
                  {numericColumns.map(col => <TableHead key={col}>{col}</TableHead>)}
                </TableRow>
              </TableHeader>
              <TableBody>
                {numericColumns.map(rowCol => (
                  <TableRow key={rowCol}>
                    <TableHead className="sticky left-0 bg-card z-10 font-bold">{rowCol}</TableHead>
                    {numericColumns.map(colCol => {
                      const correlation = rowCol === colCol ? 1 : correlationMap.get(`${rowCol}|${colCol}`);
                      return (
                        <TableCell key={colCol} className="text-center p-1">
                           <div className={'p-2 rounded-md transition-colors'} style={getCellColorStyle(correlation)}>
                             {correlation !== undefined ? correlation.toFixed(2) : 'N/A'}
                           </div>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="h-4" /> 
        </ScrollArea>
      </CardContent>
    </Card>
  )
};

const ColumnAnalysis = ({ analysis }: { analysis: AnalyzeDatasetOutput['columnAnalyses'][0] }) => {
  return (
    <AccordionItem value={analysis.columnName}>
      <AccordionTrigger>
        <div className="flex items-center gap-4">
          <span className="font-semibold font-headline">{analysis.columnName}</span>
          <Badge variant="secondary">{analysis.dataType}</Badge>
        </div>
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pt-2">
        <div>
          <h4 className="font-semibold mb-2 flex items-center gap-2"><Sigma className="h-4 w-4" />Statistics</h4>
          <Table>
            <TableBody>
              {Object.entries(analysis.statistics).map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</TableCell>
                  <TableCell>{typeof value === 'number' ? value.toLocaleString() : value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {analysis.histogramData && analysis.histogramData.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2"><BarChartIcon className="h-4 w-4"/>Histogram</h4>
            <div className="h-64 w-full text-xs">
                <ChartContainer config={{count: {label: "Count", color: "hsl(var(--primary))"}}}>
                  <BarChart data={analysis.histogramData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="bin" tickLine={false} axisLine={false} angle={-45} textAnchor="end" height={50} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip 
                        content={<ChartTooltipContent />}
                        cursor={{fill: "hsl(var(--muted))"}}
                    />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
            </div>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
};


export function DatasetAnalysis({ fileContent, analysisResult, setAnalysisResult }: DatasetAnalysisProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!fileContent) {
      toast({
        variant: "destructive",
        title: "No file uploaded",
        description: "Please upload a dataset first.",
      });
      return;
    }

    setIsLoading(true);
    setAnalysisResult(null);

    try {
      const result = await analyzeDataset({ dataset: fileContent });
      setAnalysisResult(result);
      toast({
        title: "Analysis Complete",
        description: "The dataset has been successfully analyzed.",
      });
    } catch (error) {
      console.error("Analysis failed:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "An error occurred during analysis. The AI may not be able to process this file format or content.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <BrainCircuit className="h-6 w-6" />
          Analyze Dataset
        </CardTitle>
        <CardDescription>Get AI-powered insights, graphs, and statistics.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <Button onClick={handleAnalyze} disabled={isLoading || !fileContent} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 mb-4">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          {isLoading ? "Analyzing..." : "Analyze with AI"}
        </Button>

        <div className="flex-grow rounded-lg border bg-muted/30 p-1 min-h-40">
          <ScrollArea className="h-[calc(100vh-450px)] p-3">
             {isLoading && (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                <div className="text-center space-y-2">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    <p>Generating insights, this may take a moment...</p>
                </div>
              </div>
            )}
            {!isLoading && !analysisResult && (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Analysis results will appear here.
              </div>
            )}
            {analysisResult && (
              <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-headline font-semibold mb-2">Summary</h3>
                    <p className="text-sm text-foreground/80">{analysisResult.summary}</p>
                </div>
                
                {analysisResult.correlationMatrix && analysisResult.correlationMatrix.length > 0 && (
                   <CorrelationHeatmap matrix={analysisResult.correlationMatrix} title="Correlation Matrix"/>
                )}

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline flex items-center gap-2">
                                <Type className="h-6 w-6"/>
                                Column Analysis
                            </CardTitle>
                             <CardDescription>Detailed statistics and distributions for each column.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Accordion type="single" collapsible className="w-full">
                                {analysisResult.columnAnalyses.map(col => <ColumnAnalysis key={col.columnName} analysis={col} />)}
                            </Accordion>
                        </CardContent>
                    </Card>
                </div>
              </div>
            )}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
