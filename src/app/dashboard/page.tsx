

import { LeaderboardWidget } from "@/components/app/dashboard/leaderboard-widget";
import { PendingTasks } from "@/components/app/dashboard/pending-tasks";
import { WhatsNew } from "@/components/app/dashboard/whats-new";
import { CaseStudyWidget } from "@/components/app/dashboard/case-study-widget";
import { getMainUser } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Settings, Star, Globe, Shield, LogOut } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Image from 'next/image';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { HabitTracker } from "@/components/app/dashboard/habit-tracker";
import { Suspense } from "react";
import { ChatAICard } from "@/components/app/dashboard/chat-ai-card";

async function MainUserSection() {
    const mainUser = await getMainUser();
    const userAvatar = PlaceHolderImages.find(p => p.id === mainUser.avatarUrl);

    return (
        <>
            <div className="bg-accent rounded-2xl p-4 flex flex-col items-center text-center relative">
                <LeaderboardWidget />
                <div className="absolute -bottom-8">
                    <Avatar className="w-16 h-16 border-4 border-white">
                        {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt={mainUser.name} data-ai-hint={userAvatar.imageHint}/>}
                        <AvatarFallback>{mainUser.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                </div>
            </div>

            <Card className="mt-8">
                <CardContent className="flex justify-around p-4">
                    <div className="text-center">
                        <Star className="w-6 h-6 text-primary mx-auto mb-1" />
                        <p className="font-bold text-lg">{mainUser.points}</p>
                        <p className="text-xs text-muted-foreground">POINTS</p>
                    </div>
                    <div className="text-center">
                        <Globe className="w-6 h-6 text-primary mx-auto mb-1" />
                        <p className="font-bold text-lg">#{mainUser.rank}</p>
                        <p className="text-xs text-muted-foreground">SCHOOL RANK</p>
                    </div>
                    <div className="text-center">
                        <Shield className="w-6 h-6 text-primary mx-auto mb-1" />
                        <p className="font-bold text-lg">#56</p>
                        <p className="text-xs text-muted-foreground">CLASS RANK</p>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}

export default function DashboardPage() {
    return (
        <div className="flex flex-col gap-6 pb-24">
            <header className="flex items-center justify-between sticky top-0 bg-background z-10 pt-4 -mt-4 -mx-4 px-4 pb-2">
                <div className="flex items-center gap-4">
                    <div className="bg-primary/20 text-primary p-2 rounded-lg">
                        <Image src="/icon.png" alt="Nirmaan Logo" width={24} height={24} />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold font-headline text-primary">Dashboard</h1>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Settings className="w-7 h-7 text-primary" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>Notifications setting</DropdownMenuItem>
                        <DropdownMenuItem>Privacy setting</DropdownMenuItem>
                        <DropdownMenuItem>Help</DropdownMenuItem>
                        <DropdownMenuItem>Feedback</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/"><LogOut className="mr-2 h-4 w-4" />Signout</Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </header>

            <WhatsNew />
            <PendingTasks />
            <HabitTracker />
            
            <ChatAICard />

            <Suspense fallback={<div>Loading user data...</div>}>
                <MainUserSection />
            </Suspense>

            <CaseStudyWidget />
        </div>
    );
}
