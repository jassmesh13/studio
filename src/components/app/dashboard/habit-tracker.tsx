
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { habits } from "@/lib/data";

export function HabitTracker() {
    return (
        <Card className="bg-accent">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-primary">Habit Tracker</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
                {habits.map((habit) => (
                    <div key={habit.id} className="bg-card p-4 rounded-2xl shadow">
                        <div className="flex justify-between items-center mb-4">
                            <p className="font-semibold text-sm">{habit.emoji} {habit.question}</p>
                            <span className="text-xs font-bold text-green-500 bg-green-100 px-2 py-1 rounded-full">
                                +{habit.points} points
                            </span>
                        </div>
                        <RadioGroup defaultValue={habit.options[1].value} className="flex justify-between">
                            {habit.options.map((option) => (
                                <div key={option.value} className="flex items-center space-x-2">
                                    <RadioGroupItem value={option.value} id={`${habit.id}-${option.value}`} />
                                    <Label htmlFor={`${habit.id}-${option.value}`} className="text-xs font-medium">
                                        {option.label}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
