import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { pendingTasks } from "@/lib/data";

export function PendingTasks() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Pending Tasks</CardTitle>
                <CardDescription>You have {pendingTasks.length} tasks to complete.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                {pendingTasks.map(task => (
                <div key={task.id} className="flex items-start gap-3">
                    <Checkbox id={`task-${task.id}`} className="mt-1" />
                    <div className="grid gap-0.5">
                        <label htmlFor={`task-${task.id}`} className="font-medium text-sm leading-none cursor-pointer">
                            {task.title}
                        </label>
                        <p className="text-xs text-muted-foreground">Due in {task.dueDate}</p>
                    </div>
                </div>
                ))}
            </CardContent>
            <CardFooter>
                <Button className="w-full">View All Tasks</Button>
            </CardFooter>
        </Card>
    )
}
