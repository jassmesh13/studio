'use client';

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Heart, Star, Loader2, PartyPopper, Sparkles, Volume2 } from "lucide-react";
import { generateCaseStudyFeedback, type CaseStudyFeedbackOutput } from "@/ai/flows/case-study-feedback-flow";
import { generateSpeech } from "@/ai/flows/tts-flow";
import type { CaseStudy } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PostSubmissionScreenProps {
    userName: string;
    onDone: () => void;
    caseStudy: CaseStudy;
    userAnswer: string;
    recordedMediaURL?: string | null;
    selectedOptionId?: string | null;
}

/**
 * Utility to extract audio track from a video blob and return a WAV blob.
 * This ensures we only send audio to the AI, reducing processing costs.
 */
async function extractAudioFromVideo(videoBlob: Blob): Promise<Blob> {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const arrayBuffer = await videoBlob.arrayBuffer();
    
    try {
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        // Simple WAV encoding logic
        const numOfChan = audioBuffer.numberOfChannels;
        const length = audioBuffer.length * numOfChan * 2 + 44;
        const buffer = new ArrayBuffer(length);
        const view = new DataView(buffer);
        const channels = [];
        let offset = 0;
        let pos = 0;

        const setUint16 = (data: number) => { view.setUint16(pos, data, true); pos += 2; };
        const setUint32 = (data: number) => { view.setUint32(pos, data, true); pos += 4; };

        // RIFF header
        setUint32(0x46464952); setUint32(length - 8); setUint32(0x45564157);
        // fmt chunk
        setUint32(0x20746d66); setUint32(16); setUint16(1); setUint16(numOfChan);
        setUint32(audioBuffer.sampleRate); setUint32(audioBuffer.sampleRate * 2 * numOfChan);
        setUint16(numOfChan * 2); setUint16(16); 
        // data chunk
        setUint32(0x61746164); setUint32(length - pos - 4);

        for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
            channels.push(audioBuffer.getChannelData(i));
        }

        while (pos < length) {
            for (let i = 0; i < numOfChan; i++) {
                let sample = Math.max(-1, Math.min(1, channels[i][offset]));
                sample = (sample < 0 ? sample * 0x8000 : sample * 0x7FFF);
                view.setInt16(pos, sample, true);
                pos += 2;
            }
            offset++;
        }
        
        return new Blob([buffer], { type: "audio/wav" });
    } catch (e) {
        console.error("Audio extraction failed, falling back to original blob:", e);
        return videoBlob;
    } finally {
        await audioContext.close();
    }
}

export function PostSubmissionScreen({ userName, onDone, caseStudy, userAnswer, recordedMediaURL, selectedOptionId }: PostSubmissionScreenProps) {
    const [feedback, setFeedback] = useState<CaseStudyFeedbackOutput | null>(null);
    const [loading, setLoading] = useState(true);
    const [showCelebration, setShowCelebration] = useState(false);
    const [ttsAudioUri, setTtsAudioUri] = useState<string | null>(null);
    const [isSpeaking, setIsSpeaking] = useState(false);
    
    const fetchInProgress = useRef(false);
    const hasFetched = useRef(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });

        async function fetchFeedback() {
            if (fetchInProgress.current || hasFetched.current) return;
            
            fetchInProgress.current = true;
            setLoading(true);
            try {
                let mediaDataUri = undefined;
                
                if (recordedMediaURL) {
                    try {
                        const response = await fetch(recordedMediaURL);
                        let blob = await response.blob();
                        
                        if (blob.type.startsWith('video/')) {
                            console.log("Processing: Extracting audio track from video...");
                            blob = await extractAudioFromVideo(blob);
                        }
                        
                        if (blob.size < 20 * 1024 * 1024) { 
                            mediaDataUri = await new Promise<string>((resolve, reject) => {
                                const reader = new FileReader();
                                reader.onloadend = () => resolve(reader.result as string);
                                reader.onerror = reject;
                                reader.readAsDataURL(blob);
                            });
                        }
                    } catch (err) {
                        console.error("Failed to process media for AI:", err);
                    }
                }

                const result = await generateCaseStudyFeedback({
                    scenario: caseStudy.content?.scenario || "",
                    question: caseStudy.content?.prompt || "",
                    userAnswer: userAnswer,
                    answerType: caseStudy.type as 'text' | 'audio' | 'video' | 'mcq',
                    mediaDataUri: mediaDataUri,
                    hasMedia: !!mediaDataUri
                });
                
                setFeedback(result);
                setShowCelebration(true);
                hasFetched.current = true;

                // Generate TTS for growth insight
                if (result.growthInsight) {
                  try {
                    const { audioUri } = await generateSpeech({ text: result.growthInsight });
                    setTtsAudioUri(audioUri);
                  } catch (ttsErr) {
                    console.error("TTS generation failed", ttsErr);
                  }
                }

            } catch (error) {
                console.error("Failed to generate AI feedback:", error);
                const fallbackFeedback: CaseStudyFeedbackOutput = {
                    analysis: "Thank you for sharing your thoughts! Every decision helps you learn more about who you want to be.",
                    growthInsight: "Keep thinking about how your actions affect others and yourself.",
                    skillBoosted: "Decision-Making"
                };
                setFeedback(fallbackFeedback);
                setShowCelebration(true);

                // Fallback TTS
                try {
                  const { audioUri } = await generateSpeech({ text: fallbackFeedback.growthInsight });
                  setTtsAudioUri(audioUri);
                } catch (ttsErr) {
                   console.error("TTS generation failed", ttsErr);
                }
            } finally {
                setLoading(false);
                fetchInProgress.current = false;
            }
        }

        if (userAnswer && !hasFetched.current) {
            fetchFeedback();
        }
    }, [caseStudy, userAnswer, recordedMediaURL]);

    const playTts = () => {
      if (audioRef.current && ttsAudioUri) {
        setIsSpeaking(true);
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(e => {
          console.warn("TTS Play blocked", e);
          setIsSpeaking(false);
        });
      }
    };

    let headerText = `Well done, ${userName}!`;
    if (caseStudy.type === 'mcq' && selectedOptionId) {
        const mcq = caseStudy.mcqs?.[0];
        if (mcq && mcq.correctOptionId) {
            if (selectedOptionId === mcq.correctOptionId) {
                headerText = `Correct answer, ${userName}!`;
            } else {
                headerText = `That's not quite right, ${userName}!`;
            }
        }
    }

    return (
        <div className="w-full max-w-lg mx-auto text-center px-4 pt-8">
            {ttsAudioUri && (
                <audio 
                  ref={audioRef} 
                  src={ttsAudioUri} 
                  autoPlay 
                  onPlay={() => setIsSpeaking(true)}
                  onEnded={() => setIsSpeaking(false)}
                  className="hidden" 
                />
            )}
            
            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 text-center gap-6 animate-in fade-in duration-500">
                    <div className="relative">
                        <Loader2 className="w-20 h-20 animate-spin text-primary" />
                    </div>
                    <h2 className="text-2xl font-black text-primary">Nirmaan is thinking...</h2>
                    <p className="text-base text-muted-foreground font-bold italic">Analyzing your wonderful answer! ✨</p>
                </div>
            ) : (
                <div className={cn(
                    "space-y-6 transition-all duration-1000",
                    showCelebration ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                )}>
                    <div className="mb-8 transform transition-all duration-700 ease-out">
                        <div className="relative inline-block mb-4">
                            <PartyPopper className="absolute -left-12 top-0 w-10 h-10 text-primary animate-bounce" />
                            <PartyPopper className="absolute -right-12 top-0 w-10 h-10 text-primary animate-bounce [animation-delay:0.2s] scale-x-[-1]" />
                            <Sparkles className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-8 text-yellow-400 animate-pulse" />
                            
                            <h2 className="text-4xl md:text-5xl font-extrabold text-primary drop-shadow-sm tracking-tight animate-pop-in">
                                {headerText}
                            </h2>
                        </div>
                        <p className="text-lg text-muted-foreground font-black max-w-sm mx-auto">
                            You shared your thoughts beautifully. Every answer makes you a better leader! 🌟
                        </p>
                    </div>

                    <Card className="text-left bg-white shadow-xl border-primary/10 overflow-hidden">
                        <CardHeader className="bg-primary/5 pb-4">
                            <CardTitle className="flex items-center gap-2 text-primary text-2xl font-black">
                                <Brain className="w-7 h-7" />
                                Nirmaan's Thoughts
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 text-lg leading-relaxed text-foreground font-black">
                            <p>{feedback?.analysis}</p>
                        </CardContent>
                    </Card>

                    <Card className="text-left bg-white shadow-xl border-red-100 overflow-hidden">
                        <CardHeader className="bg-red-50/50 pb-4 flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2 text-red-500 text-2xl font-black">
                                <Heart className="w-7 h-7 fill-red-500" />
                                Growth Insight
                            </CardTitle>
                            {ttsAudioUri && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={playTts}
                                className={cn("rounded-full", isSpeaking && "text-red-500 animate-pulse")}
                              >
                                <Volume2 className="w-6 h-6" />
                              </Button>
                            )}
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="bg-accent/50 p-5 rounded-2xl border-2 border-dashed border-primary/20 relative group">
                                <p className="font-black italic text-primary text-lg">"{feedback?.growthInsight}"</p>
                                {isSpeaking && (
                                  <div className="absolute -bottom-2 -right-2 bg-primary text-white p-1 rounded-full shadow-lg">
                                    <Volume2 className="w-4 h-4 animate-ping" />
                                  </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                    
                    {feedback?.skillBoosted && (
                        <div className="bg-primary p-6 rounded-3xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                            <div className="flex flex-col items-center gap-2">
                                <div className="flex items-center gap-2">
                                    <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                                    <h3 className="font-black text-white text-lg uppercase tracking-wider">Skill Boost!</h3>
                                    <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                                </div>
                                <div className="bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full border border-white/30">
                                    <span className="font-black text-2xl text-white">
                                        {feedback.skillBoosted} <span className="ml-1 text-yellow-300 font-bold">+10</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    <Button 
                        size="lg" 
                        onClick={onDone} 
                        className="w-full h-16 rounded-full text-xl font-bold shadow-xl hover:shadow-primary/30 active:scale-95 transition-all mt-4"
                    >
                        Back to Dashboard
                    </Button>
                </div>
            )}
        </div>
    );
}