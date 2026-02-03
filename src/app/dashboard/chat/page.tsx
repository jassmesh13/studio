'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send, Mic, MicOff, Loader2, AlertCircle, Volume2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { chatWithNirmaan } from '@/ai/flows/nirmaan-chat-flow';
import { generateSpeech } from '@/ai/flows/tts-flow';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getMainUser } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { User } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type Message = {
    id: string;
    role: 'user' | 'model';
    text: string;
    audioUri?: string;
    isGeneratingAudio?: boolean;
};

const BotIcon = ({ isSpeaking, isThinking }: { isSpeaking?: boolean; isThinking?: boolean }) => (
    <div className={cn(
        "relative flex-shrink-0 transition-all duration-300", 
        isSpeaking && "scale-110",
        isThinking && "animate-pulse"
    )}>
        <svg width="48" height="48" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="32" fill="#FFC107"/>
            <path d="M16 32C16 22.0589 24.0589 14 34 14C43.9411 14 52 22.0589 52 32" stroke="white" strokeWidth="6"/>
            <rect x="12" y="29" width="8" height="16" rx="4" fill="white"/>
            <rect x="44" y="29" width="8" height="16" rx="4" fill="white"/>
            <rect x="18" y="24" width="28" height="22" rx="4" fill="#673AB7"/>
            <circle cx="27" cy="31" r="3" fill="white"/>
            <circle cx="37" cy="31" r="3" fill="white"/>
            <rect x="25" y="38" width="14" height="3" rx="1.5" fill="white"/>
            <rect x="23" y="49" width="18" height="10" rx="3" fill="#F44336"/>
            <text fill="white" xmlSpace="preserve" style={{whiteSpace: 'pre'}} fontFamily="sans-serif" fontSize="8" fontWeight="bold" letterSpacing="0em"><tspan x="26" y="56.5">BOT</tspan></text>
        </svg>
        {isSpeaking && (
            <div className="absolute -top-1 -right-1">
                <span className="flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-primary"></span>
                </span>
            </div>
        )}
    </div>
);

export default function ChatPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [permissionError, setPermissionError] = useState(false);
    const [mainUser, setMainUser] = useState<User | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const recognitionRef = useRef<any>(null);
    const hasInitializedGreeting = useRef(false);
    const lastAudioIdRef = useRef<string | null>(null);

    useEffect(() => {
        setIsMounted(true);
        
        const fetchUser = async () => {
            try {
                const user = await getMainUser();
                setMainUser(user);
            } catch (err) {
                console.error("Failed to fetch user:", err);
            }
        };
        fetchUser();

        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = false;
                recognition.interimResults = false;
                recognition.lang = 'en-US';

                recognition.onstart = () => setIsListening(true);
                recognition.onend = () => setIsListening(false);
                recognition.onresult = (event: any) => {
                    const transcript = event.results[0][0].transcript;
                    if (transcript) handleSend(transcript);
                };
                recognition.onerror = (event: any) => {
                    console.error('Speech recognition error', event.error);
                    setIsListening(false);
                    if (event.error === 'not-allowed') setPermissionError(true);
                };
                recognitionRef.current = recognition;
            }
        }

        if (!hasInitializedGreeting.current) {
            hasInitializedGreeting.current = true;
            initializeChat();
        }

        return () => {
            if (recognitionRef.current) recognitionRef.current.stop();
        };
    }, []);

    const initializeChat = async () => {
        setIsLoading(true);
        try {
            const response = await chatWithNirmaan({ history: [] });
            const msgId = Math.random().toString(36).substring(7);
            const newMessage: Message = { 
                id: msgId, 
                role: 'model', 
                text: response.text, 
                isGeneratingAudio: true 
            };
            setMessages([newMessage]);
            // Background TTS
            triggerTTS(response.text, msgId);
        } catch (err) {
            console.error("Initial chat error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const triggerTTS = async (text: string, messageId: string) => {
        try {
            const { audioUri } = await generateSpeech({ text });
            setMessages(prev => prev.map(m => 
                m.id === messageId 
                ? { ...m, audioUri, isGeneratingAudio: false } 
                : m
            ));
            // Auto-play the audio if it's the latest model message
            playAudio(audioUri, messageId);
        } catch (error) {
            console.error("TTS generation failed:", error);
            setMessages(prev => prev.map(m => 
                m.id === messageId ? { ...m, isGeneratingAudio: false } : m
            ));
        }
    };

    const playAudio = (uri: string, id: string) => {
        if (!audioRef.current) return;
        // Don't play if we already played this specific message's audio
        if (lastAudioIdRef.current === id) return;
        
        lastAudioIdRef.current = id;
        setIsSpeaking(true);
        audioRef.current.src = uri;
        audioRef.current.play().catch(e => {
            console.warn("Audio play blocked or failed:", e);
            setIsSpeaking(false);
        });
        audioRef.current.onended = () => setIsSpeaking(false);
    };

    useEffect(() => {
        if (!isMounted) return;
        const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }, [messages, isLoading, isMounted]);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            toast({ variant: 'destructive', title: 'Not Supported', description: 'Speech recognition is not supported here.' });
            return;
        }
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            setInput('');
            setPermissionError(false);
            try {
                recognitionRef.current.start();
            } catch (err) {
                setIsListening(false);
            }
        }
    };

    const handleSend = async (textToSend?: string) => {
        const messageText = textToSend || input;
        if (!messageText.trim() || isLoading) return;

        const userMsgId = Math.random().toString(36).substring(7);
        setMessages(prev => [...prev, { id: userMsgId, role: 'user', text: messageText }]);
        setInput('');
        setIsLoading(true);
        setIsListening(false);

        const chatHistory = messages.map(msg => ({
            role: msg.role,
            content: [{ text: msg.text }],
        }));

        try {
            // STEP 1: Get Text Response (Fast Path)
            const response = await chatWithNirmaan({ 
                history: chatHistory,
                message: messageText 
            });
            
            const botMsgId = Math.random().toString(36).substring(7);
            setMessages(prev => [...prev, { 
                id: botMsgId, 
                role: 'model', 
                text: response.text, 
                isGeneratingAudio: true 
            }]);
            
            // Text is now visible, stop main loading
            setIsLoading(false);

            // STEP 2: Trigger TTS (Slow Path / Background)
            triggerTTS(response.text, botMsgId);

        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev => [...prev, { 
                id: 'err-' + Date.now(), 
                role: 'model', 
                text: "Oops! My internet is a bit sleepy. Can we try again?" 
            }]);
            setIsLoading(false);
        }
    };

    if (!isMounted) return null;

    const userAvatar = mainUser ? PlaceHolderImages.find(p => p.id === mainUser.avatarUrl) : null;

    return (
        <div className="flex flex-col h-screen bg-background overflow-hidden">
            <audio ref={audioRef} className="hidden" />
            
            <header className="flex items-center p-4 border-b bg-card z-20">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2">
                    <ArrowLeft className="w-6 h-6" />
                </Button>
                <div className="flex items-center gap-3">
                    <BotIcon isSpeaking={isSpeaking} isThinking={isLoading} />
                    <div>
                        <h1 className="text-lg font-bold text-primary">Nirmaan Bot ✨</h1>
                        <p className="text-xs text-muted-foreground">English Buddy</p>
                    </div>
                </div>
            </header>

            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                 <div className="flex flex-col gap-6 max-w-2xl mx-auto py-4">
                    {permissionError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Microphone Access Required</AlertTitle>
                        <AlertDescription>
                          Please allow microphone access to talk to Nirmaan.
                        </AlertDescription>
                      </Alert>
                    )}
                    {messages.map((message, index) => (
                        <div key={message.id} className={cn("flex items-start gap-3", message.role === 'user' ? 'flex-row-reverse' : '')}>
                             {message.role === 'model' && (
                                <BotIcon isSpeaking={isSpeaking && message.id === lastAudioIdRef.current} />
                             )}
                            <div className={cn(
                                "relative rounded-2xl p-4 shadow-sm transition-all max-w-[80%]",
                                message.role === 'user' 
                                    ? 'bg-primary text-primary-foreground rounded-br-none' 
                                    : 'bg-card border rounded-bl-none'
                            )}>
                                <p className="whitespace-pre-wrap text-base leading-relaxed">{message.text}</p>
                                {message.isGeneratingAudio && (
                                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground animate-pulse">
                                        <Volume2 className="w-3 h-3" />
                                        Preparing voice...
                                    </div>
                                )}
                            </div>
                             {message.role === 'user' && mainUser && (
                                <Avatar className="w-10 h-10 ring-2 ring-primary/20">
                                    {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt={mainUser.name} data-ai-hint={userAvatar.imageHint} />}
                                    <AvatarFallback>{mainUser.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                             )}
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex items-start gap-3">
                            <BotIcon isThinking />
                            <div className="rounded-2xl p-4 bg-muted rounded-bl-none">
                                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                            </div>
                         </div>
                    )}
                 </div>
            </ScrollArea>
            
            <footer className="p-6 border-t bg-card relative z-20">
                <div className="flex flex-col items-center gap-6 max-w-2xl mx-auto">
                    <div className="flex flex-col items-center gap-2">
                        <div className="relative">
                            {isListening && (
                                <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                            )}
                            <Button 
                                variant={isListening ? "destructive" : "default"}
                                size="icon" 
                                className={cn(
                                    "w-24 h-24 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95",
                                    isListening && "bg-red-500 hover:bg-red-600"
                                )}
                                onClick={toggleListening}
                                disabled={isLoading}
                            >
                                {isListening ? <MicOff className="w-12 h-12" /> : <Mic className="w-12 h-12" />}
                            </Button>
                        </div>
                        <p className={cn("text-sm font-bold transition-colors", isListening ? "text-red-500 animate-pulse" : "text-primary")}>
                            {isListening ? "Listening..." : "Tap to Speak"}
                        </p>
                    </div>

                    <div className="flex items-center gap-2 w-full">
                        <Input 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type a message..." 
                            className="flex-1 h-12 rounded-full px-6 bg-muted border-none focus-visible:ring-primary"
                            disabled={isLoading}
                        />
                        <Button 
                            onClick={() => handleSend()} 
                            disabled={isLoading || !input.trim()}
                            size="icon"
                            className="h-12 w-12 rounded-full shadow-md"
                        >
                            <Send className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </footer>
        </div>
    );
}
