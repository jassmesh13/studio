
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { courses } from '@/lib/data';
import { Settings, Star, Globe, Shield } from 'lucide-react';
import { AppSidebar } from '@/components/app/app-sidebar';

export default function CoursesPage() {
  return (
    <div className="flex flex-col gap-6 pb-24">
        <header className="flex items-center justify-between bg-primary text-primary-foreground p-4 rounded-b-3xl sticky top-0 z-10 -mx-4 -mt-4 mb-2">
            <div className="flex items-center gap-4">
                <div className="bg-white/20 p-2 rounded-lg">
                    <span className="font-bold text-3xl">N</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold font-headline">Courses</h1>
            </div>
            <Button variant="ghost" size="icon">
                <Settings className="w-6 h-6" />
            </Button>
        </header>

      <div className="grid gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="bg-primary/10 border-primary/20 shadow-lg">
            <CardContent className="p-6">
                <h2 className="text-xl font-bold text-center mb-4">{course.title}</h2>
                <div className="flex justify-around text-center mb-4">
                    <div className="flex flex-col items-center">
                        <Star className="w-6 h-6 text-primary mb-1" />
                        <p className="text-xs text-muted-foreground">POINTS</p>
                        <p className="font-bold text-lg">{course.points}</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <Globe className="w-6 h-6 text-primary mb-1" />
                        <p className="text-xs text-muted-foreground">LESSONS</p>
                        <p className="font-bold text-lg">{course.lessons}</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <Shield className="w-6 h-6 text-primary mb-1" />
                        <p className="text-xs text-muted-foreground">CLASS RANK</p>
                        <p className="font-bold text-lg">#{course.classRank}</p>
                    </div>
                </div>
                <Progress value={course.progress} className="h-2 mb-4" />
                <Button asChild className="w-full">
                    <Link href={`/dashboard/courses/${course.id}`}>
                        CHECK
                    </Link>
                </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <AppSidebar />
    </div>
  );
}
