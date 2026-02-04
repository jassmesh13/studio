'use client';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getGamificationData, getMainUser } from '@/lib/data';
import { Crown, Flame, Star, Award, BadgeCheck, Briefcase, Zap, Heart, Search, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useEffect, useState } from 'react';
import type { Gamification, User } from '@/lib/types';
import * as LucideIcons from 'lucide-react';

export default function GamificationPage() {
    const [gamificationData, setGamificationData] = useState<Gamification | null>(null);
    const [mainUser, setMainUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const [gameData, userData] = await Promise.all([
                getGamificationData(),
                getMainUser()
            ]);
            setGamificationData(gameData);
            setMainUser(userData);
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading || !gamificationData || !mainUser) {
        return <div className="p-8 text-center font-bold text-primary animate-pulse">Loading your achievements...</div>;
    }

    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

    const getBadgeStyles = (id: string) => {
        const styles: Record<string, string> = {
            '1': 'bg-blue-500 shadow-blue-200 ring-blue-100',
            '2': 'bg-orange-500 shadow-orange-200 ring-orange-100',
            '3': 'bg-yellow-500 shadow-yellow-200 ring-yellow-100',
            '4-pro': 'bg-purple-500 shadow-purple-200 ring-purple-100',
            '5-hero': 'bg-green-500 shadow-green-200 ring-green-100',
            '6-star': 'bg-pink-500 shadow-pink-200 ring-pink-100',
        };
        return styles[id] || 'bg-primary shadow-primary/20 ring-primary/10';
    };

    const renderBadgeIcon = (iconName: string) => {
        const Icon = (LucideIcons as any)[iconName] || Award;
        return <Icon className="w-10 h-10 text-white" />;
    };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-yellow-400 p-2 rounded-xl shadow-lg rotate-12">
            <Trophy className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-black font-headline text-primary tracking-tight">Your Hall of Fame</h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3 mb-10">
        <Card className="bg-gradient-to-br from-orange-400 to-orange-500 text-white border-none shadow-xl transform hover:scale-105 transition-transform">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-bold uppercase tracking-wider">Points</CardTitle>
                <Star className="w-5 h-5 text-yellow-200 fill-yellow-200" />
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-black">{gamificationData.points.toLocaleString()}</div>
                <p className="text-xs text-orange-100 mt-1 font-bold">Awesome job, {mainUser.name}!</p>
            </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-400 to-red-500 text-white border-none shadow-xl transform hover:scale-105 transition-transform">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-bold uppercase tracking-wider">Streak</CardTitle>
                <Flame className="w-5 h-5 text-red-200 fill-red-200" />
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-black">{gamificationData.streak} Days</div>
                <p className="text-xs text-red-100 mt-1 font-bold">You're on fire! 🔥</p>
            </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-none shadow-xl transform hover:scale-105 transition-transform">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-bold uppercase tracking-wider">School Rank</CardTitle>
                <Crown className="w-5 h-5 text-purple-200 fill-purple-200" />
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-black">#{mainUser.rank}</div>
                <p className="text-xs text-purple-100 mt-1 font-bold">Top Leader in progress!</p>
            </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
            <Card className="shadow-xl border-none">
                <CardHeader className="bg-muted/30 pb-4">
                    <CardTitle className="text-2xl font-black text-primary flex items-center gap-2">
                        <Users className="w-6 h-6" /> Leaderboard
                    </CardTitle>
                    <CardDescription className="font-bold">See how you stack up against your friends.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                <Table>
                    <TableHeader className="bg-muted/10">
                    <TableRow>
                        <TableHead className="w-[80px] font-black uppercase text-[10px]">Rank</TableHead>
                        <TableHead className="font-black uppercase text-[10px]">Learner</TableHead>
                        <TableHead className="text-right font-black uppercase text-[10px]">Points</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {gamificationData.leaderboard.map((user) => {
                        const isMainUser = user.id === mainUser.id;
                        return (
                        <TableRow key={user.id} className={cn(isMainUser ? 'bg-primary/5' : '', "border-b last:border-0")}>
                            <TableCell className="font-black text-2xl text-muted-foreground/50">
                                {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : user.rank === 3 ? '🥉' : user.rank}
                            </TableCell>
                            <TableCell>
                            <div className="flex items-center gap-3">
                                <Avatar className={cn("h-10 w-10 ring-2", isMainUser ? "ring-primary" : "ring-muted")}>
                                    <AvatarFallback className={cn("font-black", isMainUser ? "bg-primary text-white" : "bg-primary/10 text-primary")}>
                                        {getInitials(user.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <span className={cn("font-bold text-lg", isMainUser ? "text-primary" : "")}>{user.name} {isMainUser && "(You)"}</span>
                            </div>
                            </TableCell>
                            <TableCell className="text-right font-black text-lg text-primary">{user.points.toLocaleString()}</TableCell>
                        </TableRow>
                        );
                    })}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-2">
            <Card className="shadow-xl border-none h-full bg-accent/30">
                <CardHeader>
                    <CardTitle className="text-2xl font-black text-primary flex items-center gap-2">
                        <Award className="w-6 h-6" /> Your Medals
                    </CardTitle>
                    <CardDescription className="font-bold">Shiny rewards for your hard work!</CardDescription>
                </CardHeader>
                <CardContent>
                    <TooltipProvider>
                        <div className="grid grid-cols-2 gap-6">
                        {gamificationData.badges.map(badge => (
                            <Tooltip key={badge.id}>
                                <TooltipTrigger asChild>
                                    <div className="flex flex-col items-center gap-2 group cursor-pointer animate-in zoom-in-50 duration-500">
                                        <div className={cn(
                                            "relative w-24 h-24 rounded-full flex items-center justify-center shadow-xl ring-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3",
                                            getBadgeStyles(badge.id)
                                        )}>
                                            {renderBadgeIcon(badge.icon)}
                                            <div className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full shadow-md">
                                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                            </div>
                                        </div>
                                        <p className="text-xs font-black uppercase tracking-tight text-center mt-2 group-hover:text-primary transition-colors">
                                            {badge.name}
                                        </p>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="p-4 rounded-xl border-none shadow-2xl bg-white text-foreground">
                                    <p className="font-black text-primary text-lg">{badge.name}</p>
                                    <p className="text-sm font-bold text-muted-foreground">{badge.description}</p>
                                </TooltipContent>
                            </Tooltip>
                        ))}
                        </div>
                    </TooltipProvider>
                </CardContent>
                <div className="p-6 pt-0 mt-auto">
                    <div className="bg-white/50 p-4 rounded-2xl border-2 border-dashed border-primary/20 text-center">
                        <p className="text-sm font-black text-primary">Unlock more by learning!</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Next medal: Knowledge Seeker</p>
                    </div>
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
}

import { Users } from 'lucide-react';
