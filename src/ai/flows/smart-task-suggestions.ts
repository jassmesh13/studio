'use server';

/**
 * @fileOverview An AI agent to suggest relevant learning activities based on past performance.
 *
 * - suggestTasks - A function that suggests learning activities.
 * - SmartTaskSuggestionsInput - The input type for the suggestTasks function.
 * - SmartTaskSuggestionsOutput - The return type for the suggestTasks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartTaskSuggestionsInputSchema = z.object({
  studentId: z.string().describe('The unique identifier of the student.'),
  pastPerformanceData: z.string().describe('The student’s past performance data in JSON format, including scores, time spent on each task, and areas of difficulty.'),
  availableActivities: z.string().describe('A JSON array of available learning activities with descriptions.'),
});
export type SmartTaskSuggestionsInput = z.infer<typeof SmartTaskSuggestionsInputSchema>;

const SmartTaskSuggestionsOutputSchema = z.object({
  suggestedActivities: z.array(z.string()).describe('An array of suggested learning activities tailored to the student’s needs.'),
  reasoning: z.string().describe('Explanation of why the suggested activities were recommended.'),
});
export type SmartTaskSuggestionsOutput = z.infer<typeof SmartTaskSuggestionsOutputSchema>;

export async function suggestTasks(input: SmartTaskSuggestionsInput): Promise<SmartTaskSuggestionsOutput> {
  return smartTaskSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartTaskSuggestionsPrompt',
  input: {schema: SmartTaskSuggestionsInputSchema},
  output: {schema: SmartTaskSuggestionsOutputSchema},
  prompt: `You are an AI learning assistant. Analyze the student's past performance data and suggest relevant learning activities to improve their understanding.

Student ID: {{{studentId}}}
Past Performance Data: {{{pastPerformanceData}}}
Available Activities: {{{availableActivities}}}

Based on the data provided, suggest activities that target the student's weaknesses and build on their strengths.
Explain why you are suggesting each activity.

Format your response as a JSON object with 'suggestedActivities' (an array of activity names) and 'reasoning' (explanation for the suggestions).`,
});

const smartTaskSuggestionsFlow = ai.defineFlow(
  {
    name: 'smartTaskSuggestionsFlow',
    inputSchema: SmartTaskSuggestionsInputSchema,
    outputSchema: SmartTaskSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
