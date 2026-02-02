
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send, Mic } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { chatWithNirmaan } from '@/ai/flows/nirmaan-chat-flow';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getMainUser } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { User } from '@/lib/types';


type Message = {
    role: 'user' | 'model';
    text: string;
};

const BotIcon = () => (
    <div className="relative flex-shrink-0">
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
    </div>
);


export default function ChatPage() {
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [mainUser, setMainUser] = useState<User | null>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
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
    }, [isClient]);

    // Fetch initial message
    useEffect(() => {
        if (!isClient) return;
        async function getInitialMessage() {
            try {
                const response = await chatWithNirmaan({ history: [] });
                setMessages([{ role: 'model', text: response }]);
            } catch (error) {
                console.error("Error getting initial message:", error);
                setMessages([{ role: 'model', text: "Hello! I'm having a little trouble starting our chat right now. Please try again in a moment." }]);
            } finally {
                setIsLoading(false);
            }
        }
        getInitialMessage();
    }, [isClient]);

    // Auto-scroll
    useEffect(() => {
        if (!isClient) return;
        const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }, [messages, isLoading, isClient]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', text: input };
        const userMessageText = input; // Save the message before clearing
        
        // Add user message to UI immediately
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // Build history from the messages state *before* adding the new one.
        const chatHistory = messages.map(msg => ({
            role: msg.role,
            content: [{ text: msg.text }],
        }));

        try {
            // Pass history + new message separately
            const response = await chatWithNirmaan({ 
                history: chatHistory,
                message: userMessageText 
            });
            setMessages(prev => [...prev, { role: 'model', text: response }]);
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev => [...prev, { role: 'model', text: "Oops! Something went wrong. Let's try that again." }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const userAvatar = mainUser ? PlaceHolderImages.find(p => p.id === mainUser.avatarUrl) : null;

    if (!isClient) {
        return null;
    }

    return (
        <div className="flex flex-col h-screen bg-background">
            <header className="flex items-center p-4 border-b">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-4">
                    <ArrowLeft />
                </Button>
                <div className="flex items-center gap-3">
                    <BotIcon />
                    <div>
                        <h1 className="text-lg font-bold">Nirmaan AI</h1>
                        <p className="text-xs text-muted-foreground">Your friendly mentor</p>
                    </div>
                </div>
            </header>

            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                 <div className="flex flex-col gap-4">
                    {messages.map((message, index) => (
                        <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                             {message.role === 'model' && <BotIcon />}
                            <div className={`rounded-2xl p-3 max-w-sm ${message.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted rounded-bl-none'}`}>
                                <p className="whitespace-pre-wrap">{message.text}</p>
                            </div>
                             {message.role === 'user' && mainUser && (
                                <Avatar className="w-10 h-10">
                                    {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt={mainUser.name} data-ai-hint={userAvatar.imageHint} />}
                                    <AvatarFallback>{mainUser.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                             )}
                        </div>
                    ))}
                    {isLoading && messages.length > 0 && (
                         <div className="flex items-start gap-3">
                            <BotIcon />
                            <div className="rounded-2xl p-3 max-w-sm bg-muted rounded-bl-none">
                                <div className="flex items-center gap-1.5">
                                    <span className="h-2 w-2 rounded-full bg-slate-400 animate-pulse delay-0"></span>
                                    <span className="h-2 w-2 rounded-full bg-slate-400 animate-pulse delay-150"></span>
                                    <span className="h-2 w-2 rounded-full bg-slate-400 animate-pulse delay-300"></span>
                                </div>
                            </div>
                         </div>
                    )}
                 </div>
            </ScrollArea>
            
            <footer className="p-4 border-t bg-background">
                <div className="flex flex-col items-center gap-4">
                     <Button variant="outline" size="icon" className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/30 text-primary hover:bg-primary/20" disabled={true}>
                        <Mic className="w-10 h-10" />
                    </Button>
                    <div className="flex items-center gap-2 w-full">
                        <Input 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type your message..." 
                            className="flex-1"
                            disabled={isLoading}
                        />
                        <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
                            <Send />
                        </Button>
                    </div>
                </div>
            </footer>
        </div>
    );
}
