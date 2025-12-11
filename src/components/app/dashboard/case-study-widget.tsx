
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, Edit, Award } from "lucide-react";

type TimeFrame = "Monthly" | "Quarterly" | "Yearly";

const statsData = {
  Monthly: {
    totalStudies: 12,
    participationCurrent: 37,
    participationTotal: 50,
    assignmentsCurrent: 4,
    assignmentsTotal: 5,
    quizzesWon: 13,
  },
  Quarterly: {
    totalStudies: 36,
    participationCurrent: 111,
    participationTotal: 150,
    assignmentsCurrent: 12,
    assignmentsTotal: 15,
    quizzesWon: 39,
  },
  Yearly: {
    totalStudies: 120,
    participationCurrent: 370,
    participationTotal: 500,
    assignmentsCurrent: 40,
    assignmentsTotal: 50,
    quizzesWon: 130,
  },
};

export function CaseStudyWidget() {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("Monthly");
  const currentStats = statsData[timeFrame];
  const participationPercentage = (currentStats.participationCurrent / currentStats.participationTotal) * 100;

  return (
    <Card className="bg-accent">
        <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-bold">You have submitted a total <span className="text-primary">{currentStats.totalStudies} Case studies</span> this {timeFrame.toLowerCase().replace('ly', '')}!</CardTitle>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="flex items-center gap-2">
                            {timeFrame} <ChevronDown className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setTimeFrame("Monthly")}>Monthly</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTimeFrame("Quarterly")}>Quarterly</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTimeFrame("Yearly")}>Yearly</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
            <div className="relative h-40 w-40">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="hsl(var(--border))"
                        strokeWidth="2"
                    />
                    <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="hsl(var(--primary))"
                        strokeWidth="2"
                        strokeDasharray={`${participationPercentage}, 100`}
                        strokeLinecap="round"
                    />
                </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold">{currentStats.participationCurrent}<span className="text-muted-foreground text-2xl">/{currentStats.participationTotal}</span></span>
                    <span className="text-sm text-muted-foreground">Participation</span>
                 </div>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full">
                <Card className="p-4 flex flex-col items-center justify-center text-center">
                    <div className="flex items-center gap-2">
                        <p className="text-2xl font-bold">{currentStats.assignmentsCurrent}/{currentStats.assignmentsTotal}</p>
                        <Edit className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">Assignments Submitted</p>
                </Card>
                <Card className="p-4 flex flex-col items-center justify-center text-center bg-primary text-primary-foreground">
                    <div className="flex items-center gap-2">
                        <p className="text-2xl font-bold">{currentStats.quizzesWon}</p>
                        <Award className="w-5 h-5" />
                    </div>
                    <p className="text-sm">Quiz Won</p>
                </Card>
            </div>
        </CardContent>
    </Card>
  );
}
