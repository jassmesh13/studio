'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send, Mic, MicOff, Loader2, AlertCircle, Volume2, Sparkles } from 'lucide-react';
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
    const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const pendingTranscriptRef = useRef<string>('');

    // Turn Locking: Bot is busy if thinking or speaking
    const isBotBusy = isLoading || isSpeaking;

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
                recognition.continuous = true;
                recognition.interimResults = false;
                recognition.lang = 'en-US';

                recognition.onstart = () => {
                    if (isBotBusy) {
                        recognition.stop();
                        return;
                    }
                    setIsListening(true);
                    pendingTranscriptRef.current = '';
                };
                recognition.onend = () => setIsListening(false);
                recognition.onresult = (event: any) => {
                    if (isBotBusy) return;
                    
                    if (silenceTimerRef.current) {
                        clearTimeout(silenceTimerRef.current);
                    }

                    let resultTranscript = '';
                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        if (event.results[i].isFinal) {
                            resultTranscript += event.results[i][0].transcript;
                        }
                    }

                    if (resultTranscript.trim()) {
                        pendingTranscriptRef.current += ' ' + resultTranscript.trim();
                        
                        silenceTimerRef.current = setTimeout(() => {
                            const finalTranscript = pendingTranscriptRef.current.trim();
                            if (finalTranscript) {
                                handleSend(finalTranscript);
                                pendingTranscriptRef.current = '';
                                recognition.stop();
                            }
                            silenceTimerRef.current = null;
                        }, 2500);
                    }
                };
                recognition.onerror = (event: any) => {
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
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        };
    }, [isBotBusy]);

    const initializeChat = async () => {
        setIsLoading(true);
        try {
            const responseText = await chatWithNirmaan({ history: [] });
            const { audioUri } = await generateSpeech({ text: responseText });
            
            const msgId = 'init-' + Math.random().toString(36).substring(7);
            const newMessage: Message = { 
                id: msgId, 
                role: 'model', 
                text: responseText, 
                audioUri 
            };
            setMessages([newMessage]);
            setIsLoading(false);
            playAudio(audioUri, msgId);
        } catch (err) {
            console.error("Initial chat error:", err);
            setIsLoading(false);
        }
    };

    const playAudio = (uri: string, id: string) => {
        if (!audioRef.current) return;
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

        if (isBotBusy) return;

        if (isListening) {
            if (silenceTimerRef.current) {
                clearTimeout(silenceTimerRef.current);
                silenceTimerRef.current = null;
            }
            if (pendingTranscriptRef.current.trim()) {
                handleSend(pendingTranscriptRef.current.trim());
                pendingTranscriptRef.current = '';
            }
            recognitionRef.current.stop();
        } else {
            setInput('');
            setPermissionError(false);
            pendingTranscriptRef.current = '';
            try {
                recognitionRef.current.start();
            } catch (err) {
                setIsListening(false);
            }
        }
    };

    const handleSend = async (textToSend?: string) => {
        const messageText = textToSend || input;
        
        if (!messageText.trim() || isBotBusy) return;

        if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
        }

        if (isListening && recognitionRef.current) {
            recognitionRef.current.stop();
        }

        const userMsgId = 'user-' + Math.random().toString(36).substring(7);
        const currentMessages = [...messages, { id: userMsgId, role: 'user', text: messageText } as Message];
        setMessages(currentMessages);
        setInput('');
        setIsLoading(true);

        const chatHistory = currentMessages.map(msg => ({
            role: msg.role,
            content: [{ text: msg.text }],
        }));

        try {
            const responseText = await chatWithNirmaan({ 
                history: chatHistory.slice(0, -1),
                message: messageText 
            });
            
            const { audioUri } = await generateSpeech({ text: responseText });

            const botMsgId = 'bot-' + Math.random().toString(36).substring(7);
            const finalMessage: Message = { 
                id: botMsgId, 
                role: 'model', 
                text: responseText, 
                audioUri 
            };
            
            setMessages(prev => [...prev, finalMessage]);
            setIsLoading(false);
            playAudio(audioUri, botMsgId);

        } catch (error) {
            console.error("Error sending message:", error);
            setIsLoading(false);
            setMessages(prev => [...prev, { 
                id: 'err-' + Date.now(), 
                role: 'model', 
                text: "Oops! My internet is a bit sleepy. Can we try again?" 
            }]);
        }
    };

    if (!isMounted) return null;

    const userAvatar = mainUser ? PlaceHolderImages.find(p => p.id === mainUser.avatarUrl) : null;

    return (
        <div className="flex flex-col h-screen bg-background overflow-hidden">
            <audio ref={audioRef} className="hidden" />
            
            <header className="flex items-center p-4 border-b bg-card z-20 shadow-sm">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2">
                    <ArrowLeft className="w-6 h-6" />
                </Button>
                <div className="flex items-center gap-3">
                    <BotIcon isSpeaking={isSpeaking} isThinking={isLoading} />
                    <div>
                        <h1 className="text-lg font-bold text-primary">Nirmaan Bot ✨</h1>
                        <p className="text-xs text-muted-foreground">Your English Buddy</p>
                    </div>
                </div>
            </header>

            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                 <div className="flex flex-col gap-6 max-w-2xl mx-auto py-4">
                    {permissionError && (
                      <Alert variant="destructive" className="animate-in slide-in-from-top duration-300">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Microphone Access Required</AlertTitle>
                        <AlertDescription>
                          Please allow microphone access to talk to Nirmaan.
                        </AlertDescription>
                      </Alert>
                    )}
                    {messages.map((message) => (
                        <div key={message.id} className={cn("flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300", message.role === 'user' ? 'flex-row-reverse' : '')}>
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
                         <div className="flex items-start gap-3 animate-in fade-in duration-300">
                            <BotIcon isThinking />
                            <div className="rounded-2xl p-4 bg-primary/5 border border-primary/20 rounded-bl-none flex items-center gap-3">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                                </div>
                                <p className="text-sm font-medium text-primary/80 italic">Nirmaan is preparing a special message...</p>
                            </div>
                         </div>
                    )}
                 </div>
            </ScrollArea>
            
            <footer className="p-6 border-t bg-card relative z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="flex flex-col items-center gap-6 max-w-2xl mx-auto">
                    <div className="flex flex-col items-center gap-2">
                        <div className="relative">
                            {(isListening && !isBotBusy) && (
                                <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                            )}
                            <Button 
                                variant={isListening ? "destructive" : "default"}
                                size="icon" 
                                className={cn(
                                    "w-24 h-24 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95",
                                    isListening && "bg-red-500 hover:bg-red-600",
                                    isBotBusy && "opacity-50 grayscale cursor-not-allowed scale-90"
                                )}
                                onClick={toggleListening}
                                disabled={isBotBusy}
                            >
                                {isListening ? <MicOff className="w-12 h-12" /> : <Mic className="w-12 h-12" />}
                            </Button>
                        </div>
                        <p className={cn("text-sm font-bold transition-colors", 
                            isListening ? "text-red-500 animate-pulse" : 
                            isBotBusy ? "text-muted-foreground" : "text-primary"
                        )}>
                            {isListening ? "Listening..." : isBotBusy ? "Nirmaan is talking..." : "Tap to Speak"}
                        </p>
                    </div>

                    <div className="flex items-center gap-2 w-full">
                        <Input 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={isBotBusy ? "Wait for Nirmaan..." : "Type a message..."} 
                            className="flex-1 h-12 rounded-full px-6 bg-muted border-none focus-visible:ring-primary shadow-inner"
                            disabled={isBotBusy}
                        />
                        <Button 
                            onClick={() => handleSend()} 
                            disabled={isBotBusy || !input.trim()}
                            size="icon"
                            className="h-12 w-12 rounded-full shadow-md hover:shadow-lg transition-all"
                        >
                            <Send className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </footer>
        </div>
    );
}