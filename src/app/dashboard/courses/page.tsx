import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { courses } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function CoursesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-6">Courses</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => {
            const image = PlaceHolderImages.find(p => p.id === course.imageUrl);
            return (
          <Card key={course.id}>
            <CardHeader className="p-0">
              <div className="relative h-48 w-full">
                {image && (
                    <Image
                        src={image.imageUrl}
                        alt={course.title}
                        data-ai-hint={image.imageHint}
                        fill
                        className="object-cover rounded-t-lg"
                    />
                )}
              </div>
            </CardHeader>
            <div className="p-6">
                <CardTitle className="mb-2 text-xl">{course.title}</CardTitle>
                <CardDescription>{course.description}</CardDescription>
                <div className="mt-4">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-muted-foreground">Progress</span>
                        <span className="text-sm font-semibold">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} aria-label={`${course.progress}% complete`} />
                </div>
            </div>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/dashboard/courses/${course.id}`}>
                    {course.progress > 0 ? 'Continue Learning' : 'Start Course'}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        )})}
      </div>
    </div>
  );
}
