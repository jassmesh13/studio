'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getGamificationData } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import type { Gamification } from "@/lib/types";

export function LeaderboardWidget() {
    const [gamificationData, setGamificationData] = useState<Gamification | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getGamificationData();
            setGamificationData(data);
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading || !gamificationData) {
        return <div>Loading leaderboard...</div>;
    }

    const topThree = gamificationData.leaderboard.slice(0, 3).sort((a,b) => {
        if (a.rank === 1) return -1;
        if (b.rank === 1) return 1;
        return a.rank - b.rank;
    });

    const user1 = topThree.find(u => u.rank === 1);
    const user2 = topThree.find(u => u.rank === 2);
    const user3 = topThree.find(u => u.rank === 3);

    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

    return (
        <div className="w-full">
            <h2 className="text-xl font-bold text-primary mb-4 flex items-center justify-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-400" />
                Leaderboard
                <Trophy className="w-6 h-6 text-yellow-400" />
            </h2>
            <div className="flex items-end justify-center gap-2 w-full max-w-sm mx-auto">
                {/* 2nd Place */}
                {user2 && (
                    <div className="flex flex-col items-center w-1/4">
                        <Avatar className="w-12 h-12 border-2 border-slate-300 bg-primary/10">
                           <AvatarFallback className="font-bold text-primary">{getInitials(user2.name)}</AvatarFallback>
                        </Avatar>
                        <p className="text-sm font-semibold mt-1 truncate">{user2.name}</p>
                        <div className="bg-primary/80 text-white rounded-lg p-2 mt-1 w-full text-center">
                            <p className="font-bold text-xl">2</p>
                            <p className="text-xs">{user2.points} pts</p>
                        </div>
                    </div>
                )}

                {/* 1st Place */}
                {user1 && (
                     <div className="flex flex-col items-center w-1/3">
                        <Avatar className="w-16 h-16 border-4 border-yellow-400 bg-primary/10">
                           <AvatarFallback className="text-xl font-bold text-primary">{getInitials(user1.name)}</AvatarFallback>
                        </Avatar>
                        <p className="text-base font-bold mt-1 text-primary truncate">{user1.name}</p>
                        <div className="bg-primary text-white rounded-lg p-4 mt-1 w-full text-center">
                            <p className="font-bold text-3xl">1</p>
                            <p className="text-sm">{user1.points} pts</p>
                        </div>
                    </div>
                )}

                {/* 3rd Place */}
                {user3 && (
                    <div className="flex flex-col items-center w-1/4">
                        <Avatar className="w-12 h-12 border-2 border-amber-600 bg-primary/10">
                           <AvatarFallback className="font-bold text-primary">{getInitials(user3.name)}</AvatarFallback>
                        </Avatar>
                        <p className="text-sm font-semibold mt-1 truncate">{user3.name}</p>
                        <div className="bg-primary/70 text-white rounded-lg p-2 mt-1 w-full text-center">
                            <p className="font-bold text-xl">3</p>
                            <p className="text-xs">{user3.points} pts</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}