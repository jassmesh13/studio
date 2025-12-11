
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { courses } from '@/lib/data';
import { Settings, Star, Globe, Shield, LogOut } from 'lucide-react';
import { AppSidebar } from '@/components/app/app-sidebar';
import Image from 'next/image';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function CoursesPage() {
  return (
    <div className="flex flex-col gap-6 pb-24">
        <header className="flex items-center justify-between sticky top-0 bg-background z-10 pt-4 -mt-4 -mx-4 px-4 pb-2">
            <div className="flex items-center gap-4">
                <div className="bg-primary/20 text-primary p-2 rounded-lg">
                    <Image src="/icon.png" alt="Nirmaan Logo" width={24} height={24} />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold font-headline text-primary">Courses</h1>
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

      <div className="grid gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="bg-primary/10 border-primary/20 shadow-lg">
            <CardContent className="p-6">
                <h2 className="text-xl font-bold text-center mb-4">{course.title}</h2>
                <div className="flex justify-around text-center mb-4">
                    <div className="flex flex-col items-center">
                        <Star className="w-6 h-6 text-primary mb-1" />
                        <p className="text-xs text-muted-foreground">Casestudy Points</p>
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
                <div className="relative w-full mb-4">
                    <Progress value={course.progress} className="h-6" />
                    <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-primary-foreground drop-shadow">
                        {course.progress}% Completed
                    </span>
                </div>
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
