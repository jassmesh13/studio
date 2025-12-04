'use client';
import Image from 'next/image';
import { notFound, useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, Circle, FileText, PlayCircle, Puzzle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { courses } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const course = courses.find((c) => c.id === params.id);
  const router = useRouter();

  if (!course) {
    notFound();
  }

  const image = PlaceHolderImages.find(p => p.id === course.imageUrl);

  const getIcon = (type: 'video' | 'pdf' | 'quiz') => {
    switch (type) {
      case 'video': return <PlayCircle className="w-5 h-5 text-muted-foreground" />;
      case 'pdf': return <FileText className="w-5 h-5 text-muted-foreground" />;
      case 'quiz': return <Puzzle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getContentInfo = (content: {type: 'video' | 'pdf' | 'quiz', duration?: string, pages?: number, questions?: number}) => {
    switch (content.type) {
        case 'video': return `${content.duration}`;
        case 'pdf': return `${content.pages} pages`;
        case 'quiz': return `${content.questions} questions`;
    }
  }


  return (
    <div>
        <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
                <ArrowLeft />
                <span className="sr-only">Back</span>
            </Button>
            <h1 className="text-2xl font-bold font-headline">Course Details</h1>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
                <Card className="overflow-hidden mb-6">
                    <div className="relative w-full h-64">
                        {image && (
                            <Image
                                src={image.imageUrl}
                                alt={course.title}
                                data-ai-hint={image.imageHint}
                                fill
                                className="object-cover"
                            />
                        )}
                    </div>
                    <CardHeader>
                        <CardTitle className="text-3xl font-headline">{course.title}</CardTitle>
                        <CardDescription className="text-base">{course.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <h2 className="text-2xl font-bold mb-4 font-headline">Course Content</h2>
                        <Accordion type="single" collapsible defaultValue={course.chapters?.[0].id}>
                        {course.chapters?.map((chapter) => (
                            <AccordionItem key={chapter.id} value={chapter.id}>
                            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                                <div className="flex items-center gap-3">
                                    {chapter.completed ? <CheckCircle className="w-6 h-6 text-green-500" /> : <Circle className="w-6 h-6 text-muted-foreground" />}
                                    {chapter.title}
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-md">
                                    <div className="flex items-center gap-3">
                                        {getIcon(chapter.content.type)}
                                        <span className="text-sm font-medium capitalize">{chapter.content.type}</span>
                                    </div>
                                    <span className="text-sm text-muted-foreground">{getContentInfo(chapter.content)}</span>
                                </div>
                            </AccordionContent>
                            </AccordionItem>
                        ))}
                        </Accordion>
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Your Progress</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center text-center">
                        <div className="relative h-32 w-32">
                            <svg className="w-full h-full" viewBox="0 0 36 36">
                                <path
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="hsl(var(--border))"
                                    strokeWidth="3"
                                />
                                <path
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth="3"
                                    strokeDasharray={`${course.progress}, 100`}
                                    strokeLinecap="round"
                                />
                            </svg>
                             <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-3xl font-bold">{course.progress}%</span>
                             </div>
                        </div>
                        <p className="mt-4 text-muted-foreground">You are doing great! Keep up the good work.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
