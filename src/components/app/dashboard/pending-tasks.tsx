import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { pendingTasks } from "@/lib/data";
import { AlarmClock, Target } from "lucide-react";

export function PendingTasks() {
    // Assuming the icons exist in data.ts or mapping them here
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
                            <label htmlFor={`task-${task.id}`} className="font-semibold text-sm leading-none">
                                {task.title}
                            </label>
                            <Progress value={(task.progress.current / task.progress.total) * 100} className="h-3 mt-1 bg-muted" indicatorClassName={task.title.includes('Homework') ? 'bg-yellow-400' : 'bg-yellow-400'}/>
                            <p className="text-xs text-muted-foreground text-right">{task.progress.current}/{task.progress.total}</p>
                        </div>
                        <div className="bg-primary/20 text-primary p-2 rounded-md">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-check"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><path d="m9 9.5 2 2 4-4"/></svg>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
