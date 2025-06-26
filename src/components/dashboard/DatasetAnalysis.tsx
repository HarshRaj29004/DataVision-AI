"use client";

import { analyzeDataset } from "@/ai/flows/analyze-dataset";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { BrainCircuit, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";

interface DatasetAnalysisProps {
  fileContent: string | null;
  analysisResult: string | null;
  setAnalysisResult: (result: string | null) => void;
}

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
      setAnalysisResult(result.summary);
      toast({
        title: "Analysis Complete",
        description: "The dataset has been successfully analyzed.",
      });
    } catch (error) {
      console.error("Analysis failed:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "An error occurred during dataset analysis.",
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
        <CardDescription>Get AI-powered descriptive statistics and insights.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <Button onClick={handleAnalyze} disabled={isLoading || !fileContent} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          {isLoading ? "Analyzing..." : "Analyze with AI"}
        </Button>
        <div className="mt-4 flex-grow rounded-lg border bg-muted/30 p-1 min-h-40">
          <ScrollArea className="h-full p-3">
            {analysisResult ? (
              <pre className="whitespace-pre-wrap text-sm font-code">{analysisResult}</pre>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                {isLoading ? "Generating insights..." : "Analysis results will appear here."}
              </div>
            )}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
