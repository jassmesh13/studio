
'use client';

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Heart, Star, Loader2, PartyPopper, Sparkles } from "lucide-react";
import { generateCaseStudyFeedback, type CaseStudyFeedbackOutput } from "@/ai/flows/case-study-feedback-flow";
import type { CaseStudy } from "@/lib/types";
import { cn } from "@/lib/utils";

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
    const [showCelebration, setShowCelebration] = useState(false);
    const fetchInProgress = useRef(false);
    const hasFetched = useRef(false);

    useEffect(() => {
        // Ensure user is at the top of the screen to see the celebration
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
                        const blob = await response.blob();
                        
                        if (blob.size < 10 * 1024 * 1024) { 
                            mediaDataUri = await new Promise<string>((resolve, reject) => {
                                const reader = new FileReader();
                                reader.onloadend = () => resolve(reader.result as string);
                                reader.onerror = reject;
                                reader.readAsDataURL(blob);
                            });
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
                setShowCelebration(true);
                hasFetched.current = true;
            } catch (error) {
                console.error("Failed to generate AI feedback:", error);
                setFeedback({
                    analysis: "Thank you for sharing your thoughts! Every decision helps you learn more about who you want to be.",
                    growthInsight: "Keep thinking about how your actions affect others and yourself.",
                    skillBoosted: "Decision-Making"
                });
                setShowCelebration(true);
            } finally {
                setLoading(false);
                fetchInProgress.current = false;
            }
        }

        if (userAnswer && !hasFetched.current) {
            fetchFeedback();
        }
    }, [caseStudy, userAnswer, recordedMediaURL]);

    return (
        <div className="w-full max-w-lg mx-auto text-center px-4 pt-8">
            <div className={cn(
                "mb-8 transform transition-all duration-700 ease-out",
                !loading ? "scale-100 opacity-100" : "scale-90 opacity-100"
            )}>
                <div className="relative inline-block mb-4">
                    {!loading && (
                        <>
                            <PartyPopper className="absolute -left-12 top-0 w-10 h-10 text-primary animate-bounce" />
                            <PartyPopper className="absolute -right-12 top-0 w-10 h-10 text-primary animate-bounce [animation-delay:0.2s] scale-x-[-1]" />
                        </>
                    )}
                    <Sparkles className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-8 text-yellow-400 animate-pulse" />
                    
                    <h2 className="text-4xl md:text-5xl font-extrabold text-primary drop-shadow-sm tracking-tight animate-pop-in">
                        Well done, {userName}!
                    </h2>
                </div>
                <p className="text-lg text-muted-foreground font-medium max-w-sm mx-auto">
                    You shared your thoughts beautifully. Every answer makes you a better leader! 🌟
                </p>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-12 text-center gap-4 animate-in fade-in duration-500">
                    <div className="relative">
                        <Loader2 className="w-16 h-16 animate-spin text-primary" />
                    </div>
                    <h2 className="text-xl font-bold text-primary">Nirmaan is thinking...</h2>
                    <p className="text-sm text-muted-foreground">Analyzing your wonderful answer! ✨</p>
                </div>
            ) : (
                <div className={cn(
                    "space-y-6 transition-all duration-1000 delay-300",
                    showCelebration ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                )}>
                    <Card className="text-left bg-white shadow-xl border-primary/10 overflow-hidden">
                        <CardHeader className="bg-primary/5 pb-4">
                            <CardTitle className="flex items-center gap-2 text-primary text-lg">
                                <Brain className="w-5 h-5" />
                                Nirmaan's Thoughts
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 text-base leading-relaxed text-foreground/80">
                            <p>{feedback?.analysis}</p>
                        </CardContent>
                    </Card>

                    <Card className="text-left bg-white shadow-xl border-red-100">
                        <CardHeader className="bg-red-50/50 pb-4">
                            <CardTitle className="flex items-center gap-2 text-red-500 text-lg">
                                <Heart className="w-5 h-5 fill-red-500" />
                                Growth Insight
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="bg-accent/50 p-5 rounded-2xl border-2 border-dashed border-primary/20">
                                <p className="font-bold italic text-primary text-base">"{feedback?.growthInsight}"</p>
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
                                    <span className="font-bold text-2xl text-white">
                                        {feedback.skillBoosted} <span className="ml-1 text-yellow-300">+10</span>
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
