'use server';

/**
 * @fileOverview Text-to-Speech Flow using Gemini 2.5 Flash TTS.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import wav from 'wav';

const TTSInputSchema = z.object({
  text: z.string().describe('The text to convert to speech.'),
});

const TTSOutputSchema = z.object({
  audioUri: z.string().describe('The generated audio as a data URI.'),
});

export type TTSInput = z.infer<typeof TTSInputSchema>;
export type TTSOutput = z.infer<typeof TTSOutputSchema>;

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
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const ttsFlow = ai.defineFlow(
  {
    name: 'ttsFlow',
    inputSchema: TTSInputSchema,
    outputSchema: TTSOutputSchema,
  },
  async (input) => {
    console.log('--- TTS Generation Start ---');
    console.log('Text to synthesize:', input.text.substring(0, 50) + '...');
    
    try {
      const { media } = await ai.generate({
        model: googleAI.model('gemini-2.5-flash-preview-tts'),
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Algenib' }, // A soothing voice
            },
          },
        },
        prompt: input.text,
      });

      if (!media || !media.url) {
        throw new Error('No audio media returned from TTS model');
      }

      const audioBuffer = Buffer.from(
        media.url.substring(media.url.indexOf(',') + 1),
        'base64'
      );
      
      const wavBase64 = await toWav(audioBuffer);
      console.log('--- TTS Generation Success ---');
      
      return {
        audioUri: 'data:audio/wav;base64,' + wavBase64,
      };
    } catch (error) {
      console.error('--- TTS Generation ERROR ---');
      console.error(error);
      throw error;
    }
  }
);

export async function generateSpeech(input: TTSInput): Promise<TTSOutput> {
  return await ttsFlow(input);
}
