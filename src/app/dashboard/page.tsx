import { LeaderboardWidget } from "@/components/app/dashboard/leaderboard-widget";
import { PendingTasks } from "@/components/app/dashboard/pending-tasks";
import { WhatsNew } from "@/components/app/dashboard/whats-new";
import { mainUser } from "@/lib/data";

export default function DashboardPage() {
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl md:text-3xl font-bold font-headline">Welcome back, {mainUser.name}!</h1>
            <div className="grid gap-4 md:gap-8 lg:grid-cols-3">
                <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                        <WhatsNew />
                        <PendingTasks />
                    </div>
                </div>
                <div className="grid auto-rows-max items-start gap-4 md:gap-8">
                    <LeaderboardWidget />
                </div>
            </div>
        </div>
    );
}
