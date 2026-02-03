
'use client';
import { notFound, useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { getCaseStudyById } from '@/lib/data';
import { ArrowLeft, Mic, Video, Volume2, Square, Circle, Send, RefreshCw, AlertCircle } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import type { CaseStudy } from '@/lib/types';
import { PostSubmissionScreen } from '@/components/app/case-studies/post-submission-screen';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type RecordingStatus = 'idle' | 'permission' | 'recording' | 'recorded' | 'submitted';

export default function CaseStudyDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  
  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null);
  const [loading, setLoading] = useState(true);

  const [recordingStatus, setRecordingStatus] = useState<RecordingStatus>('idle');
  const [permissionError, setPermissionError] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const [recordedMediaURL, setRecordedMediaURL] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>('');
  const [selectedMCQOption, setSelectedMCQOption] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const fetchCaseStudy = useCallback(async () => {
      const study = await getCaseStudyById(id);
      if (!study) {
        notFound();
      } else {
        setCaseStudy(study);
      }
      setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchCaseStudy();
  }, [fetchCaseStudy]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }
          if (finalTranscript) {
            setTranscript(prev => prev + ' ' + finalTranscript);
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
        };
      }
    }

    return () => {
      stream?.getTracks().forEach(track => track.stop());
      if (recordedMediaURL) {
        URL.revokeObjectURL(recordedMediaURL);
      }
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, [stream, recordedMediaURL]);

  const handlePermissions = async () => {
    if (!caseStudy) return;

    setRecordingStatus('permission');
    setPermissionError(false);

    try {
      const isAudioOnly = caseStudy.type === 'audio';
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: !isAudioOnly, audio: true });
      setStream(mediaStream);
      setRecordingStatus('recording');
      
      if (recognitionRef.current) {
        setTranscript('');
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.warn("Recognition already started or error:", e);
        }
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
      setPermissionError(true);
      setRecordingStatus('idle');
      toast({ 
        variant: 'destructive', 
        title: 'Permission Denied', 
        description: 'Please enable camera and microphone permissions in your browser settings.' 
      });
    }
  };
  
  useEffect(() => {
    if (recordingStatus === 'recording' && stream && caseStudy) {
      if (caseStudy.type === 'video' && videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(e => console.error("Error playing video preview:", e));
      }
      
      const mimeType = caseStudy.type === 'video' ? 'video/webm' : 'audio/webm';
      const finalMimeType = MediaRecorder.isTypeSupported(mimeType) ? mimeType : '';
      
      if (!finalMimeType) {
        toast({ variant: 'destructive', title: 'Unsupported Format', description: `Your browser does not support recording in ${mimeType} format.` });
        setRecordingStatus('idle');
        return;
      }
      
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: finalMimeType });

      recordedChunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: finalMimeType });
        const url = URL.createObjectURL(blob);
        setRecordedMediaURL(url);

        setRecordingStatus('recorded');
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
        if (recognitionRef.current) recognitionRef.current.stop();
      };

      mediaRecorderRef.current.start();
    }
  }, [recordingStatus, stream, caseStudy, toast]);

  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingStatus === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleRetry = () => {
    setRecordingStatus('idle');
    if (recordedMediaURL) {
      URL.revokeObjectURL(recordedMediaURL);
    }
    setRecordedMediaURL(null);
    setTranscript('');
    recordedChunksRef.current = [];
    mediaRecorderRef.current = null;
  };

  const handleSubmit = () => {
    setRecordingStatus('submitted');
  };

  const renderResponseUI = () => {
    if (!caseStudy) return null;

    if (recordingStatus === 'submitted') {
        const studentAnswer = caseStudy.type === 'mcq' 
            ? (caseStudy.mcqs?.flatMap(m => m.options).find(o => o.id === selectedMCQOption)?.text || "No option selected")
            : transcript || "Media Response";

        return (
            <PostSubmissionScreen 
                userName="Nyra" 
                onDone={() => router.push('/dashboard/case-studies')} 
                caseStudy={caseStudy}
                userAnswer={studentAnswer}
                recordedMediaURL={recordedMediaURL}
            />
        );
    }

    if (caseStudy.type === 'mcq') {
      return (
        <div className="w-full space-y-6">
          {caseStudy.mcqs?.map((mcq) => (
            <div key={mcq.id} className="bg-card p-4 rounded-xl">
              <p className="font-semibold mb-4">{mcq.question}</p>
              <RadioGroup onValueChange={setSelectedMCQOption} value={selectedMCQOption || ""}>
                {mcq.options.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2 bg-muted p-3 rounded-lg">
                    <RadioGroupItem value={option.id} id={option.id} />
                    <Label htmlFor={option.id} className="flex-1">{option.text}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
          <Button 
            size="lg" 
            onClick={handleSubmit} 
            disabled={!selectedMCQOption}
            className="w-full h-14 rounded-full text-lg"
          >
            Submit Answer
          </Button>
        </div>
      );
    }

    switch (recordingStatus) {
      case 'idle':
        return (
          <>
            {permissionError && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Access Denied</AlertTitle>
                <AlertDescription>
                  Please click the <b>lock icon</b> next to the URL in your browser address bar and set Camera/Microphone to <b>Allow</b>.
                </AlertDescription>
              </Alert>
            )}
            <Button size="lg" onClick={handlePermissions} className="w-full h-14 rounded-full text-lg">
              {caseStudy.type === 'video' ? <Video className="w-6 h-6 mr-2" /> : <Mic className="w-6 h-6 mr-2" />}
              Start Recording
            </Button>
            <p className="text-muted-foreground mt-4">Nirmaan will listen to your {caseStudy.type} answer.</p>
          </>
        );
      case 'permission':
        return <p className="text-muted-foreground">Requesting permissions...</p>;
      case 'recording':
        return (
          <div className="w-full flex flex-col items-center gap-4">
             {caseStudy.type === 'video' ? (
                <div className="w-full aspect-video rounded-lg bg-black relative overflow-hidden shadow-lg">
                    <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                    <div className="absolute top-2 left-2 flex items-center gap-2 bg-black/50 text-white px-2 py-1 rounded-md text-xs">
                        <Circle className="w-3 h-3 fill-red-500 text-red-500" />
                        <span>Recording...</span>
                    </div>
                </div>
            ) : (
                <div className="w-full h-48 flex flex-col items-center justify-center bg-primary/10 rounded-lg">
                    <Volume2 className="w-24 h-24 text-primary/50 animate-pulse" />
                    <p className="text-muted-foreground mt-2">Nirmaan is listening...</p>
                </div>
            )}
            <div className="bg-muted p-4 rounded-lg w-full min-h-[60px] text-sm italic">
              {transcript || "Speak clearly..."}
            </div>
            <Button size="lg" onClick={stopRecording} className="rounded-full w-20 h-20 bg-red-500 hover:bg-red-600 shadow-xl">
              <Square className="w-8 h-8 fill-white" />
            </Button>
            <p className="text-muted-foreground">Tap to stop recording</p>
          </div>
        );
      case 'recorded':
        return (
          <div className="w-full flex flex-col items-center gap-4">
            <p className="font-semibold text-lg">Review your response</p>
            <div className="w-full bg-muted p-6 rounded-xl border-2 border-primary/20">
               <p className="text-primary font-bold mb-2">Transcript (Preview):</p>
               <p className="italic text-lg">"{transcript || "Ready to submit."}"</p>
            </div>
            <div className="flex w-full gap-4 mt-4">
               <Button size="lg" variant="outline" onClick={handleRetry} className="w-full h-14 rounded-full text-lg">
                    <RefreshCw className="w-6 h-6 mr-2" /> Retry
                </Button>
                <Button size="lg" onClick={handleSubmit} className="w-full h-14 rounded-full text-lg">
                    <Send className="w-6 h-6 mr-2" /> Submit
                </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!caseStudy) {
    return notFound();
  }

  const isPostSubmission = recordingStatus === 'submitted';

  return (
    <div className="flex flex-col min-h-screen max-w-2xl mx-auto bg-background">
      <header className="flex items-center w-full p-4 sticky top-0 bg-background z-10 border-b">
        <Button variant="ghost" size="icon" onClick={() => isPostSubmission ? router.push('/dashboard/case-studies') : router.back()} className="mr-4">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div className="bg-primary/20 text-primary p-2 rounded-lg">
          <Image src="https://picsum.photos/seed/nirmaan/48/48" alt="Nirmaan Logo" width={24} height={24} className="h-auto rounded-md" />
        </div>
        <div className="text-right flex-grow">
          <p className="text-sm font-semibold text-muted-foreground">Case Study #{caseStudy.caseNumber}</p>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center p-4 pb-24">
        {!isPostSubmission && (
          <>
            <div className="bg-orange-100 p-6 rounded-2xl w-full relative mb-6">
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-purple-300 rounded-full flex items-center justify-center">
                <span className="text-3xl">🙋‍♀️</span>
              </div>
              <h2 className="text-xl font-bold mb-4">Hi Nyra !</h2>
              <p className="font-semibold mb-4">Imagine this situation:</p>
              <div className="flex items-start gap-4">
                <p className="mb-4 flex-1">{caseStudy.content?.scenario}</p>
              </div>
              <p className="font-semibold">Now She comes to you and says:</p>
              <p className="italic">'{caseStudy.content?.quote}'</p>
            </div>

            <div className="text-left w-full space-y-4 mb-8">
              <p className="font-semibold">{caseStudy.content?.prompt}</p>
              {caseStudy.content?.dilemma && (
                <p className="text-lg font-bold" dangerouslySetInnerHTML={{ __html: caseStudy.content.dilemma }} />
              )}
              <p>{caseStudy.content?.explanation}</p>
            </div>
          </>
        )}
        
        {renderResponseUI()}
      </main>
    </div>
  );
}
