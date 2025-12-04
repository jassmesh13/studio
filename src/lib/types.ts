
import type { LucideIcon } from 'lucide-react';

export type User = {
    id: string;
    name: string;
    avatarUrl: string;
    points: number;
    rank: number;
};

export type Chapter = {
    id: string;
    title: string;
    completed: boolean;
    description?: string;
    imageUrl?: string;
    content: {
        type: 'video' | 'pdf' | 'quiz';
        duration?: string;
        pages?: number;
        questions?: number;
    }
};

export type Course = {
    id: string;
    title: string;
    description: string;
    progress: number;
    imageUrl: string;
    chapters?: Chapter[];
    points?: number;
    lessons?: number;
    classRank?: number;
};

export type CaseStudyContent = {
    scenario: string;
    quote: string;
    prompt: string;
    explanation: string;
}

export type CaseStudy = {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    status: 'Completed' | 'In Progress' | 'Not Started';
    dueDate: string;
    category?: string;
    caseNumber?: number;
    content?: CaseStudyContent;
};

export type Task = {
    id: string;
    title: string;
    type: string;
    dueDate: string;
    progress: {
        current: number;
        total: number;
    }
};

export type Badge = {
    id: string;
    name: string;
    icon: keyof typeof import('lucide-react').icons | 'Crown' | 'Flame';
    description: string;
    imageUrl: string;
};

export type Gamification = {
    points: number;
    badges: Badge[];
    leaderboard: User[];
    streak: number;
};

export type Profile = User & {
    email: string;
    bio: string;
    achievements: Badge[];
    settings: {
        notifications: {
            email: boolean;
            push: boolean;
        },
        privacy: {
            showProfile: boolean;
        }
    }
}
