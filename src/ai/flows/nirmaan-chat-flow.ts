'use server';

/**
 * @fileOverview Nirmaan Bot - A friendly AI companion for kids
 * 
 * - chatWithNirmaan - Main entry point for the chat flow.
 * - NirmaanChatInput - Input schema for chat history and new message.
 * - NirmaanChatOutput - String response from the bot.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

/* ----------------------------- Schemas ----------------------------- */

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

/* --------------------------- System Prompt -------------------------- */

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

/* ------------------------------ Flow -------------------------------- */

const nirmaanChatFlow = ai.defineFlow(
  {
    name: 'nirmaanChatFlow',
    inputSchema: NirmaanChatInputSchema,
    outputSchema: z.string(),
  },
  async ({ history, message }) => {
    // Clean + validate history for Gemini 2.5 Flash
    const safeHistory = (history ?? [])
      .filter(
        (m) =>
          m &&
          (m.role === 'user' || m.role === 'model') &&
          Array.isArray(m.content)
      )
      .map((m) => ({
        role: m.role,
        content: m.content
          .map((p) => ({ text: p.text ?? '' }))
          .filter((p) => p.text.length > 0),
      }))
      .filter((m) => m.content.length > 0);

    const promptText =
      message?.trim() || "Hi! I'm ready to chat.";

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

    // In Genkit 1.x, .text is a property, not a function
    return response.text;
  }
);

/* ---------------------------- Export -------------------------------- */

export async function chatWithNirmaan(
  input: NirmaanChatInput
): Promise<NirmaanChatOutput> {
  return nirmaanChatFlow(input);
}
