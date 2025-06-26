// src/ai/flows/analyze-dataset.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing datasets.
 *
 * - analyzeDataset - A function that takes a dataset as input and returns a detailed analysis including statistics, column details, and data for visualizations.
 * - AnalyzeDatasetInput - The input type for the analyzeDataset function.
 * - AnalyzeDatasetOutput - The return type for the analyzeDataset function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeDatasetInputSchema = z.object({
  dataset: z
    .string()
    .describe('The dataset to analyze, in CSV, Excel, PDF, or TXT format as a string.'),
});
export type AnalyzeDatasetInput = z.infer<typeof AnalyzeDatasetInputSchema>;


const HistogramBinSchema = z.object({
  bin: z.string().describe("The label for the histogram bin (e.g., a range like '0-10')."),
  count: z.number().describe("The number of values in this bin."),
});

const StatisticsSchema = z.object({
    mean: z.number().optional().describe("The average value (for numeric columns)."),
    median: z.number().optional().describe("The median value (for numeric columns)."),
    stdDev: z.number().optional().describe("The standard deviation (for numeric columns)."),
    min: z.number().optional().describe("The minimum value (for numeric columns)."),
    max: z.number().optional().describe("The maximum value (for numeric columns)."),
    uniqueValues: z.number().optional().describe("The count of unique values (for categorical columns)."),
    valueCounts: z.string().optional().describe("A summary of the top 5 most frequent values and their counts (for categorical columns)."),
    description: z.string().optional().describe("A description of the content (for 'other' columns).")
}).describe("An object containing descriptive statistics. Based on the column's dataType, populate ONLY the relevant fields (e.g., mean, median for numeric; uniqueValues for categorical).");


const ColumnAnalysisSchema = z.object({
  columnName: z.string().describe("The name of the column."),
  dataType: z.enum(['numeric', 'categorical', 'other']).describe("The inferred data type of the column."),
  statistics: StatisticsSchema,
  histogramData: z.optional(z.array(HistogramBinSchema)).describe("Data for generating a histogram for numeric columns."),
});

const CorrelationSchema = z.object({
    column1: z.string(),
    column2: z.string(),
    correlation: z.number().min(-1).max(1),
});

const AnalyzeDatasetOutputSchema = z.object({
  summary: z.string().describe('A high-level summary of the dataset.'),
  columnAnalyses: z.array(ColumnAnalysisSchema).describe("A detailed analysis for each column in the dataset."),
  correlationMatrix: z.optional(z.array(CorrelationSchema)).describe("A list of correlation coefficients between all pairs of numeric columns. Only include if there are 2 or more numeric columns."),
});
export type AnalyzeDatasetOutput = z.infer<typeof AnalyzeDatasetOutputSchema>;


export async function analyzeDataset(input: AnalyzeDatasetInput): Promise<AnalyzeDatasetOutput> {
  return analyzeDatasetFlow(input);
}

const analyzeDatasetPrompt = ai.definePrompt({
  name: 'analyzeDatasetPrompt',
  input: {schema: AnalyzeDatasetInputSchema},
  output: {schema: AnalyzeDatasetOutputSchema},
  prompt: `You are an expert data analyst. Your task is to perform a comprehensive analysis of the provided dataset and return the results in a structured JSON format.

Dataset:
{{{dataset}}}

For your analysis, follow these instructions precisely:
1.  **High-Level Summary**: Provide a concise, high-level summary of the dataset. Mention the number of rows and columns and any overall observations.
2.  **Column-by-Column Analysis**: For EACH column in the dataset:
    a.  Identify the \`columnName\`.
    b.  Determine its \`dataType\` as 'numeric', 'categorical', or 'other'. A column is numeric if it contains numbers that can be used in mathematical calculations. A column is categorical if it contains a limited number of distinct text or numeric labels. If neither, use 'other'.
    c.  Calculate \`statistics\`. 
        - For 'numeric' columns, provide: \`mean\`, \`median\`, \`stdDev\` (standard deviation), \`min\`, and \`max\`. Round numbers to 2 decimal places.
        - For 'categorical' columns, provide: \`uniqueValues\` (count of unique values) and \`valueCounts\` (a string summarizing the top 5 most frequent values and their counts).
        - For 'other' columns, provide a \`description\` of the content.
    d.  For 'numeric' columns ONLY, generate \`histogramData\`. Group the data into a reasonable number of bins (5-10 bins is ideal) and provide the count for each bin. The 'bin' should be a string label representing the range (e.g., "0-10", "10-20").
3.  **Correlation Matrix**: If the dataset contains two or more 'numeric' columns, calculate the Pearson correlation coefficient between every pair of numeric columns. Populate the \`correlationMatrix\` list. Each entry should contain \`column1\`, \`column2\`, and the \`correlation\` value (between -1 and 1). If there are fewer than two numeric columns, this should be an empty array.

Return your entire analysis in the structured JSON format defined by the output schema. Ensure all fields are populated as described. Do not be lazy.
`,
});

const analyzeDatasetFlow = ai.defineFlow(
  {
    name: 'analyzeDatasetFlow',
    inputSchema: AnalyzeDatasetInputSchema,
    outputSchema: AnalyzeDatasetOutputSchema,
    retry: {
      backoff: {
        initial: 2000,
        multiplier: 2,
        max: 30000,
        randomizationFactor: 0.5,
      },
      maxAttempts: 3,
    },
  },
  async input => {
    const {output} = await analyzeDatasetPrompt(input);
    return output!;
  }
);
