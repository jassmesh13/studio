'use server';

/**
 * @fileOverview Nirmaan Bot - A friendly AI companion using Gemini 2.5 Flash.
 *
 * - chatWithNirmaan - Main function for chat interaction.
 * - NirmaanChatInput - Input schema for chat.
 * - NirmaanChatOutput - Output type (string).
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

1. Be simple, short, and use emojis. 🤩 ✨
2. Always end with a fun question.
3. If they make an English mistake, gently repeat it back correctly in your reply.
4. If this is the start of the conversation, say: "Hi there! I'm Nirmaan. I love making new friends! What's your name?"
`;

const nirmaanChatFlow = ai.defineFlow(
  {
    name: 'nirmaanChatFlow',
    inputSchema: NirmaanChatInputSchema,
    outputSchema: z.string(),
  },
  async ({ history, message }) => {
    // Robust history cleaning for Gemini API requirements
    const safeHistory = (history || [])
      .filter(m => m && (m.role === 'user' || m.role === 'model') && m.content?.length > 0)
      .map(m => ({
        role: m.role,
        content: m.content.map(p => ({ text: p.text || "" })).filter(p => p.text.length > 0)
      }))
      .filter(m => m.content.length > 0);

    const promptText = message?.trim() || "Hi! I'm ready to chat.";

    const response = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      system: systemPrompt,
      history: safeHistory,
      prompt: promptText,
    });

    // Genkit 1.x uses .text property, not .text() function
    return response.text;
  }
);

export async function chatWithNirmaan(
  input: NirmaanChatInput
): Promise<NirmaanChatOutput> {
  return await nirmaanChatFlow(input);
}
