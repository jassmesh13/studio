import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { pendingTasks } from "@/lib/data";
import { AlarmClock, Target, Clock } from "lucide-react";

export function PendingTasks() {
    const iconMap = {
        'Homework tasks': <AlarmClock className="w-8 h-8 text-blue-500" />,
        'Communication skill exercise': <Target className="w-8 h-8 text-green-500" />
    } as const;

    return (
        <Card className="bg-accent">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-primary">Pending Tasks!</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
                {pendingTasks.map(task => (
                    <div key={task.id} className="flex items-center gap-4 bg-card p-3 rounded-lg">
                        {iconMap[task.title as keyof typeof iconMap]}
                        <div className="flex-1">
                            <div className="flex justify-between items-center">
                                <label htmlFor={`task-${task.id}`} className="font-semibold text-sm leading-none">
                                    {task.title}
                                </label>
                                <p className="text-xs text-muted-foreground text-right">{task.progress.current}/{task.progress.total}</p>
                            </div>
                            <Progress value={(task.progress.current / task.progress.total) * 100} className="h-2 mt-1 bg-muted" indicatorClassName={'bg-yellow-400'}/>
                            <div className="flex items-center justify-end gap-1 mt-1 text-red-500 animate-pulse">
                                <Clock className="w-3 h-3" />
                                <p className="text-xs font-semibold">Finish before 8 PM!</p>
                            </div>
                        </div>
                        <div className="bg-green-100 text-green-700 p-2 rounded-md text-center text-xs font-bold">
                            <p>+5</p>
                            <p>Points</p>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
