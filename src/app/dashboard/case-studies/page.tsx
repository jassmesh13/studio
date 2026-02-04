'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getCaseStudies } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Settings, BookOpen, LogOut, Clock } from 'lucide-react';
import Image from 'next/image';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useEffect, useState } from 'react';
import type { CaseStudy } from '@/lib/types';

const getTimeLeft = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diff = due.getTime() - now.getTime();

    if (diff <= 0) {
        return 'Past due';
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''} left`;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} left`;
    }

    const minutes = Math.floor(diff / (1000 * 60));
    return `${minutes} min${minutes > 1 ? 's' : ''} left`;
};

const getTagColor = (tag: string) => {
    const colors: Record<string, string> = {
        'Communication': 'bg-blue-100 text-blue-700',
        'Storytelling': 'bg-purple-100 text-purple-700',
        'Classroom': 'bg-slate-100 text-slate-700',
        'Honesty': 'bg-green-100 text-green-700',
        'Friendship': 'bg-pink-100 text-pink-700',
        'Emotions': 'bg-orange-100 text-orange-700',
        'Memory': 'bg-yellow-100 text-yellow-700',
        'Social Skills': 'bg-emerald-100 text-emerald-700',
        'Creativity': 'bg-indigo-100 text-indigo-700',
        'Confidence': 'bg-rose-100 text-rose-700',
        'Integrity': 'bg-teal-100 text-teal-700',
        'Empathy': 'bg-cyan-100 text-cyan-700',
        'Standing Up': 'bg-amber-100 text-amber-700',
        'Responsibility': 'bg-violet-100 text-violet-700',
        'Teamwork': 'bg-lime-100 text-lime-700',
        'Fairness': 'bg-red-100 text-red-700',
    };
    return colors[tag] || 'bg-gray-100 text-gray-700';
};


export default function CaseStudiesPage() {
    const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
    const [timeLeft, setTimeLeft] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCaseStudies = async () => {
            const studies = await getCaseStudies();
            
            // Sort Grade 1-3 to the top
            const sortedStudies = [...studies].sort((a, b) => {
                const isAGrade13 = a.grade === 'Grade 1-3';
                const isBGrade13 = b.grade === 'Grade 1-3';
                if (isAGrade13 && !isBGrade13) return -1;
                if (!isAGrade13 && isBGrade13) return 1;
                return 0;
            });

            setCaseStudies(sortedStudies);

            const initialTimeLeft: Record<string, string> = {};
            sortedStudies.forEach(study => {
                initialTimeLeft[study.id] = getTimeLeft(study.dueDate);
            });
            setTimeLeft(initialTimeLeft);
            setLoading(false);
        };
        fetchCaseStudies();
    }, []);

    useEffect(() => {
        if (caseStudies.length === 0) return;
        const interval = setInterval(() => {
            const newTimeLeft: Record<string, string> = {};
            caseStudies.forEach(study => {
                newTimeLeft[study.id] = getTimeLeft(study.dueDate);
            });
            setTimeLeft(newTimeLeft);
        }, 60000); // Update every minute

        return () => clearInterval(interval);
    }, [caseStudies]);


    const stats = [
        { label: 'Attempted', value: 15 },
        { label: 'Solved', value: 10 },
        { label: 'On-time', value: 5 },
    ];

    if (loading) {
        return <div>Loading...</div>
    }

  return (
    <div className="flex flex-col gap-6 pb-24">
        <header className="flex items-center justify-between sticky top-0 bg-background z-10 pt-4 -mt-4 -mx-4 px-4 pb-2">
            <div className="flex items-center gap-4">
                <div className="bg-primary/20 text-primary p-2 rounded-lg">
                    <Image src="/icon.png" alt="Nirmaan Logo" width={24} height={24} />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold font-headline text-primary">Case Studies</h1>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Settings className="w-7 h-7 text-primary" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem>Notifications setting</DropdownMenuItem>
                    <DropdownMenuItem>Privacy setting</DropdownMenuItem>
                    <DropdownMenuItem>Help</DropdownMenuItem>
                    <DropdownMenuItem>Feedback</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href="/"><LogOut className="mr-2 h-4 w-4" />Signout</Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>

        <div className="grid grid-cols-3 gap-4">
            {stats.map((stat) => (
                <Card key={stat.label} className="bg-accent/50 border-primary/20 text-center p-4">
                    <p className="text-3xl font-bold text-primary">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                </Card>
            ))}
        </div>

      <div className="grid gap-4">
        {caseStudies.map((study) => {
            return (
                <Link href={`/dashboard/case-studies/${study.id}`} key={study.id}>
                    <Card className="bg-accent/30 p-4 hover:bg-accent/50 transition-colors">
                        <div className="flex items-start gap-4">
                            <div className="bg-yellow-400 p-3 rounded-lg relative">
                                <BookOpen className="w-8 h-8 text-white" />
                                <div className="absolute -top-1 -right-1 bg-red-500 w-3 h-4 rounded-sm transform rotate-12"></div>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg">{study.title}</h3>
                                <p className="text-sm text-muted-foreground">{study.description}</p>
                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                    {study.tags?.map(tag => (
                                        <Badge key={tag} className={cn("border-none", getTagColor(tag))}>{tag}</Badge>
                                    ))}
                                    {study.grade && <Badge variant="outline" className="border-primary/20">{study.grade}</Badge>}
                                </div>
                            </div>
                            <div className="text-right self-end space-y-1">
                                <div className="bg-green-100 text-green-700 p-2 rounded-md text-center text-xs font-bold">
                                    <p>+{study.points}</p>
                                    <p>Points</p>
                                </div>
                                <div className="flex items-center justify-end gap-1 text-red-500 text-xs font-semibold">
                                    <Clock className="w-3 h-3" />
                                    <span>{timeLeft[study.id] || 'Loading...'}</span>
                                </div>
                                <p className="text-xs text-muted-foreground">Casestudy #{study.caseNumber}</p>
                            </div>
                        </div>
                    </Card>
                </Link>
            )
        })}
      </div>
    </div>
  );
}
