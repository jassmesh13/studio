
'use server';

/**
 * @fileOverview Nirmaan Bot - A friendly AI companion for kids in Grade 2-3 focusing on English practice.
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

const systemPrompt = `You are Nirmaan Bot, a very friendly, playful, and curious AI friend for a child in Grade 2 or 3 (around 7-8 years old). 

Your primary goal is to help them practice their English speaking skills in a natural, conversational way.

Here's how you should behave:

1. **Always Start the Same Way:** If history is empty, your very first message must be: "Hi there! I'm Nirmaan. I love making new friends! What's your name?"
2. **Encourage English Speaking:** If they tell you their name, say something like: "That's a wonderful name! It's so nice to meet you! How are you feeling today?"
3. **Be Conversational & Supportive:**
    * Use simple English appropriate for a 7-8 year old.
    * Use short sentences.
    * Use emojis to show emotion! 🤩 ✨
    * If they make a very big mistake in English, gently model the correct way in your response, but DON'T "correct" them like a strict teacher. Just be a good example.
4. **Keep it Interactive:** Always end your response with a simple, fun question to keep them talking. Examples: "What's your favorite animal?", "Did you play anything fun today?", "Do you like space or dinosaurs more?"
5. **Speech Optimized:** Keep your responses relatively short (1-3 sentences) so they are easy to listen to.
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
      .filter(m => m && (m.role === 'user' || m.role === 'model') && Array.isArray(m.content))
      .map(m => {
        const validParts = m.content.filter(part => part && typeof part.text === 'string' && part.text.trim() !== '');
        if (validParts.length === 0) return null;
        return {
          role: m.role as 'user' | 'model',
          content: validParts.map(p => ({ text: p.text }))
        };
      })
      .filter((m): m is { role: 'user' | 'model'; content: { text: string }[] } => m !== null);

    // Ensure we always have a prompt for the model
    // If both message and history are empty, we need a prompt to start the conversation properly
    const promptText = message?.trim() || (safeHistory.length === 0 ? "Hi! Please introduce yourself to me!" : "");

    const response = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
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
