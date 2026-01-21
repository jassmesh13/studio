'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Heart, Sparkles } from "lucide-react";

interface PostSubmissionScreenProps {
    userName: string;
    onDone: () => void;
}

export function PostSubmissionScreen({ userName, onDone }: PostSubmissionScreenProps) {
    return (
        <div className="w-full max-w-md mx-auto text-center animate-in fade-in-50 duration-500">
            <div className="mb-6">
                <div className="relative inline-block">
                    <Sparkles className="absolute -top-4 -left-4 w-8 h-8 text-yellow-400 animate-pulse" />
                    <Sparkles className="absolute -bottom-4 -right-4 w-8 h-8 text-yellow-400 animate-pulse delay-200" />
                    <h2 className="text-3xl font-bold text-primary">Well done, {userName}!</h2>
                </div>
                <p className="text-muted-foreground mt-2">
                    You took time to think, speak, and express your thoughts. That itself shows maturity.
                </p>
            </div>

            <Card className="mb-6 text-left bg-card shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Brain className="w-6 h-6 text-primary" />
                        Every choice has meaning.
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <p>In this situation, there is no simple ‘right’ or ‘wrong’ answer. Some people choose honesty because they believe truth builds trust. Some people choose loyalty because they care deeply about their friends.</p>
                    <p className="font-semibold">What matters most is <span className="text-primary">why</span> you chose what you chose. Your reasons show your values — kindness, fairness, courage, or care.</p>
                    <p className="italic">Great thinkers don’t just pick an option. They understand how their decision can affect others.</p>
                </CardContent>
            </Card>

            <Card className="mb-6 text-left bg-card shadow-lg">
                <CardHeader>
                     <CardTitle className="flex items-center gap-2">
                        <Heart className="w-6 h-6 text-red-500" />
                        Growth Insight
                    </CardTitle>
                </Header>
                <CardContent className="space-y-4 text-sm">
                    <p>Real life is full of moments like this. Each one helps you become more thoughtful, more kind, and more wise.</p>
                    <div className="bg-accent p-3 rounded-lg">
                        <p className="font-semibold">Next time, ask yourself:</p>
                        <p className="italic">‘How can I be kind and fair at the same time?’</p>
                    </div>
                </CardContent>
            </Card>

            <div className="bg-primary/10 border-2 border-dashed border-primary/20 p-4 rounded-xl mb-8">
                <h3 className="font-bold text-primary mb-2">Skill Boost!</h3>
                <div className="flex justify-around text-center">
                    <div className="font-semibold">
                        <p>Emotional Intelligence</p>
                        <p className="text-green-500">+1</p>
                    </div>
                    <div className="font-semibold">
                        <p>Decision-Making</p>
                        <p className="text-green-500">+1</p>
                    </div>
                    <div className="font-semibold">
                        <p>Confidence</p>
                        <p className="text-green-500">+1</p>
                    </div>
                </div>
            </div>

            <Button size="lg" onClick={onDone} className="w-full h-14 rounded-full text-lg">
                Done
            </Button>
        </div>
    );
}
