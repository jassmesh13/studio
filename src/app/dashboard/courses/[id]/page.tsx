'use client';
import Image from 'next/image';
import { notFound, useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  CheckCircle, 
  ChevronRight, 
  UserCircle, 
  Smile, 
  Handshake, 
  Heart, 
  CheckCircle2, 
  Apple, 
  Shield, 
  Lightbulb, 
  Users, 
  Globe, 
  Ear, 
  MessageSquare, 
  Eye, 
  BookOpen,
  Brain,
  Puzzle,
  Palette,
  Zap,
  MessageCircle,
  Mic2,
  HelpCircle,
  Volume2,
  HandHelping,
  Pencil,
  Squirrel,
  Wallet
} from 'lucide-react';
import { getCourseById, getCaseStudiesForCourse } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Course, CaseStudy } from '@/lib/types';

export default function CourseDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [relatedCaseStudies, setRelatedCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseData = async () => {
      const courseData = await getCourseById(id);
      if (!courseData) {
        notFound();
      } else {
        setCourse(courseData);
        if (courseData.caseStudyIds) {
          const studies = await getCaseStudiesForCourse(courseData.caseStudyIds);
          setRelatedCaseStudies(studies);
        }
      }
      setLoading(false);
    };

    fetchCourseData();
  }, [id]);

  const getChapterIcon = (title: string) => {
    const t = title.toLowerCase();
    
    // Life Skills
    if (t.includes('knowing myself')) return <UserCircle className="w-10 h-10 text-primary" />;
    if (t.includes('managing emotions')) return <Smile className="w-10 h-10 text-primary" />;
    if (t.includes('good manners')) return <Handshake className="w-10 h-10 text-primary" />;
    if (t.includes('sharing and caring')) return <Heart className="w-10 h-10 text-primary" />;
    if (t.includes('responsibility')) return <CheckCircle2 className="w-10 h-10 text-primary" />;
    if (t.includes('healthy habits')) return <Apple className="w-10 h-10 text-primary" />;
    if (t.includes('safety rules')) return <Shield className="w-10 h-10 text-primary" />;
    
    // 21st Century Skills
    if (t.includes('critical thinking')) return <Brain className="w-10 h-10 text-primary" />;
    if (t.includes('problem solving')) return <Puzzle className="w-10 h-10 text-primary" />;
    if (t.includes('creativity')) return <Palette className="w-10 h-10 text-primary" />;
    if (t.includes('teamwork')) return <Users className="w-10 h-10 text-primary" />;
    if (t.includes('decision making')) return <Zap className="w-10 h-10 text-primary" />;
    if (t.includes('digital skills')) return <Globe className="w-10 h-10 text-primary" />;
    
    // Communication Skills
    if (t.includes('everyday communication')) return <MessageCircle className="w-10 h-10 text-primary" />;
    if (t.includes('listening')) return <Ear className="w-10 h-10 text-primary" />;
    if (t.includes('speaking clearly')) return <Mic2 className="w-10 h-10 text-primary" />;
    if (t.includes('asking questions')) return <HelpCircle className="w-10 h-10 text-primary" />;
    if (t.includes('storytelling')) return <BookOpen className="w-10 h-10 text-primary" />;
    if (t.includes('public speaking')) return <Volume2 className="w-10 h-10 text-primary" />;
    
    return <BookOpen className="w-10 h-10 text-primary" />;
  };

  const getCaseStudyIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('help')) return <HandHelping className="w-6 h-6 text-primary" />;
    if (t.includes('pencil')) return <Pencil className="w-6 h-6 text-primary" />;
    if (t.includes('animals scared')) return <Squirrel className="w-6 h-6 text-primary" />;
    if (t.includes('fox story')) return <BookOpen className="w-6 h-6 text-primary" />;
    if (t.includes('introduce yourself')) return <UserCircle className="w-6 h-6 text-primary" />;
    if (t.includes('superpower')) return <Zap className="w-6 h-6 text-primary" />;
    if (t.includes('nyra')) return <Heart className="w-6 h-6 text-primary" />;
    if (t.includes('ibrahim')) return <MessageCircle className="w-6 h-6 text-primary" />;
    if (t.includes('wallet')) return <Wallet className="w-6 h-6 text-primary" />;
    if (t.includes('team')) return <Users className="w-6 h-6 text-primary" />;
    return <BookOpen className="w-6 h-6 text-primary" />;
  };

  const getTagColor = (tag: string) => {
    const t = tag.toLowerCase();
    if (t.includes('communication') || t.includes('speaking')) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (t.includes('honesty') || t.includes('integrity') || t.includes('ethics')) return 'bg-green-100 text-green-700 border-green-200';
    if (t.includes('friendship') || t.includes('social')) return 'bg-pink-100 text-pink-700 border-pink-200';
    if (t.includes('storytelling')) return 'bg-purple-100 text-purple-700 border-purple-200';
    if (t.includes('emotions') || t.includes('empathy')) return 'bg-orange-100 text-orange-700 border-orange-200';
    if (t.includes('creativity')) return 'bg-indigo-100 text-indigo-700 border-indigo-200';
    if (t.includes('decision') || t.includes('thinking')) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    if (t.includes('responsibility') || t.includes('habit')) return 'bg-amber-100 text-amber-700 border-amber-200';
    if (t.includes('teamwork')) return 'bg-teal-100 text-teal-700 border-teal-200';
    return 'bg-primary/10 text-primary border-primary/20';
  };

  if (loading) {
    return <div className="p-8 text-center font-bold text-primary">Loading course details...</div>;
  }

  if (!course) {
    notFound();
  }

  return (
    <div className="flex flex-col h-screen bg-background">
        <header className="flex items-center gap-4 bg-primary text-primary-foreground p-4 sticky top-0 z-10">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft />
                <span className="sr-only">Back</span>
            </Button>
            <h1 className="text-xl font-bold">{course.title}</h1>
        </header>

        <div className="flex-1 overflow-y-auto pb-24">
            <div className="flex justify-center py-4">
                <Tabs defaultValue="chapters" className="w-full max-w-md px-4">
                    <TabsList className="grid w-full grid-cols-2 bg-primary/20 rounded-full p-1.5 h-auto">
                        <TabsTrigger value="chapters" className="text-base font-bold text-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg rounded-full h-12">Chapters</TabsTrigger>
                        <TabsTrigger value="case-studies" className="text-base font-bold text-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg rounded-full h-12">Case Studies</TabsTrigger>
                    </TabsList>
                    <TabsContent value="chapters">
                        <div className="space-y-4 pt-4">
                            {course.chapters?.map((chapter, index) => {
                                return (
                                    <Link href={`/dashboard/courses/${id}/chapters/${chapter.id}`} key={chapter.id}>
                                        <Card className="p-3 bg-card shadow-sm hover:bg-accent transition-all active:scale-95 group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                                                    {getChapterIcon(chapter.title)}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold group-hover:text-primary transition-colors">Chapter {index + 1}: {chapter.title}</h3>
                                                    <p className="text-sm text-muted-foreground mb-1 line-clamp-2">{chapter.description}</p>
                                                    {chapter.completed && (
                                                        <div className="flex items-center gap-1 text-green-600">
                                                            <CheckCircle className="w-4 h-4" />
                                                            <span className="text-sm font-medium">Completed</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                            </div>
                                        </Card>
                                    </Link>
                                )
                            })}
                        </div>
                    </TabsContent>
                    <TabsContent value="case-studies">
                         <div className="space-y-4 pt-4">
                            {relatedCaseStudies.map((study) => {
                                if (!study) return null;

                                return (
                                    <Link href={`/dashboard/case-studies/${study.id}`} key={study.id}>
                                        <Card className="p-4 bg-card shadow-sm hover:bg-accent transition-colors">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                                    {getCaseStudyIcon(study.title)}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <h3 className="font-bold text-base">{study.title}</h3>
                                                        {study.status === 'Completed' && (
                                                            <span className="text-xs font-semibold text-primary">Completed!</span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">Case study #{study.caseNumber}</p>
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {study.tags?.map(tag => (
                                                            <Badge 
                                                                key={tag} 
                                                                variant="outline" 
                                                                className={cn(
                                                                    "py-0.5 px-2 text-[10px] font-bold uppercase transition-all",
                                                                    getTagColor(tag)
                                                                )}
                                                            >
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{study.description}</p>
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
