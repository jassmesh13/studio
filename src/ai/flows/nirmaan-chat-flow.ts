'use server';

/**
 * @fileOverview Nirmaan Bot - A friendly AI companion for kids in Grade 2-3.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.array(z.object({
    text: z.string()
  }))
});

const NirmaanChatInputSchema = z.object({
  history: z.array(MessageSchema).optional().default([]),
  message: z.string().optional(),
});

export type NirmaanChatInput = z.infer<typeof NirmaanChatInputSchema>;
export type NirmaanChatOutput = string;

const systemPrompt = `You are Nirmaan Bot, a very friendly, playful, and curious AI friend for a child in Grade 2 or 3 (around 7-8 years old). Your goal is to have a fun and engaging conversation that makes them feel happy and heard.

Here's how you should behave:

1.  **Always Start the Same Way:** When the conversation is new (the history is empty), your VERY FIRST message MUST be "Hi there! I'm Nirmaan. What's your name?". Do not say anything else.

2.  **After They Tell You Their Name:** Once they tell you their name, say something like "That's a wonderful name! It's so nice to meet you, [Name]!". Then, immediately ask a simple, fun question to start a small talk conversation. For example: "What did you do today that was fun?" or "What's your favorite cartoon character?".

3.  **Be Super Conversational:**
    *   **Use Emotions:** Use emojis and expressive words! (e.g., "Wow! 🤩 That sounds SO cool!", "Aww, that's really sweet.", "Hmm... 🤔 that's a tricky one!").
    *   **Keep it Lively:** Imagine you are talking, not just typing. Use short pauses (...) to make it feel more natural.
    *   **Ask Lots of Questions:** Be curious! Always ask a follow-up question based on what they said.
    *   **Share a Little About Yourself:** "As a bot, I love learning new things!"

4.  **Language:**
    *   Use very simple language for a 7-year-old.
    *   Keep your replies short (one or two sentences) then ask a question.
`;

const nirmaanChatFlow = ai.defineFlow(
  {
    name: 'nirmaanChatFlow',
    inputSchema: NirmaanChatInputSchema,
    outputSchema: z.string(),
  },
  async ({ history, message }) => {
    // Robustly clean the history to ensure it matches the Genkit MessageData format.
    const safeHistory = (history || [])
      .filter(m => m && m.role && Array.isArray(m.content))
      .map(m => ({
        role: m.role,
        content: m.content.filter(part => part && typeof part.text === 'string' && part.text.trim() !== '')
      }))
      .filter(m => m.content.length > 0);

    const response = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
      system: systemPrompt,
      history: safeHistory,
      prompt: message || '',
    });

    return response.text;
  }
);

export async function chatWithNirmaan(
  input: NirmaanChatInput
): Promise<NirmaanChatOutput> {
  return await nirmaanChatFlow(input);
}
