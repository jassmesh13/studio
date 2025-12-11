
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { caseStudies } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Settings, BookOpen } from 'lucide-react';
import { AppSidebar } from '@/components/app/app-sidebar';
import Image from 'next/image';

export default function CaseStudiesPage() {
    const stats = [
        { label: 'Attempted', value: 15 },
        { label: 'Solved', value: 10 },
        { label: 'On-time', value: 5 },
    ];

  return (
    <div className="flex flex-col gap-6 pb-24">
        <header className="flex items-center justify-between sticky top-0 bg-background z-10 pt-4 -mt-4 -mx-4 px-4 pb-2">
            <div className="flex items-center gap-4">
                <div className="bg-primary/20 text-primary p-2 rounded-lg">
                    <Image src="/icon.png" alt="Nirmaan Logo" width={24} height={24} />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold font-headline text-primary">Case Studies</h1>
            </div>
            <Button variant="ghost" size="icon">
                <Settings className="w-6 h-6 text-primary" />
            </Button>
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
            const badgeColor = 
                study.category === 'Financial literacy' ? 'bg-yellow-200 text-yellow-800' :
                study.category === 'Emotional Intelligence' ? 'bg-green-200 text-green-800' :
                study.category === 'Cognitive Ability' ? 'bg-orange-200 text-orange-800' :
                'bg-blue-200 text-blue-800';

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
                                <Badge className={cn("mt-2 border-none", badgeColor)}>{study.category}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground self-end">Casestudy #{study.caseNumber}</p>
                        </div>
                    </Card>
                </Link>
            )
        })}
      </div>
      <AppSidebar />
    </div>
  );
}
