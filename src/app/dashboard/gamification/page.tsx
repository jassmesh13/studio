
'use client';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getGamificationData, getMainUser } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Crown, Flame, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useEffect, useState } from 'react';
import type { Gamification, User } from '@/lib/types';

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
        return <div>Loading...</div>;
    }


  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-6">Gamification</h1>
      
      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Points</CardTitle>
                <Star className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{gamificationData.points.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">All-time points earned</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                <Flame className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{gamificationData.streak} Days</div>
                <p className="text-xs text-muted-foreground">Keep it going!</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Leaderboard Rank</CardTitle>
                <Crown className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">#{mainUser.rank}</div>
                <p className="text-xs text-muted-foreground">Among all learners</p>
            </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                <CardTitle>Leaderboard</CardTitle>
                <CardDescription>See how you stack up against other learners.</CardDescription>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead className="w-[80px]">Rank</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead className="text-right">Points</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {gamificationData.leaderboard.map((user) => {
                        const avatar = PlaceHolderImages.find(p => p.id === user.avatarUrl);
                        return (
                        <TableRow key={user.id} className={cn(user.id === mainUser.id && 'bg-accent')}>
                            <TableCell className="font-bold text-lg">{user.rank}</TableCell>
                            <TableCell>
                            <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                    {avatar && <AvatarImage src={avatar.imageUrl} alt={user.name} data-ai-hint={avatar.imageHint} />}
                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span>{user.name}</span>
                            </div>
                            </TableCell>
                            <TableCell className="text-right font-medium">{user.points.toLocaleString()}</TableCell>
                        </TableRow>
                        );
                    })}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
        </div>

        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Your Badges</CardTitle>
                    <CardDescription>Achievements you&apos;ve unlocked.</CardDescription>
                </CardHeader>
                <CardContent>
                    <TooltipProvider>
                        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-4">
                        {gamificationData.badges.map(badge => {
                            const image = PlaceHolderImages.find(p => p.id === badge.imageUrl);
                            return (
                            <Tooltip key={badge.id}>
                                <TooltipTrigger asChild>
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="relative w-20 h-20">
                                            {image && (
                                                <Image src={image.imageUrl} alt={badge.name} data-ai-hint={image.imageHint} fill className="rounded-full object-cover" />
                                            )}
                                        </div>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="font-bold">{badge.name}</p>
                                    <p>{badge.description}</p>
                                </TooltipContent>
                            </Tooltip>
                            )
                        })}
                        </div>
                    </TooltipProvider>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
