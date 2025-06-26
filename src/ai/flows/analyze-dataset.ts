// src/ai/flows/analyze-dataset.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing datasets.
 *
 * - analyzeDataset - A function that takes a dataset as input and returns a summary of descriptive statistics.
 * - AnalyzeDatasetInput - The input type for the analyzeDataset function.
 * - AnalyzeDatasetOutput - The return type for the analyzeDataset function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeDatasetInputSchema = z.object({
  dataset: z
    .string()
    .describe('The dataset to analyze, in CSV, Excel, PDF, or TXT format.'),
});
export type AnalyzeDatasetInput = z.infer<typeof AnalyzeDatasetInputSchema>;

const AnalyzeDatasetOutputSchema = z.object({
  summary: z.string().describe('A summary of descriptive statistics for the dataset.'),
});
export type AnalyzeDatasetOutput = z.infer<typeof AnalyzeDatasetOutputSchema>;

export async function analyzeDataset(input: AnalyzeDatasetInput): Promise<AnalyzeDatasetOutput> {
  return analyzeDatasetFlow(input);
}

const analyzeDatasetPrompt = ai.definePrompt({
  name: 'analyzeDatasetPrompt',
  input: {schema: AnalyzeDatasetInputSchema},
  output: {schema: AnalyzeDatasetOutputSchema},
  prompt: `You are an expert data analyst. Please analyze the following dataset and provide a summary of descriptive statistics, highlighting key characteristics and potential insights.

Dataset:
{{dataset}}`,
});

const analyzeDatasetFlow = ai.defineFlow(
  {
    name: 'analyzeDatasetFlow',
    inputSchema: AnalyzeDatasetInputSchema,
    outputSchema: AnalyzeDatasetOutputSchema,
  },
  async input => {
    const {output} = await analyzeDatasetPrompt(input);
    return output!;
  }
);
