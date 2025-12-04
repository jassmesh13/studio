import type { User, Course, CaseStudy, Task, Gamification, Profile } from '@/lib/types';

export const users: User[] = [
  { id: '1', name: 'Rashmi', avatarUrl: '1', points: 500, rank: 1 },
  { id: '2', name: 'Nakul', avatarUrl: '2', points: 450, rank: 2 },
  { id: '3', name: 'Suresh', avatarUrl: '3', points: 400, rank: 3 },
  { id: '4', name: 'David Evans', avatarUrl: '4', points: 350, rank: 4 },
  { id: '5', name: 'Emily Frank', avatarUrl: '5', points: 300, rank: 5 },
];

export const mainUser: User = { id: '6', name: 'Alia', avatarUrl: '1', points: 390, rank: 1438 };


export const courses: Course[] = [
  {
    id: '1',
    title: 'Introduction to Web Development',
    description: 'Master the fundamentals of HTML, CSS, and JavaScript.',
    progress: 75,
    imageUrl: '10',
    chapters: [
      { id: 'c1-1', title: 'Chapter 1: Getting Started with HTML', completed: true, content: { type: 'video', duration: '15 min' } },
      { id: 'c1-2', title: 'Chapter 2: Styling with CSS', completed: true, content: { type: 'pdf', pages: 25 } },
      { id: 'c1-3', title: 'Chapter 3: Interactive JavaScript', completed: false, content: { type: 'quiz', questions: 10 } },
      { id: 'c1-4', title: 'Chapter 4: Building Your First Website', completed: false, content: { type: 'video', duration: '45 min' } },
    ]
  },
  {
    id: '2',
    title: 'Advanced React Patterns',
    description: 'Learn advanced techniques for building scalable React applications.',
    progress: 40,
    imageUrl: '11',
    chapters: [
        { id: 'c2-1', title: 'Chapter 1: Render Props and HOCs', completed: true, content: { type: 'video', duration: '25 min' } },
        { id: 'c2-2', title: 'Chapter 2: State Management with Context', completed: true, content: { type: 'pdf', pages: 30 } },
        { id: 'c2-3', title: 'Chapter 3: Performance Optimization', completed: false, content: { type: 'quiz', questions: 15 } },
        { id: 'c2-4', title: 'Chapter 4: TypeScript in React', completed: false, content: { type: 'video', duration: '50 min' } },
      ]
  },
  {
    id: '3',
    title: 'UI/UX Design Principles',
    description: 'A comprehensive guide to creating intuitive and beautiful user interfaces.',
    progress: 90,
    imageUrl: '12',
    chapters: [
        { id: 'c3-1', title: 'Chapter 1: The Psychology of Design', completed: true, content: { type: 'video', duration: '20 min' } },
        { id: 'c3-2', title: 'Chapter 2: Wireframing and Prototyping', completed: true, content: { type: 'pdf', pages: 40 } },
        { id: 'c3-3', title: 'Chapter 3: User Testing', completed: true, content: { type: 'quiz', questions: 12 } },
        { id: 'c3-4', title: 'Chapter 4: Final Project', completed: false, content: { type: 'video', duration: '60 min' } },
    ]
  },
];

export const caseStudies: CaseStudy[] = [
    {
        id: '1',
        title: 'E-commerce Checkout Redesign',
        description: 'Analyze and redesign the checkout flow of a major e-commerce platform to improve conversion rates.',
        imageUrl: '13',
        status: 'In Progress',
        dueDate: '2024-08-15',
    },
    {
        id: '2',
        title: 'Mobile Banking App Usability Test',
        description: 'Conduct a usability test on a new mobile banking application and provide actionable feedback.',
        imageUrl: '14',
        status: 'Completed',
        dueDate: '2024-07-20',
    },
    {
        id: '3',
        title: 'SaaS Onboarding Experience',
        description: 'Design a new onboarding flow for a B2B SaaS product to increase user activation.',
        imageUrl: '15',
        status: 'Not Started',
        dueDate: '2024-09-01',
    }
];

export const pendingTasks: Task[] = [
    { id: '1', title: 'Homework tasks', type: 'Course', dueDate: '3 days', progress: { current: 5, total: 10 } },
    { id: '2', title: 'Communication skill exercise', type: 'Case Study', dueDate: '5 days', progress: { current: 1, total: 5 } },
];

export const whatsNew: { id: string; title: string; description: string; date: string; imageUrl: string; }[] = [
    { id: '1', title: 'Upgrade Curriculum & Boost Admissions', description: 'Nirmaan | Upgrade your School Curriculum', date: '2 days ago', imageUrl: '30' },
    { id: '2', title: 'UNLOCK Your Child\'s True Potential', description: 'Nirmaan | Provide Holistic Education for your kids (English)', date: '1 week ago', imageUrl: '31' },
];

export const gamificationData: Gamification = {
    points: 1250,
    badges: [
        { id: '1', name: 'Course Completer', icon: 'BadgeCheck', description: 'Finish your first course', imageUrl: '20' },
        { id: '2', name: 'Streak Starter', icon: 'Flame', description: 'Maintain a 3-day streak', imageUrl: '21' },
        { id: '3', name: 'Top Learner', icon: 'Crown', description: 'Reach the top 10 on the leaderboard', imageUrl: '22' },
        { id: '4', name: 'Case Study Pro', icon: 'Briefcase', description: 'Complete 3 case studies', imageUrl: '23' },
    ],
    leaderboard: users.sort((a, b) => b.points - a.points).map((user, index) => ({...user, rank: index + 1})),
    streak: 5,
};

export const profileData: Profile = {
    ...mainUser,
    email: 'alia.sharma@example.com',
    bio: 'Aspiring full-stack developer with a passion for creating beautiful and functional web applications. Currently learning about advanced React and UI/UX design.',
    achievements: gamificationData.badges,
    settings: {
        notifications: {
            email: true,
            push: false,
        },
        privacy: {
            showProfile: true,
        }
    }
}
