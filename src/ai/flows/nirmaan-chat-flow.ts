'use server';

/**
 * @fileOverview Nirmaan Bot - A friendly AI companion using Gemini 2.5 Flash.
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

const systemPrompt = `You are Nirmaan Bot, a very friendly, playful, and curious AI friend for a child in Grade 2 or 3. 

Your goal is to help them practice English. 

1. Start with: "Hi there! I'm Nirmaan. I love making new friends! What's your name?"
2. Be simple, short, and use emojis. 🤩 ✨
3. Always end with a fun question.
4. If they make an English mistake, gently repeat it back correctly in your reply.
`;

const nirmaanChatFlow = ai.defineFlow(
  {
    name: 'nirmaanChatFlow',
    inputSchema: NirmaanChatInputSchema,
    outputSchema: z.string(),
  },
  async ({ history, message }) => {
    const safeHistory = (history || [])
      .filter(m => m && (m.role === 'user' || m.role === 'model'))
      .map(m => ({
        role: m.role,
        content: m.content.map(p => ({ text: p.text }))
      }));

    const promptText = message?.trim() || "Hi! I just joined the chat.";

    const response = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      system: systemPrompt,
      history: safeHistory,
      prompt: promptText,
    });

    return response.text;
  }
);

export async function chatWithNirmaan(
  input: NirmaanChatInput
): Promise<NirmaanChatOutput> {
  return await nirmaanChatFlow(input);
}
