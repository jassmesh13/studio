
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send, Mic, MicOff, Volume2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { chatWithNirmaan } from '@/ai/flows/nirmaan-chat-flow';
import { generateSpeech } from '@/ai/flows/tts-flow';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getMainUser } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { User } from '@/lib/types';
import { cn } from '@/lib/utils';

type Message = {
    role: 'user' | 'model';
    text: string;
};

// Types for Web Speech API
interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start: () => void;
    stop: () => void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: any) => void;
    onend: () => void;
}

declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

const BotIcon = ({ isSpeaking }: { isSpeaking?: boolean }) => (
    <div className={cn("relative flex-shrink-0 transition-all", isSpeaking && "scale-110 shadow-primary/50 shadow-2xl")}>
        <svg width="40" height="40" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                <span className="flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
            </div>
        )}
    </div>
);

export default function ChatPage() {
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [mainUser, setMainUser] = useState<User | null>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient) return;
        const fetchUser = async () => {
            const user = await getMainUser();
            setMainUser(user);
        };
        fetchUser();

        // Initialize Speech Recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                setIsListening(false);
                // Automatically send if speech is captured
                handleSend(transcript);
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error('Speech recognition error', event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, [isClient]);

    // Initial greeting
    useEffect(() => {
        if (!isClient) return;
        const startChat = async () => {
            setIsLoading(true);
            try {
                const response = await chatWithNirmaan({ history: [] });
                setMessages([{ role: 'model', text: response }]);
                speakText(response);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        startChat();
    }, [isClient]);

    // Auto-scroll
    useEffect(() => {
        if (!isClient) return;
        const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }, [messages, isLoading, isClient]);

    const speakText = async (text: string) => {
        setIsSpeaking(true);
        try {
            const { audioUri } = await generateSpeech({ text });
            if (audioRef.current) {
                audioRef.current.src = audioUri;
                audioRef.current.play();
                audioRef.current.onended = () => setIsSpeaking(false);
            }
        } catch (error) {
            console.error("TTS Error:", error);
            setIsSpeaking(false);
        }
    };

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            setInput('');
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };

    const handleSend = async (textToSend?: string) => {
        const messageText = textToSend || input;
        if (!messageText.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', text: messageText };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const chatHistory = messages.map(msg => ({
            role: msg.role,
            content: [{ text: msg.text }],
        }));

        try {
            const response = await chatWithNirmaan({ 
                history: chatHistory,
                message: messageText 
            });
            setMessages(prev => [...prev, { role: 'model', text: response }]);
            speakText(response);
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev => [...prev, { role: 'model', text: "Oops! My internet is a bit sleepy. Can we try again?" }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const userAvatar = mainUser ? PlaceHolderImages.find(p => p.id === mainUser.avatarUrl) : null;

    if (!isClient) return null;

    return (
        <div className="flex flex-col h-screen bg-background overflow-hidden">
            <audio ref={audioRef} className="hidden" />
            <header className="flex items-center p-4 border-b bg-card">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-4">
                    <ArrowLeft />
                </Button>
                <div className="flex items-center gap-3">
                    <BotIcon isSpeaking={isSpeaking} />
                    <div>
                        <h1 className="text-lg font-bold">Nirmaan AI</h1>
                        <p className="text-xs text-muted-foreground">English Practice Buddy ✨</p>
                    </div>
                </div>
            </header>

            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                 <div className="flex flex-col gap-6 max-w-2xl mx-auto py-4">
                    {messages.map((message, index) => (
                        <div key={index} className={cn("flex items-start gap-3", message.role === 'user' ? 'justify-end' : '')}>
                             {message.role === 'model' && <BotIcon isSpeaking={index === messages.length - 1 && isSpeaking} />}
                            <div className={cn(
                                "rounded-2xl p-4 shadow-sm transition-all",
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
                         <div className="flex items-start gap-3">
                            <BotIcon />
                            <div className="rounded-2xl p-4 bg-muted rounded-bl-none">
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce delay-0"></span>
                                    <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce delay-150"></span>
                                    <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce delay-300"></span>
                                </div>
                            </div>
                         </div>
                    )}
                 </div>
            </ScrollArea>
            
            <footer className="p-6 border-t bg-card">
                <div className="flex flex-col items-center gap-6 max-w-2xl mx-auto">
                    <div className="relative group">
                        {isListening && (
                            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                        )}
                        <Button 
                            variant={isListening ? "destructive" : "default"}
                            size="icon" 
                            className={cn(
                                "w-24 h-24 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95",
                                isListening && "bg-red-500 hover:bg-red-600"
                            )}
                            onClick={toggleListening}
                            disabled={isLoading}
                        >
                            {isListening ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
                        </Button>
                        <p className="text-center mt-3 font-bold text-primary animate-pulse">
                            {isListening ? "Listening..." : "Tap to Speak"}
                        </p>
                    </div>

                    <div className="flex items-center gap-3 w-full">
                        <Input 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type here if you prefer..." 
                            className="flex-1 h-12 rounded-full px-6 bg-muted/50 border-none"
                            disabled={isLoading}
                        />
                        <Button 
                            onClick={() => handleSend()} 
                            disabled={isLoading || !input.trim()}
                            size="icon"
                            className="h-12 w-12 rounded-full shadow-lg"
                        >
                            <Send className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </footer>
        </div>
    );
}
