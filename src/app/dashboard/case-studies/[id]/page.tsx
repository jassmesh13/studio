
'use client';
import { notFound, useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { caseStudies } from '@/lib/data';
import { ArrowLeft, Mic } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function CaseStudyDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const caseStudy = caseStudies.find((c) => c.id === id);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('Camera API not supported in this browser.');
        toast({
          variant: 'destructive',
          title: 'Camera Not Supported',
          description: 'Your browser does not support camera access.',
        });
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this app.',
        });
      }
    };

    getCameraPermission();
  }, [toast]);

  if (!caseStudy) {
    notFound();
  }

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto">
        <header className="flex items-center w-full p-4 sticky top-0 bg-background z-10">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-4">
                <ArrowLeft className="w-6 h-6"/>
            </Button>
            <div className="bg-primary/20 text-primary p-2 rounded-lg">
                <span className="font-extrabold text-3xl">N</span>
            </div>
            <div className="text-right flex-grow">
                <p className="text-sm font-semibold text-muted-foreground">Case Study #{caseStudy.caseNumber}</p>
            </div>
        </header>

        <main className="flex-grow flex flex-col items-center p-4">
            <div className="bg-orange-100 p-6 rounded-2xl w-full relative mb-6">
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-purple-300 rounded-full flex items-center justify-center">
                    <span className="text-3xl">🙋‍♀️</span>
                </div>
                <h2 className="text-xl font-bold mb-4">Hi Nyra !</h2>
                <p className="font-semibold mb-4">Imagine this situation:</p>
                <p className="mb-4">{caseStudy.content?.scenario}</p>
                <p className="font-semibold">Now She comes to you and says:</p>
                <p className="italic">'{caseStudy.content?.quote}'</p>
            </div>

            <div className="text-left w-full space-y-4 mb-8">
                <p className="font-semibold">{caseStudy.content?.prompt}</p>
                <p className="text-lg font-bold">Would you tell the teacher the truth, <br/>OR <br/>keep your friend's secret?</p>
                <p>{caseStudy.content?.explanation}</p>
            </div>

            <div className="w-full aspect-video rounded-lg bg-muted mb-4">
                <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay muted playsInline />
            </div>

            { !hasCameraPermission && (
                <Alert variant="destructive" className="w-full mb-4">
                    <AlertTitle>Camera Access Required</AlertTitle>
                    <AlertDescription>
                        Please allow camera access to record your answer.
                    </AlertDescription>
                </Alert>
            )}
            
            <p className="text-muted-foreground mb-4">Please record your answer in 2 min</p>

            <Button size="lg" className="rounded-full w-20 h-20 bg-red-500 hover:bg-red-600">
                <Mic className="w-8 h-8"/>
            </Button>
        </main>
    </div>
  );
}
