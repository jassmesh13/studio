import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { caseStudies } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';

export default function CaseStudiesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-6">Case Studies</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {caseStudies.map((study) => {
            const image = PlaceHolderImages.find(p => p.id === study.imageUrl);
            const statusVariant = study.status === 'Completed' ? 'default' : study.status === 'In Progress' ? 'secondary' : 'outline';
            return (
          <Card key={study.id} className="flex flex-col">
            <CardHeader className="p-0">
                <div className="relative h-48 w-full">
                {image && (
                    <Image
                        src={image.imageUrl}
                        alt={study.title}
                        data-ai-hint={image.imageHint}
                        fill
                        className="object-cover rounded-t-lg"
                    />
                )}
              </div>
            </CardHeader>
            <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl">{study.title}</CardTitle>
                    <Badge variant={statusVariant} className={cn(
                        study.status === 'Completed' && 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800',
                        study.status === 'In Progress' && 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800'
                    )}>
                        {study.status}
                    </Badge>
                </div>
                <CardDescription>{study.description}</CardDescription>
            </div>
            <CardFooter className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">Due: {new Date(study.dueDate).toLocaleDateString()}</p>
              <Button asChild>
                <Link href={`/dashboard/case-studies/${study.id}`}>View Details</Link>
              </Button>
            </CardFooter>
          </Card>
        )})}
      </div>
    </div>
  );
}
