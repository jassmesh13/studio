
'use client';
import Image from 'next/image';
import { notFound, useRouter, useParams } from 'next/navigation';
import { ArrowLeft, CheckCircle, ChevronRight } from 'lucide-react';
import { courses, caseStudies } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function CourseDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const course = courses.find((c) => c.id === id);
  const router = useRouter();

  if (!course) {
    notFound();
  }

  const relatedCaseStudies = course.caseStudyIds?.map(id => caseStudies.find(cs => cs.id === id)).filter(Boolean) || [];

  return (
    <div className="flex flex-col h-screen bg-background">
        <header className="flex items-center gap-4 bg-primary text-primary-foreground p-4 sticky top-0 z-10">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft />
                <span className="sr-only">Back</span>
            </Button>
            <h1 className="text-xl font-bold">{course.title}</h1>
        </header>

        <div className="flex-1 overflow-y-auto pb-8">
            <div className="flex justify-center py-4">
                <Tabs defaultValue="chapters" className="w-full max-w-md px-4">
                    <TabsList className="grid w-full grid-cols-2 bg-primary/20 rounded-full p-1.5 h-auto">
                        <TabsTrigger value="chapters" className="text-base font-bold text-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg rounded-full h-12">Chapters</TabsTrigger>
                        <TabsTrigger value="case-studies" className="text-base font-bold text-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg rounded-full h-12">Case Studies</TabsTrigger>
                    </TabsList>
                    <TabsContent value="chapters">
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
                    <TabsContent value="case-studies">
                         <div className="space-y-4 pt-4">
                            {relatedCaseStudies.map((study) => {
                                if (!study) return null;
                                const avatar = PlaceHolderImages.find(p => p.id === 'avatar-nyra');

                                return (
                                    <Link href={`/dashboard/case-studies/${study.id}`} key={study.id}>
                                        <Card className="p-4 bg-card shadow-sm">
                                            <div className="flex items-start gap-4">
                                                {avatar && (
                                                    <div className="relative w-12 h-12 rounded-full overflow-hidden">
                                                        <Image src={avatar.imageUrl} alt={study.title} data-ai-hint={avatar.imageHint} fill className="object-cover" />
                                                    </div>
                                                )}
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <h3 className="font-bold text-base">{study.title}</h3>
                                                        {study.status === 'Completed' && (
                                                            <span className="text-xs font-semibold text-primary">Completed!</span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">Case study #{study.caseNumber}</p>
                                                    <div className="flex gap-2 mt-1">
                                                        {study.tags?.map(tag => {
                                                             const badgeColor = 
                                                                tag === 'Financial literacy' ? 'bg-yellow-200 text-yellow-800' :
                                                                tag === 'Friendship' ? 'bg-purple-200 text-purple-800' :
                                                                'bg-blue-200 text-blue-800';
                                                            return <Badge key={tag} className={cn("border-none", badgeColor)}>{tag}</Badge>
                                                        })}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mt-2">{study.description}</p>
                                                </div>
                                            </div>
                                        </Card>
                                    </Link>
                                )
                            })}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    </div>
  );
}
