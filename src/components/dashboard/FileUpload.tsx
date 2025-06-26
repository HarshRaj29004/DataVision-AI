"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { FileUp, FileText, FileSpreadsheet, FileCode } from "lucide-react";
import { useState } from "react";

interface FileUploadProps {
  onFileContentRead: (content: string, fileName: string) => void;
}

export function FileUpload({ onFileContentRead }: FileUploadProps) {
  const { toast } = useToast();
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onFileContentRead(content, file.name);
        setFileName(file.name);
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
        setFileName(null);
      }
      reader.readAsText(file);
    }
  };
  
  const getFileIcon = () => {
    if (!fileName) return <FileUp className="h-12 w-12 text-muted-foreground" />;
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'csv': return <FileSpreadsheet className="h-12 w-12 text-green-500" />;
      case 'txt': return <FileCode className="h-12 w-12 text-blue-500" />;
      case 'pdf': return <FileText className="h-12 w-12 text-red-500" />;
      case 'xlsx':
      case 'xls':
        return <FileSpreadsheet className="h-12 w-12 text-green-700" />;
      default: return <FileText className="h-12 w-12 text-gray-500" />;
    }
  }

  return (
    <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <FileUp className="h-6 w-6" />
          Upload Dataset
        </CardTitle>
        <CardDescription>Upload a CSV, Excel, PDF, or TXT file for analysis.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center">
        <div className="w-full">
            <Label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-full min-h-48 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted/50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {getFileIcon()}
                    {fileName ? (
                         <p className="mt-2 text-sm text-foreground font-semibold px-2 text-center">{fileName}</p>
                    ) : (
                        <>
                            <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-muted-foreground">CSV, TXT, PDF, or XLSX</p>
                        </>
                    )}
                </div>
                <Input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept=".csv,.txt,.pdf,.xlsx,.xls" />
            </Label>
        </div>
      </CardContent>
    </Card>
  );
}
