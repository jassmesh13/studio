
'use client';
import Image from 'next/image';
import { notFound, useRouter, useParams } from 'next/navigation';
import { ArrowLeft, CheckCircle, ChevronRight } from 'lucide-react';
import { courses } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { AppSidebar } from '@/components/app/app-sidebar';

export default function CourseDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const course = courses.find((c) => c.id === id);
  const router = useRouter();

  if (!course) {
    notFound();
  }

  return (
    <div className="flex flex-col h-screen bg-accent/30">
        <header className="flex items-center gap-4 bg-primary text-primary-foreground p-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft />
                <span className="sr-only">Back</span>
            </Button>
            <h1 className="text-xl font-bold">{course.title}</h1>
        </header>

        <div className="flex justify-center py-4">
            <Tabs defaultValue="lessons" className="w-full max-w-md px-4">
                <TabsList className="grid w-full grid-cols-2 bg-muted rounded-full">
                    <TabsTrigger value="lessons" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:rounded-full data-[state=active]:shadow-none">Lessons</TabsTrigger>
                    <TabsTrigger value="materials" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:rounded-full data-[state=active]:shadow-none">Material</TabsTrigger>
                </TabsList>
                <TabsContent value="lessons">
                    <div className="space-y-4 pt-4">
                        {course.chapters?.map((chapter, index) => {
                            const image = PlaceHolderImages.find(p => p.id === chapter.imageUrl);
                            return (
                                <Card key={chapter.id} className="p-3 bg-card shadow-sm">
                                    <div className="flex items-center gap-4">
                                        {image && (
                                            <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                                                <Image src={image.imageUrl} alt={chapter.title} data-ai-hint={image.imageHint} fill className="object-cover" />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <h3 className="font-bold">LESSON {index + 1}</h3>
                                            <p className="text-sm text-muted-foreground mb-1">{chapter.description}</p>
                                            {chapter.completed && (
                                                <div className="flex items-center gap-1 text-green-600">
                                                    <CheckCircle className="w-4 h-4" />
                                                    <span className="text-sm font-medium">Completed</span>
                                                </div>
                                            )}
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                </Card>
                            )
                        })}
                    </div>
                </TabsContent>
                <TabsContent value="materials">
                     <div className="flex items-center justify-center h-48">
                        <p className="text-muted-foreground">Material content goes here.</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
      <div className="mt-auto">
        <AppSidebar />
      </div>
    </div>
  );
}

