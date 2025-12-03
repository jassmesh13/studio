import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { caseStudies } from '@/lib/data';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FileUp, Mic, Video } from 'lucide-react';

export default function CaseStudyDetailPage({ params }: { params: { id: string } }) {
  const caseStudy = caseStudies.find((c) => c.id === params.id);

  if (!caseStudy) {
    notFound();
  }

  return (
    <div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">{caseStudy.title}</CardTitle>
          <CardDescription className="text-base">{caseStudy.description}</p>
          <p className="text-sm text-muted-foreground">Due Date: {new Date(caseStudy.dueDate).toLocaleDateString()}</p>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Submission</CardTitle>
          <CardDescription>Complete the following tasks to finish the case study.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            {/* Text-based assessment */}
            <div className="grid gap-2">
                <Label htmlFor="text-analysis" className="text-lg font-semibold">1. Analysis Report</Label>
                <p className="text-sm text-muted-foreground">Provide a detailed analysis of the current situation. (Max 500 words)</p>
                <Textarea id="text-analysis" placeholder="Type your analysis here..." className="min-h-[150px]" />
            </div>

            {/* MCQ assessment */}
            <div className="grid gap-2">
                <Label className="text-lg font-semibold">2. Key Problem Identification</Label>
                <p className="text-sm text-muted-foreground">What is the primary issue in the case study?</p>
                <RadioGroup defaultValue="option-one">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option-one" id="option-one" />
                        <Label htmlFor="option-one">Poor user interface design.</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option-two" id="option-two" />
                        <Label htmlFor="option-two">Inefficient backend processing.</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option-three" id="option-three" />
                        <Label htmlFor="option-three">Lack of marketing.</Label>
                    </div>
                </RadioGroup>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Audio/Video assessment */}
                <div className="grid gap-2">
                    <Label className="text-lg font-semibold">3. Elevator Pitch</Label>
                    <p className="text-sm text-muted-foreground">Record a 60-second audio or video pitch for your proposed solution.</p>
                    <div className="flex gap-2">
                        <Button variant="outline"><Mic className="mr-2 h-4 w-4" /> Record Audio</Button>
                        <Button variant="outline"><Video className="mr-2 h-4 w-4" /> Record Video</Button>
                    </div>
                </div>

                {/* File upload assessment */}
                <div className="grid gap-2">
                    <Label htmlFor="file-upload" className="text-lg font-semibold">4. Supporting Documents</Label>
                    <p className="text-sm text-muted-foreground">Upload your wireframes, mockups, or any other supporting files.</p>
                    <div className="flex items-center justify-center w-full">
                        <Label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <FileUp className="w-8 h-8 mb-4 text-muted-foreground" />
                                <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-muted-foreground">PDF, PNG, JPG, or FIG (MAX. 10MB)</p>
                            </div>
                            <Input id="file-upload" type="file" className="hidden" />
                        </Label>
                    </div> 
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button size="lg">Submit Case Study</Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
