

import type { User, Course, CaseStudy, Task, Gamification, Profile, School, Habit } from '@/lib/types';

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
    title: 'Life Skills',
    description: 'Master the fundamentals of HTML, CSS, and JavaScript.',
    progress: 75,
    imageUrl: '10',
    points: 390,
    lessons: 1438,
    classRank: 56,
    chapters: [
      { id: 'c1-1', title: 'Lesson 1', completed: true, imageUrl: 'l1', description: 'In the lessns we leran new words and for vacalaburities continues and articl', content: { type: 'video', duration: '15 min' } },
      { id: 'c1-2', title: 'Lesson 2', completed: true, imageUrl: 'l2', description: 'In the lessns we leran new words and for vacalaburities continues and articl', content: { type: 'pdf', pages: 25 } },
      { id: 'c1-3', title: 'Lesson 3', completed: true, imageUrl: 'l1', description: 'In the lessns we leran new words and for vacalaburities continues and articl', content: { type: 'quiz', questions: 10 } },
      { id: 'c1-4', title: 'Lesson 4', completed: true, imageUrl: 'l2', description: 'In the lessns we leran new words and for vacalaburities continues and articl', content: { type: 'video', duration: '45 min' } },
      { id: 'c1-5', title: 'Lesson 5', completed: false, imageUrl: 'l1', description: 'In the lessns we leran new words and for vacalaburities continues and articl', content: { type: 'video', duration: '45 min' } },
    ],
    caseStudyIds: ['1', '2', '3', '4']
  },
  {
    id: '2',
    title: '21st Century skills',
    description: 'Learn advanced techniques for building scalable React applications.',
    progress: 40,
    imageUrl: '11',
    points: 250,
    lessons: 1230,
    classRank: 15,
    chapters: [
        { id: 'c2-1', title: 'Lesson 1', completed: true, imageUrl: 'l1', description: 'In the lessns we leran new words and for vacalaburities continues and articl', content: { type: 'video', duration: '25 min' } },
        { id: 'c2-2', title: 'Lesson 2', completed: true, imageUrl: 'l2', description: 'In the lessns we leran new words and for vacalaburities continues and articl', content: { type: 'pdf', pages: 30 } },
        { id: 'c2-3', title: 'Lesson 3', completed: false, imageUrl: 'l1', description: 'In the lessns we leran new words and for vacalaburities continues and articl', content: { type: 'quiz', questions: 15 } },
    ],
    caseStudyIds: ['1', '2']
  },
  {
    id: '3',
    title: 'Communication Skills',
    description: 'A comprehensive guide to creating intuitive and beautiful user interfaces.',
    progress: 90,
    imageUrl: '12',
    points: 350,
    lessons: 1780,
    classRank: 25,
    chapters: [
        { id: 'c3-1', title: 'Lesson 1', completed: true, imageUrl: 'l2', description: 'In the lessns we leran new words and for vacalaburities continues and articl', content: { type: 'video', duration: '20 min' } },
        { id: 'c3-2', title: 'Lesson 2', completed: true, imageUrl: 'l1', description: 'In the lessns we leran new words and for vacalaburities continues and articl', content: { type: 'pdf', pages: 40 } },
        { id: 'c3-3', title: 'Lesson 3', completed: true, imageUrl: 'l2', description: 'In the lessns we leran new words and for vacalaburities continues and articl', content: { type: 'quiz', questions: 12 } },
    ],
    caseStudyIds: ['3', '4']
  },
];

const getFutureDate = (days: number, hours: number = 0) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    date.setHours(date.getHours() + hours);
    return date.toISOString();
}

export const caseStudies: CaseStudy[] = [
    {
        id: '1',
        title: 'What should Nyra do?',
        description: 'This case study teaches about friendship and life lesson.',
        imageUrl: '13',
        status: 'In Progress',
        dueDate: getFutureDate(2),
        category: 'Financial literacy',
        caseNumber: 32,
        points: 5,
        type: 'video',
        content: {
            scenario: "Your Science Ma'am has asked you to check all the assignments in the class. While checking, you find that one of your friends from your volleyball team has not completed the assignment because she was genuinely sick.",
            quote: "Please don't tell the teacher about my assignment, I was sick all night.",
            prompt: "If you were in this situation, what would you do?",
            explanation: "Also explain why you think your choice is the best one."
        },
        tags: ['Financial literacy', 'Friendship']
    },
    {
        id: '2',
        title: 'Is Ibrahim right?',
        description: 'Help Ibrahim in solving her problem',
        imageUrl: '14',
        status: 'Not Started',
        dueDate: getFutureDate(0, 6),
        category: 'Emotional Intelligence',
        caseNumber: 38,
        points: 10,
        type: 'audio',
        content: {
            scenario: "Ibrahim's friend is telling mean jokes about another student. Ibrahim feels uncomfortable but doesn't want to lose his friend.",
            quote: "Hey, that's not funny. You should stop.",
            prompt: "If you were Ibrahim, how would you handle this?",
            explanation: "Explain your reasoning and what might happen after."
        },
        tags: ['Emotional Intelligence']
    },
    {
        id: '3',
        title: 'How can we save Adi?',
        description: 'Help Adi in solving her problem',
        imageUrl: '15',
        status: 'Completed',
        dueDate: getFutureDate(-2),
        category: 'Cognitive Ability',
        caseNumber: 41,
        points: 5,
        type: 'mcq',
        content: {
            scenario: "Adi found a wallet full of money on the playground. There's no ID inside.",
            quote: "Wow, so much money! I could buy that new video game!",
            prompt: "What is the best thing for Adi to do?",
            explanation: "Select the best option below."
        },
        mcqs: [
            {
                id: 'mcq1',
                question: 'What will you do?',
                options: [
                    { id: 'opt1', text: 'Tell Teacher' },
                    { id: 'opt2', text: 'Help your friend' },
                    { id: 'opt3', text: 'Neither tell teacher nor help friend' }
                ]
            }
        ],
        tags: ['Cognitive Ability']
    },
    {
        id: '4',
        title: 'Tarun needs your advice',
        description: 'Help Tarun in solving her problem',
        imageUrl: '16',
        status: 'Not Started',
        dueDate: getFutureDate(5),
        category: 'Communication',
        caseNumber: 43,
        points: 8,
        type: 'audio',
        content: {
            scenario: "Tarun wants to join the school choir but is very shy about singing in front of people. Auditions are next week.",
            quote: "I love singing, but I'm too scared to audition.",
            prompt: "What advice would you give Tarun?",
            explanation: "Record your advice and encouragement for Tarun."
        },
        tags: ['Communication']
    }
];

export const pendingTasks: Task[] = [
    { id: '1', title: 'Homework tasks', type: 'Course', dueDate: '3 days', progress: { current: 5, total: 10 } },
    { id: '2', title: 'Communication skill exercise', type: 'Case Study', dueDate: '5 days', progress: { current: 1, total: 5 } },
];

export const whatsNew: { id: string; title: string; description: string; date: string; imageUrl: string; }[] = [
    { id: '1', title: 'Upgrade Curriculum & Boost Admissions', description: 'Nirmaan | Upgrade your School Curriculum', date: '2024-08-20', imageUrl: '30' },
    { id: '2', title: 'UNLOCK Your Child\'s True Potential', description: 'Nirmaan | Provide Holistic Education for your kids (English)', date: '20_24-08-25', imageUrl: '31' },
    { id: '3', title: 'Doctor\'s Day Celebration', description: 'Join us in celebrating the heroes in white coats.', date: '2024-09-01', imageUrl: '32' },
    { id: '4', title: 'Guest Speaker: A Famous Scientist', description: 'An inspiring talk on innovation and discovery.', date: '2024-09-10', imageUrl: '33' },
    { id: '5', title: 'Annual Sports Day', description: 'Get ready for a day of fun and friendly competition.', date: '2024-09-15', imageUrl: '34' },
    { id: '6', title: 'Science Fair 2024', description: 'Witness the amazing projects by our students.', date: '2024-09-22', imageUrl: '35' },
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
    username: 'alia_sharma',
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

export const schools: School[] = [
    { id: '1', name: 'Delhi Public School' },
    { id: '2', name: 'Kendriya Vidyalaya' },
    { id: '3', name: 'The Doon School' },
    { id: '4', name: 'St. Xavier\'s Collegiate School' },
    { id: '5', name: 'La Martiniere for Boys' }
];

export const habits: Habit[] = [
    {
        id: 'habit-1',
        question: "Hey, Did you wake up early today ?",
        emoji: "🌅",
        points: 5,
        options: [
            { label: "Absoulety Yes !", value: "yes" },
            { label: "Not yet", value: "not-yet" },
            { label: "No i missed.", value: "no" }
        ]
    },
    {
        id: 'habit-2',
        question: "Did you also meditate today ?",
        emoji: "🧘",
        points: 5,
        options: [
            { label: "Absoulety Yes !", value: "yes" },
            { label: "Not yet", value: "not-yet" },
            { label: "No i missed.", value: "no" }
        ]
    },
    {
        id: 'habit-3',
        question: "Did you completed your homework ?",
        emoji: "📚",
        points: 5,
        options: [
            { label: "Absoulety Yes !", value: "yes" },
            { label: "Not yet", value: "not-yet" },
            { label: "No i missed.", value: "no" }
        ]
    }
];
