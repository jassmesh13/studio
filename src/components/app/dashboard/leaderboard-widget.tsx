import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { gamificationData, mainUser } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Crown, Trophy } from "lucide-react";

export function LeaderboardWidget() {
    const topThree = gamificationData.leaderboard.slice(0, 3);
    const userRank = mainUser.rank;
    return (
        <Card>
            <CardHeader>
                <CardTitle>Leaderboard</CardTitle>
                <CardDescription>Your current rank is #{userRank}. Keep it up!</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="space-y-4">
                    {topThree.map((user, index) => {
                        const avatar = PlaceHolderImages.find(p => p.id === user.avatarUrl);
                        return (
                            <li key={user.id} className="flex items-center gap-4">
                                <div className="font-bold text-lg w-5 text-center">
                                    {index === 0 ? <Crown className="w-5 h-5 text-yellow-500" /> : user.rank}
                                </div>
                                <Avatar className="h-9 w-9">
                                    {avatar && <AvatarImage src={avatar.imageUrl} alt={user.name} data-ai-hint={avatar.imageHint} />}
                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="font-medium">{user.name}</p>
                                    <p className="text-sm text-muted-foreground">{user.points} points</p>
                                </div>
                                {user.id === mainUser.id && (
                                    <Trophy className="w-5 h-5 text-primary" />
                                )}
                            </li>
                        )
                    })}
                </ul>
            </CardContent>
        </Card>
    )
}
