

'use client';
import { notFound, useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { getCaseStudyById } from '@/lib/data';
import { ArrowLeft, Mic, Video, Volume2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Image from 'next/image';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import type { CaseStudy } from '@/lib/types';

export default function CaseStudyDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  
  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null);
  const [loading, setLoading] = useState(true);

  const [isRecordingReady, setIsRecordingReady] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCaseStudy = async () => {
      const study = await getCaseStudyById(id);
      if (!study) {
        notFound();
      } else {
        setCaseStudy(study);
      }
      setLoading(false);
    };

    fetchCaseStudy();

    // Stop media stream when component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!caseStudy) {
    return notFound();
  }

  const handleStartRecordingClick = async () => {
    const isAudioOnly = caseStudy.type === 'audio';
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('Media devices API not supported in this browser.');
      toast({
        variant: 'destructive',
        title: 'Not Supported',
        description: 'Your browser does not support media recording.',
      });
      setHasCameraPermission(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: !isAudioOnly, audio: true });
      setHasCameraPermission(true);
      setIsRecordingReady(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: 'Permission Denied',
        description: `Please enable ${isAudioOnly ? 'microphone' : 'camera and microphone'} permissions in your browser settings to use this app.`,
      });
    }
  };

  const renderResponseUI = () => {
    if (caseStudy.type === 'mcq') {
      return (
        <div className="w-full space-y-6">
          {caseStudy.mcqs?.map((mcq) => (
            <div key={mcq.id} className="bg-card p-4 rounded-xl">
              <p className="font-semibold mb-4">{mcq.question}</p>
              <RadioGroup>
                {mcq.options.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2 bg-muted p-3 rounded-lg">
                    <RadioGroupItem value={option.id} id={option.id} />
                    <Label htmlFor={option.id} className="flex-1">{option.text}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
          <Button size="lg" className="w-full h-14 rounded-full text-lg">
            Submit Answer
          </Button>
        </div>
      );
    }

    // Video and Audio answer types
    if (isRecordingReady) {
      return (
        <>
          <div className="w-full aspect-video rounded-lg bg-muted mb-4 relative overflow-hidden">
            {caseStudy.type === 'video' ? (
                <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-primary/10">
                    <Volume2 className="w-24 h-24 text-primary/50 animate-pulse" />
                    <p className="text-muted-foreground mt-4">Recording audio...</p>
                </div>
            )}
          </div>
          {hasCameraPermission === false && (
            <Alert variant="destructive" className="w-full mb-4">
              <AlertTitle>Permission Required</AlertTitle>
              <AlertDescription>
                Please allow media access to record your answer.
              </AlertDescription>
            </Alert>
          )}
          <p className="text-muted-foreground mb-4">Please record your answer in 2 min</p>
          <Button size="lg" className="rounded-full w-20 h-20 bg-red-500 hover:bg-red-600">
            <Mic className="w-8 h-8" />
          </Button>
        </>
      );
    }

    const article = caseStudy.type === 'audio' ? 'an' : 'a';

    return (
      <>
        {hasCameraPermission === false && (
          <Alert variant="destructive" className="w-full mb-4">
            <AlertTitle>Permission Denied</AlertTitle>
            <AlertDescription>
              Please enable permissions in your browser settings and try again.
            </AlertDescription>
          </Alert>
        )}
        <Button size="lg" onClick={handleStartRecordingClick} className="w-full h-14 rounded-full text-lg">
          {caseStudy.type === 'video' ? <Video className="w-6 h-6 mr-2" /> : <Mic className="w-6 h-6 mr-2" />}
          Click to Record {caseStudy.type === 'video' ? 'Video' : 'Audio'}
        </Button>
        <p className="text-muted-foreground mt-4">You can record {article} {caseStudy.type} answer.</p>
      </>
    );
  };


  return (
    <div className="flex flex-col min-h-screen max-w-2xl mx-auto bg-background">
      <header className="flex items-center w-full p-4 sticky top-0 bg-background z-10 border-b">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div className="bg-primary/20 text-primary p-2 rounded-lg">
          <Image src="/icon.png" alt="Nirmaan Logo" width={24} height={24} />
        </div>
        <div className="text-right flex-grow">
          <p className="text-sm font-semibold text-muted-foreground">Case Study #{caseStudy.caseNumber}</p>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center p-4 pb-24">
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
          <p className="text-lg font-bold">Would you tell the teacher the truth, <br />OR <br />keep your friend's secret?</p>
          <p>{caseStudy.content?.explanation}</p>
        </div>
        
        {renderResponseUI()}
      </main>
    </div>
  );
}
