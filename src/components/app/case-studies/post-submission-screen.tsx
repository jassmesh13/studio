'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Heart, Star, Loader2 } from "lucide-react";
import { generateCaseStudyFeedback, type CaseStudyFeedbackOutput } from "@/ai/flows/case-study-feedback-flow";
import type { CaseStudy } from "@/lib/types";

interface PostSubmissionScreenProps {
    userName: string;
    onDone: () => void;
    caseStudy: CaseStudy;
    userAnswer: string;
    recordedMediaURL?: string | null;
}

export function PostSubmissionScreen({ userName, onDone, caseStudy, userAnswer, recordedMediaURL }: PostSubmissionScreenProps) {
    const [feedback, setFeedback] = useState<CaseStudyFeedbackOutput | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchFeedback() {
            setLoading(true);
            try {
                let mediaDataUri = undefined;
                
                // Convert blob URL to base64 Data URI for the AI model to "hear" the audio
                if (recordedMediaURL) {
                    try {
                        const response = await fetch(recordedMediaURL);
                        const blob = await response.blob();
                        
                        // Limit size to avoid server action and quota limits
                        if (blob.size < 5 * 1024 * 1024) { 
                            mediaDataUri = await new Promise<string>((resolve, reject) => {
                                const reader = new FileReader();
                                reader.onloadend = () => resolve(reader.result as string);
                                reader.onerror = reject;
                                reader.readAsDataURL(blob);
                            });
                        } else {
                            console.warn("Media file too large, sending transcript only.");
                        }
                    } catch (err) {
                        console.error("Failed to convert media to data URI:", err);
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
            } catch (error) {
                console.error("Failed to generate AI feedback:", error);
                setFeedback({
                    analysis: "Thank you for sharing your thoughts! Every decision helps you learn more about who you want to be.",
                    growthInsight: "Keep thinking about how your actions affect others and yourself.",
                    skillBoosted: "Decision-Making"
                });
            } finally {
                setLoading(false);
            }
        }

        fetchFeedback();
    }, [caseStudy, userAnswer, recordedMediaURL]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <h2 className="text-2xl font-bold text-primary">Nirmaan is thinking...</h2>
                <p className="text-muted-foreground">Wait a moment while I listen to your wonderful answer! ✨</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto text-center animate-pop-in">
            <div className="mb-6">
                <div className="relative inline-block">
                    <Star className="absolute -top-4 -left-4 w-8 h-8 text-yellow-400 animate-pulse fill-yellow-400" />
                    <Star className="absolute -bottom-4 -right-4 w-8 h-8 text-yellow-400 animate-pulse delay-200 fill-yellow-400" />
                    <h2 className="text-3xl font-bold text-primary">Well done, {userName}!</h2>
                </div>
                <p className="text-muted-foreground mt-2">
                    You took time to think and express your thoughts. That shows great maturity!
                </p>
            </div>

            <Card className="mb-6 text-left bg-card shadow-lg border-primary/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Brain className="w-6 h-6 text-primary" />
                        Nirmaan's Thoughts
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm leading-relaxed">
                    <p>{feedback?.analysis}</p>
                </CardContent>
            </Card>

            <Card className="mb-6 text-left bg-card shadow-lg border-red-100">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Heart className="w-6 h-6 text-red-500" />
                        Growth Insight
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm leading-relaxed">
                    <div className="bg-accent p-4 rounded-xl border border-dashed border-primary/30">
                        <p className="font-semibold italic text-primary">"{feedback?.growthInsight}"</p>
                    </div>
                </CardContent>
            </Card>
            
            {feedback?.skillBoosted && (
                <div className="bg-primary/10 border-2 border-dashed border-primary/20 p-4 rounded-xl mb-8">
                    <h3 className="font-bold text-primary mb-2">Skill Boost!</h3>
                    <div className="flex justify-around items-center">
                        <div className="font-bold text-lg text-primary-foreground bg-primary px-4 py-1 rounded-full shadow-sm">
                            {feedback.skillBoosted} <span className="text-white">+1</span>
                        </div>
                    </div>
                </div>
            )}

            <Button size="lg" onClick={onDone} className="w-full h-14 rounded-full text-lg shadow-lg hover:scale-105 transition-transform">
                Done
            </Button>
        </div>
    );
}
