'use server';

/**
 * @fileOverview Case Study Feedback Flow - Provides AI feedback for student responses.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CaseStudyFeedbackInputSchema = z.object({
  scenario: z.string(),
  question: z.string(),
  userAnswer: z.string().describe('The user answer. If it is audio/video, it will be a data URI.'),
  answerType: z.enum(['text', 'audio', 'video']),
});

export type CaseStudyFeedbackInput = z.infer<typeof CaseStudyFeedbackInputSchema>;

const CaseStudyFeedbackOutputSchema = z.object({
  analysis: z.string().describe('A friendly analysis of the user\'s choice/answer.'),
  growthInsight: z.string().describe('A helpful insight on how to grow from this situation.'),
  skillBoosted: z.string().describe('The name of the skill that was boosted (e.g. Honesty, Empathy).'),
});

export type CaseStudyFeedbackOutput = z.infer<typeof CaseStudyFeedbackOutputSchema>;

// Input schema for the prompt including the pre-calculated isMedia flag
const CaseStudyPromptInputSchema = CaseStudyFeedbackInputSchema.extend({
  isMedia: z.boolean(),
});

const feedbackPrompt = ai.definePrompt({
  name: 'caseStudyFeedbackPrompt',
  model: 'googleai/gemini-2.5-flash',
  input: { schema: CaseStudyPromptInputSchema },
  output: { schema: CaseStudyFeedbackOutputSchema },
  prompt: `
    You are Nirmaan, a friendly and wise mentor for kids (Grade 2-6).
    A student has just completed a case study. 
    
    Scenario: {{{scenario}}}
    Question: {{{question}}}
    Answer Type: {{{answerType}}}
    
    {{#if isMedia}}
    The user provided a recorded response: {{media url=userAnswer}}
    {{else}}
    User's Answer: {{{userAnswer}}}
    {{/if}}

    Please provide feedback that is:
    1. Encouraging and positive.
    2. Explains the values behind their choice (like kindness, honesty, etc.).
    3. Provides a "Growth Insight" on how to handle similar situations in the future.
    4. Identifies ONE primary skill boosted (e.g., Empathy, Decision-Making, Honesty, Responsibility).
    
    Keep the tone playful, supportive, and appropriate for a child.
  `,
});

const caseStudyFeedbackFlow = ai.defineFlow(
  {
    name: 'caseStudyFeedbackFlow',
    inputSchema: CaseStudyFeedbackInputSchema,
    outputSchema: CaseStudyFeedbackOutputSchema,
  },
  async (input) => {
    const isMedia = input.answerType === 'audio' || input.answerType === 'video';
    const { output } = await feedbackPrompt({ ...input, isMedia });
    return output!;
  }
);

export async function generateCaseStudyFeedback(input: CaseStudyFeedbackInput): Promise<CaseStudyFeedbackOutput> {
  return await caseStudyFeedbackFlow(input);
}
