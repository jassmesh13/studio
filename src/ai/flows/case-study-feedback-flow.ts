'use server';

/**
 * @fileOverview Case Study Feedback Flow - Provides AI feedback for student responses using Gemini 2.5 Flash.
 * Optimized to handle audio-only analysis for both video and audio submissions.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const CaseStudyFeedbackInputSchema = z.object({
  scenario: z.string(),
  question: z.string(),
  userAnswer: z.string().optional().describe('The student\'s answer text or transcript.'),
  answerType: z.enum(['text', 'audio', 'video', 'mcq']),
  mediaDataUri: z.string().optional().describe('The recorded audio track as a data URI.'),
  hasMedia: z.boolean().optional().default(false).describe('Flag indicating if media is provided.'),
});

export type CaseStudyFeedbackInput = z.infer<typeof CaseStudyFeedbackInputSchema>;

const CaseStudyFeedbackOutputSchema = z.object({
  analysis: z.string().describe('A friendly analysis of the user\'s choice/answer.'),
  growthInsight: z.string().describe('A helpful insight on how to grow from this situation.'),
  skillBoosted: z.string().describe('The name of the skill that was boosted.'),
});

export type CaseStudyFeedbackOutput = z.infer<typeof CaseStudyFeedbackOutputSchema>;

const feedbackPrompt = ai.definePrompt({
  name: 'caseStudyFeedbackPrompt',
  model: 'googleai/gemini-2.5-flash',
  input: { schema: CaseStudyFeedbackInputSchema },
  output: { schema: CaseStudyFeedbackOutputSchema },
  prompt: `
    You are Nirmaan, a friendly and wise teacher for kids (Grade 1-3).
    A student has just completed a case study. 
    
    Scenario: {{{scenario}}}
    Question: {{{question}}}
    Answer Type: {{{answerType}}}

    {{#if hasMedia}}
    The student has provided a recorded audio response. Please evaluate the student's spoken performance (tone, confidence, and clarity) along with the transcript.
    Student Response Audio: {{media url=mediaDataUri}}
    {{/if}}

    Student's Transcript/Answer: {{{userAnswer}}}

    Please provide feedback that is:
    1. Encouraging and positive.
    2. Explains the values behind their choice (like kindness, honesty, etc.).
    3. Identifies ONE primary skill boosted (e.g., Empathy, Decision-Making, Honesty, Responsibility, etc.).
    4. VERY IMPORTANT: Keep the 'analysis' field summary short, exactly between 20-25 words.
    5. Growth Insight (1 line ONLY): 
   - Clearly tell the student how they can improve their answer next time.
   - Use simple, child-friendly language.
    6. Feedback must reinforce age-appropriate behavior: 
   young children should seek help from teachers or adults instead of acting independently.

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
    console.log('--- Case Study Feedback Request ---');
    console.log('Answer Type:', input.answerType);
    console.log('Has Media:', input.hasMedia);
    console.log('Student Answer/Transcript:', input.userAnswer);

    try {
        const { output } = await feedbackPrompt(input);
        console.log('--- Case Study Feedback Success ---');
        console.log('Analysis:', output?.analysis);
        console.log('Boosted Skill:', output?.skillBoosted);
        console.log('------------------------------------');
        return output!;
    } catch (error) {
        console.error('--- Case Study Feedback ERROR ---');
        console.error(error);
        throw error;
    }
  }
);

export async function generateCaseStudyFeedback(input: CaseStudyFeedbackInput): Promise<CaseStudyFeedbackOutput> {
  return await caseStudyFeedbackFlow(input);
}
