"use client";

import { useState } from 'react';
import { Header } from '@/components/dashboard/Header';
import { FileUpload } from '@/components/dashboard/FileUpload';
import { DatasetAnalysis } from '@/components/dashboard/DatasetAnalysis';
import { DatasetViewer } from '@/components/dashboard/DatasetViewer';
import { Workspace } from '@/components/dashboard/Workspace';
import { parseCsv } from '@/lib/csv-parser';
import { Navbar } from '@/components/dashboard/Navbar';
import type { AnalyzeDatasetOutput } from '@/ai/flows/analyze-dataset';

type ParsedData = {
  headers: string[];
  data: Record<string, string>[];
}

export default function DashboardPage() {
  const [activeView, setActiveView] = useState('data');
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ParsedData>({ headers: [], data: [] });
  const [analysisResult, setAnalysisResult] = useState<AnalyzeDatasetOutput | null>(null);

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

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <Navbar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        {activeView === 'data' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 auto-rows-fr">
            <div className="lg:col-span-1">
              <FileUpload onFileContentRead={handleFileRead} />
            </div>
            <div className="lg:col-span-1">
              <DatasetAnalysis fileContent={fileContent} analysisResult={analysisResult} setAnalysisResult={setAnalysisResult} />
            </div>
            <div className="lg:col-span-2">
               <DatasetViewer headers={parsedData.headers} data={parsedData.data} fileName={fileName} />
            </div>
          </div>
        )}
        {activeView === 'workspace' && (
          <div className="h-full">
            <Workspace />
          </div>
        )}
      </main>
    </div>
  );
}
