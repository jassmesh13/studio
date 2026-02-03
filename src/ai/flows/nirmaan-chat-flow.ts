'use server';

/**
 * @fileOverview Nirmaan Bot - A friendly AI companion for kids.
 * This flow is optimized for real-time conversation by generating both TEXT and AUDIO
 * in a single multimodal pass using Gemini 2.5 Flash.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import wav from 'wav';

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

const NirmaanChatOutputSchema = z.object({
  text: z.string(),
  audioUri: z.string().optional(),
});

export type NirmaanChatInput = z.infer<typeof NirmaanChatInputSchema>;
export type NirmaanChatOutput = z.infer<typeof NirmaanChatOutputSchema>;

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

/* --------------------------- WAV Helper ---------------------------- */

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', (d) => bufs.push(d));
    writer.on('end', () => {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

/* ------------------------------ Flow -------------------------------- */

const nirmaanChatFlow = ai.defineFlow(
  {
    name: 'nirmaanChatFlow',
    inputSchema: NirmaanChatInputSchema,
    outputSchema: NirmaanChatOutputSchema,
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

    console.time('MultimodalGeneration');
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
          responseModalities: ['TEXT', 'AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Algenib' },
            },
          },
        },
      });

      const text = response.text;
      const audioPart = response.media;
      
      let audioUri = undefined;
      if (audioPart && audioPart.url) {
        const audioBuffer = Buffer.from(
          audioPart.url.substring(audioPart.url.indexOf(',') + 1),
          'base64'
        );
        const wavBase64 = await toWav(audioBuffer);
        audioUri = 'data:audio/wav;base64,' + wavBase64;
      }

      console.timeEnd('MultimodalGeneration');
      return { text, audioUri };
    } catch (error) {
      console.error('--- Nirmaan Chat ERROR ---', error);
      throw error;
    }
  }
);

export async function chatWithNirmaan(
  input: NirmaanChatInput
): Promise<NirmaanChatOutput> {
  return nirmaanChatFlow(input);
}
