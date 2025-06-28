"use client";

import { useState } from 'react';
import { DatasetAnalysis } from '@/components/dashboard/DatasetAnalysis';
import { DatasetViewer } from '@/components/dashboard/DatasetViewer';
import { Navbar } from '@/components/dashboard/Navbar';
import { parseCsv } from '@/lib/csv-parser';
import type { AnalyzeDatasetOutput } from '@/ai/flows/analyze-dataset';
import { useToast } from '@/hooks/use-toast';

type ParsedData = {
  headers: string[];
  data: Record<string, string>[];
}

export default function DataPage() {
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ParsedData>({ headers: [], data: [] });
  const [analysisResult, setAnalysisResult] = useState<AnalyzeDatasetOutput | null>(null);
  const { toast } = useToast();

  const handleFileRead = (content: string, name: string) => {
    setFileContent(content);
    setFileName(name);
    setAnalysisResult(null);
    
    if (name.toLowerCase().endsWith('.csv')) {
      const { headers, data } = parseCsv(content);
      setParsedData({ headers, data });
    } else {
      setParsedData({ headers: ['File Content'], data: [{ 'File Content': `Content of ${name} is loaded but tabular preview is only available for CSV files.`}] });
    }
  };
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        handleFileRead(content, file.name);
        toast({
          title: "File Uploaded",
          description: `${file.name} has been loaded successfully.`,
        });
      };
      reader.onerror = () => {
        toast({
          variant: "destructive",
          title: "Error Reading File",
          description: "There was an issue reading the file.",
        });
      }
      reader.readAsText(file);
      event.target.value = '';
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <Navbar onFileSelect={handleFileSelect} />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="grid h-full grid-cols-1 gap-6 auto-rows-fr lg:grid-cols-2">
          <div className="lg:col-span-1">
            <DatasetAnalysis fileContent={fileContent} analysisResult={analysisResult} setAnalysisResult={setAnalysisResult} />
          </div>
          <div className="lg:col-span-1">
              <DatasetViewer headers={parsedData.headers} data={parsedData.data} fileName={fileName} />
          </div>
        </div>
      </main>
    </div>
  );
}
