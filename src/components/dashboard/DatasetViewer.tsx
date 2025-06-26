"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TableIcon } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

interface DatasetViewerProps {
  headers: string[];
  data: Record<string, string>[];
  fileName: string | null;
}

export function DatasetViewer({ headers, data, fileName }: DatasetViewerProps) {
  const hasData = headers.length > 0 && data.length > 0;

  return (
    <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <TableIcon className="h-6 w-6" />
          View Dataset
        </CardTitle>
        <CardDescription>
          {fileName ? `Preview of ${fileName}` : "An interactive preview of your uploaded data."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow relative min-h-64">
        <ScrollArea className="absolute inset-0">
          {hasData ? (
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10 shadow-sm">
                <TableRow>
                  {headers.map((header) => (
                    <TableHead key={header} className="font-bold">{header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.slice(0, 100).map((row, rowIndex) => ( // Limiting to 100 rows for performance
                  <TableRow key={rowIndex}>
                    {headers.map((header) => (
                      <TableCell key={header}>{row[header]}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Upload a file to see a preview.
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
