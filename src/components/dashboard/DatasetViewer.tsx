"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TableIcon } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";

interface DatasetViewerProps {
  headers: string[];
  data: Record<string, string>[];
  fileName: string | null;
}

export function DatasetViewer({ headers, data, fileName }: DatasetViewerProps) {
  const [visibleRows, setVisibleRows] = useState(10);

  // When the file (data) changes, reset the number of visible rows.
  useEffect(() => {
    setVisibleRows(10);
  }, [data]);

  const handleLoadMore = () => {
    setVisibleRows(prev => prev + 10);
  };

  const hasData = headers.length > 0 && data.length > 0;
  const hasMoreData = visibleRows < data.length;
  const currentVisibleRows = Math.min(visibleRows, data.length);

  return (
    <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <TableIcon className="h-6 w-6" />
          View Dataset
        </CardTitle>
        <CardDescription>
          {fileName ? `Preview of ${fileName}` : "An interactive preview of your uploaded data."}
          {hasData && ` (Showing ${currentVisibleRows} of ${data.length} rows)`}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <div className="relative flex-grow">
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
                    {data.slice(0, visibleRows).map((row, rowIndex) => (
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
        </div>
        {hasData && hasMoreData && (
          <div className="pt-4 flex justify-center">
            <Button onClick={handleLoadMore} variant="outline">
              Load More
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
