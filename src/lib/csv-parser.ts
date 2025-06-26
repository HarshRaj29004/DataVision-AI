export function parseCsv(csvText: string): { headers: string[]; data: Record<string, string>[] } {
    const lines = csvText.trim().split('\n');
    if (lines.length === 0) {
      return { headers: [], data: [] };
    }
  
    const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));
    const data = lines.slice(1).map(line => {
      // Basic CSV parsing, may not handle all edge cases like commas in quoted fields
      const values = line.split(',');
      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        row[header] = values[index] ? values[index].trim().replace(/"/g, '') : '';
      });
      return row;
    });
  
    return { headers, data };
}
