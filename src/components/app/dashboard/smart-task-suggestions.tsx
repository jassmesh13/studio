'use client';

import { useState } from 'react';
import { suggestTasks, type SmartTaskSuggestionsOutput } from '@/ai/flows/smart-task-suggestions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Loader2 } from 'lucide-react';

const mockStudentData = {
  studentId: 'student-123',
  pastPerformanceData: JSON.stringify({
    scores: { 'Algebra Basics': 65, 'Geometry Intro': 80, 'Calculus 101': 50 },
    timeSpent: { 'Algebra Basics': 120, 'Geometry Intro': 90, 'Calculus 101': 180 },
    difficultyAreas: ['Derivatives', 'Polynomial factoring'],
  }),
  availableActivities: JSON.stringify([
    { name: 'Algebra Practice Problems', description: 'Practice problems on algebraic equations and factoring.' },
    { name: 'Geometry Shape Explorer', description: 'Interactive tool to explore geometric shapes and their properties.' },
    { name: 'Calculus Video Tutorials', description: 'Video series explaining key concepts in Calculus, including derivatives and integrals.' },
    { name: 'Polynomial Factoring Workshop', description: 'A deep dive workshop on factoring polynomials.' },
  ]),
};

export function SmartTaskSuggestions() {
  const [suggestions, setSuggestions] = useState<SmartTaskSuggestionsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSuggestTasks = async () => {
    setIsLoading(true);
    setError(null);
    setSuggestions(null);
    try {
      const result = await suggestTasks(mockStudentData);
      setSuggestions(result);
    } catch (e) {
      setError('Failed to get suggestions. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="flex flex-row items-center gap-4">
        <Lightbulb className="w-8 h-8 text-primary" />
        <div>
            <CardTitle>Smart Task Suggestions</CardTitle>
            <CardDescription>Let AI help you find the best activities to focus on next.</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center p-8 min-h-[150px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 font-medium">Analyzing your performance...</p>
          </div>
        )}
        {error && <p className="text-destructive text-center p-8">{error}</p>}
        {suggestions && (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-base">Recommended Activities:</h4>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-muted-foreground">
                {suggestions.suggestedActivities.map((activity) => (
                  <li key={activity} className="font-medium text-foreground">{activity}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-base">Reasoning:</h4>
              <p className="text-sm text-muted-foreground mt-1">{suggestions.reasoning}</p>
            </div>
          </div>
        )}
        {!isLoading && !suggestions && (
          <div className="flex flex-col items-center justify-center text-center p-4 border-2 border-dashed rounded-lg min-h-[150px]">
             <p className="mb-4 text-sm text-muted-foreground">Get personalized task suggestions based on your recent performance.</p>
            <Button onClick={handleSuggestTasks} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Suggest Tasks for Me
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
