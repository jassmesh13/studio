"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, Edit, Award } from "lucide-react";

export function CaseStudyWidget() {

  return (
    <Card className="bg-accent">
        <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-bold">You have submitted a total <span className="text-primary">12 Case studies</span> this month!</CardTitle>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="flex items-center gap-2">
                            Monthly <ChevronDown className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>Monthly</DropdownMenuItem>
                        <DropdownMenuItem>Quarterly</DropdownMenuItem>
                        <DropdownMenuItem>Yearly</DropdownMenuItem>
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
                        strokeDasharray="74, 100"
                        strokeLinecap="round"
                    />
                </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold">37<span className="text-muted-foreground text-2xl">/50</span></span>
                    <span className="text-sm text-muted-foreground">Participation</span>
                 </div>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full">
                <Card className="p-4 flex flex-col items-center justify-center text-center">
                    <div className="flex items-center gap-2">
                        <p className="text-2xl font-bold">4/5</p>
                        <Edit className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">Assignments Submitted</p>
                </Card>
                <Card className="p-4 flex flex-col items-center justify-center text-center bg-primary text-primary-foreground">
                    <div className="flex items-center gap-2">
                        <p className="text-2xl font-bold">13</p>
                        <Award className="w-5 h-5" />
                    </div>
                    <p className="text-sm">Quiz Won</p>
                </Card>
            </div>
        </CardContent>
    </Card>
  );
}
