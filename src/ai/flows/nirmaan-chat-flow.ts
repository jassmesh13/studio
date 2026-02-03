'use server';

/**
 * @fileOverview Nirmaan Bot - A friendly AI companion.
 * Returns only TEXT for low-latency visual feedback.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.array(
    z.object({
      text: z.string(),
    })
  ),
});

const NirmaanChatInputSchema = z.object({
  history: z.array(MessageSchema).optional().default([]),
  message: z.string().optional(),
});

export type NirmaanChatInput = z.infer<typeof NirmaanChatInputSchema>;
export type NirmaanChatOutput = string;

const systemPrompt = `You are Nirmaan Bot, a very friendly, playful, and curious AI friend for a child in Grade 2 or 3.

Your goal is to help them practice English.

Rules:
1. Be simple, short, and friendly.
2. Use emojis sometimes 🤩✨
3. Always end with a fun question.
4. If the child makes an English mistake, gently repeat it back correctly in your reply.
5. If this is the start of the conversation, say:
   "Hi there! I'm Nirmaan. I love making new friends! What's your name?"
`;

const nirmaanChatFlow = ai.defineFlow(
  {
    name: 'nirmaanChatFlow',
    inputSchema: NirmaanChatInputSchema,
    outputSchema: z.string(),
  },
  async ({ history, message }) => {
    // Clean + validate history
    const safeHistory = (history ?? [])
      .filter((m) => m && (m.role === 'user' || m.role === 'model'))
      .map((m) => ({
        role: m.role,
        content: m.content.map((p) => ({ text: p.text })),
      }));

    const promptText = message?.trim() || "Hi! I'm ready to chat.";

    console.log('--- Nirmaan Chat Request ---');
    console.log('User Input:', promptText);
    
    try {
      const response = await ai.generate({
        model: 'googleai/gemini-2.5-flash',
        messages: [
          { role: 'system', content: [{ text: systemPrompt }] },
          ...safeHistory,
          { role: 'user', content: [{ text: promptText }] },
        ],
        config: {
          temperature: 0.7,
          maxOutputTokens: 250,
        },
      });

      console.log('Nirmaan Response:', response.text);
      console.log('---------------------------');
      
      return response.text;
    } catch (error) {
      console.error('--- Nirmaan Chat ERROR ---');
      console.error(error);
      throw error;
    }
  }
);

export async function chatWithNirmaan(
  input: NirmaanChatInput
): Promise<NirmaanChatOutput> {
  return nirmaanChatFlow(input);
}
