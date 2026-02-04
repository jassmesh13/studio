'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getCourseById } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { Course, Chapter } from '@/lib/types';

export default function ChapterContentPage() {
    const params = useParams();
    const router = useRouter();
    const courseId = params.id as string;
    const chapterId = params.chapterId as string;

    const [chapter, setChapter] = useState<Chapter | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const course = await getCourseById(courseId);
            if (course && course.chapters) {
                const found = course.chapters.find(c => c.id === chapterId);
                setChapter(found || null);
            }
            setLoading(false);
        };
        fetchData();
    }, [courseId, chapterId]);

    if (loading) return <div className="flex items-center justify-center min-h-screen font-bold text-primary">Loading lesson...</div>;
    if (!chapter) return <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8 text-center">
        <p className="text-xl font-bold">Oops! Lesson not found.</p>
        <Button onClick={() => router.back()}>Go Back</Button>
    </div>;

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <header className="flex items-center gap-4 bg-primary text-primary-foreground p-4 sticky top-0 z-10 shadow-md">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="hover:bg-white/20">
                    <ArrowLeft className="w-6 h-6" />
                </Button>
                <h1 className="text-xl font-bold truncate">{chapter.title}</h1>
            </header>

            <main className="flex-1 p-4 md:p-8 max-w-2xl mx-auto w-full space-y-8 pb-32">
                <div className="flex flex-col items-center text-center gap-4 mb-8">
                    <div className="bg-primary/20 p-6 rounded-3xl shadow-inner">
                        <BookOpen className="w-16 h-16 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-primary tracking-tight">Lesson Time!</h2>
                        <p className="text-muted-foreground font-semibold">Let's learn something wonderful together.</p>
                    </div>
                </div>

                {chapter.content.body ? (
                    <div className="space-y-10">
                        {chapter.content.body.map((item, index) => (
                            <div key={index} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 150}ms` }}>
                                <div className="flex items-center gap-2">
                                    <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                                    <h3 className="text-2xl font-black text-primary leading-tight">
                                        {item.question}
                                    </h3>
                                </div>
                                <Card className="bg-white border-none shadow-xl rounded-3xl overflow-hidden transform hover:scale-[1.02] transition-transform">
                                    <CardContent className="p-6 md:p-8 text-xl leading-relaxed font-medium text-foreground/90 bg-accent/30">
                                        {item.answer}
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-12 bg-accent/50 rounded-3xl border-4 border-dashed border-primary/20">
                        <p className="text-2xl font-black text-primary mb-2">Great start!</p>
                        <p className="text-muted-foreground font-bold italic">
                            This chapter contains {chapter.content.type} content. 
                            Nirmaan is preparing the interactive viewer for you!
                        </p>
                    </div>
                )}
                
                <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background/90 to-transparent flex justify-center">
                    <Button 
                        onClick={() => router.back()} 
                        size="lg"
                        className="w-full max-w-md h-16 rounded-full text-xl font-black shadow-2xl hover:shadow-primary/40 active:scale-95 transition-all"
                    >
                        I'm Done Learning! 🌟
                    </Button>
                </div>
            </main>
        </div>
    );
}
