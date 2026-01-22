'use server';
/**
 * @fileOverview A Text-to-Speech flow.
 *
 * - textToSpeech - A function that converts text to speech.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import wav from 'wav';

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

    const bufs: any[] = [];
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
    inputSchema: z.string(),
    outputSchema: z.string(), // data URI
  },
  async (text) => {
    const { media } = await ai.generate({
      model: 'gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' }, // Using a soothing female voice example
          },
        },
      },
      prompt: text,
    });

    if (!media) {
      throw new Error('No media returned from TTS model');
    }

    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );

    const wavBase64 = await toWav(audioBuffer);
    return `data:audio/wav;base64,${wavBase64}`;
  }
);

export async function textToSpeech(text: string): Promise<string> {
  return await ttsFlow(text);
}
