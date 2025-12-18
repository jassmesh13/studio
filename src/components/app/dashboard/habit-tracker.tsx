
'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { getHabits } from "@/lib/data";
import type { Habit } from "@/lib/types";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function HabitTracker() {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [vanishingHabits, setVanishingHabits] = useState<Set<string>>(new Set());
    
    useEffect(() => {
        const fetchHabits = async () => {
            const habitsData = await getHabits();
            setHabits(habitsData);
        };
        fetchHabits();
    }, []);

    const handleHabitCompletion = (habitId: string) => {
        setVanishingHabits(prev => new Set(prev).add(habitId));

        // Remove the habit from the DOM after the animation completes
        setTimeout(() => {
            setHabits(prevHabits => prevHabits.filter(h => h.id !== habitId));
            setVanishingHabits(prev => {
                const newSet = new Set(prev);
                newSet.delete(habitId);
                return newSet;
            });
        }, 500); // Animation duration is 500ms
    };

    if (habits.length === 0 && vanishingHabits.size === 0) {
        return (
            <Card className="bg-accent">
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-primary">Habit Tracker</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-center">No habits to track for today. Great job!</p>
                </CardContent>
            </Card>
        );
    }


    return (
        <Card className="bg-accent">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-primary">Habit Tracker</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
                {habits.map((habit) => (
                    <div 
                        key={habit.id} 
                        className={cn(
                            "bg-card p-4 rounded-2xl shadow transition-all duration-500",
                            vanishingHabits.has(habit.id) && "animate-woosh-out"
                        )}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <p className="font-semibold text-sm">{habit.emoji} {habit.question}</p>
                            <span className="text-xs font-bold text-green-500 bg-green-100 px-2 py-1 rounded-full">
                                +{habit.points} points
                            </span>
                        </div>
                        <RadioGroup 
                            onValueChange={() => handleHabitCompletion(habit.id)} 
                            className="flex justify-between"
                        >
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
