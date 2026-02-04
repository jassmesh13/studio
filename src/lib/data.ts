'use server';

import type { User, Course, CaseStudy, Task, Gamification, Profile, School, Habit } from '@/lib/types';

const mockUsers: User[] = [
  { id: '1', name: 'Rashmi', avatarUrl: '1', points: 500, rank: 1 },
  { id: '2', name: 'Nakul', avatarUrl: '2', points: 450, rank: 2 },
  { id: '3', name: 'Suresh', avatarUrl: '3', points: 400, rank: 3 },
  { id: '4', name: 'David Evans', avatarUrl: '4', points: 350, rank: 4 },
  { id: '5', name: 'Emily Frank', avatarUrl: '5', points: 300, rank: 5 },
];

const mockMainUser: User = { id: '6', name: 'Alia', avatarUrl: 'avatar-kid', points: 390, rank: 1438 };

const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Life Skills',
    description: 'Essential skills for navigating everyday challenges and building a strong character.',
    progress: 75,
    imageUrl: '10',
    points: 390,
    lessons: 1438,
    classRank: 56,
    chapters: [
      { 
        id: 'c1-1', 
        title: 'Knowing Myself', 
        completed: true, 
        imageUrl: 'l1', 
        description: 'Discover who you are and what makes you special.', 
        content: { 
            type: 'text',
            body: [
                {
                    question: "1. What is knowing yourself, Nyra?",
                    answer: "Nyra, knowing yourself means understanding your feelings and likes. It helps you know what you are good at."
                },
                {
                    question: "2. Why should you learn this, Nyra?",
                    answer: "When you understand yourself, you feel confident and happy. You can make better choices every day."
                },
                {
                    question: "3. How will you learn this, Nyra?",
                    answer: "You will talk about your feelings and strengths in fun activities. You will draw and share about yourself."
                }
            ]
        } 
      },
      { 
        id: 'c1-2', 
        title: 'Managing Emotions', 
        completed: true, 
        imageUrl: 'l2', 
        description: 'Understand and manage your feelings like happiness, sadness, or anger.', 
        content: { 
            type: 'text',
            body: [
                {
                    question: "1. What is managing emotions, Nyra?",
                    answer: "Nyra, managing emotions means understanding feelings like happy, sad, or angry. It helps you stay calm and in control."
                },
                {
                    question: "2. Why should you learn this, Nyra?",
                    answer: "When you control your feelings, you make better decisions. You can play and learn peacefully."
                },
                {
                    question: "3. How will you learn this, Nyra?",
                    answer: "You will practice breathing, counting, and talking about feelings. You will use games and stories to stay calm."
                }
            ]
        } 
      },
      { 
        id: 'c1-3', 
        title: 'Good Manners', 
        completed: true, 
        imageUrl: 'l1', 
        description: 'Learn the importance of being polite and respectful to everyone.', 
        content: { 
            type: 'text',
            body: [
                {
                    question: "1. What are good manners, Nyra?",
                    answer: "Nyra, good manners mean saying please, thank you, and sorry. It means being polite to everyone."
                },
                {
                    question: "2. Why should you learn this, Nyra?",
                    answer: "Good manners make people feel respected and happy. They help you make good friends."
                },
                {
                    question: "3. How will you learn this, Nyra?",
                    answer: "You will practice kind words every day. You will use them at home and school."
                }
            ]
        } 
      },
      { 
        id: 'c1-4', 
        title: 'Sharing and Caring', 
        completed: true, 
        imageUrl: 'l2', 
        description: 'Discover the joy of giving and thinking about others.', 
        content: { 
            type: 'text',
            body: [
                {
                    question: "1. What is sharing and caring, Nyra?",
                    answer: "Nyra, sharing means giving and helping others. Caring means thinking about others’ feelings."
                },
                {
                    question: "2. Why should you learn this, Nyra?",
                    answer: "Sharing makes friends happy and builds trust. Caring helps you become kind and loved."
                },
                {
                    question: "3. How will you learn this, Nyra?",
                    answer: "You will share toys, help friends, and work together. You will practice kindness daily."
                }
            ]
        } 
      },
      { 
        id: 'c1-5', 
        title: 'Responsibility', 
        completed: false, 
        imageUrl: 'l1', 
        description: 'Learn to take care of your things and finish your tasks.', 
        content: { 
            type: 'text',
            body: [
                {
                    question: "1. What is responsibility, Nyra?",
                    answer: "Nyra, responsibility means taking care of your things and tasks. It means finishing what you start."
                },
                {
                    question: "2. Why should you learn this, Nyra?",
                    answer: "Being responsible makes others trust you. It helps you become independent."
                },
                {
                    question: "3. How will you learn this, Nyra?",
                    answer: "You will pack your bag and complete small tasks. You will follow routines every day."
                }
            ]
        } 
      },
      { 
        id: 'c1-6', 
        title: 'Healthy Habits', 
        completed: false, 
        imageUrl: 'l2', 
        description: 'Understand the importance of eating well, sleeping, and staying clean.', 
        content: { 
            type: 'text',
            body: [
                {
                    question: "1. What are healthy habits, Nyra?",
                    answer: "Nyra, healthy habits mean eating well and sleeping on time. It also means keeping your body clean."
                },
                {
                    question: "2. Why should you learn this, Nyra?",
                    answer: "Healthy habits keep you strong and active. They help you focus in class."
                },
                {
                    question: "3. How will you learn this, Nyra?",
                    answer: "You will wash hands, eat healthy food, and exercise. You will follow a daily routine."
                }
            ]
        } 
      },
      { 
        id: 'c1-7', 
        title: 'Safety Rules', 
        completed: false, 
        imageUrl: 'l1', 
        description: 'Learn how to stay safe at home and outdoors.', 
        content: { 
            type: 'text',
            body: [
                {
                    question: "1. What are safety rules, Nyra?",
                    answer: "Nyra, safety rules help you stay safe at home and outside. They teach you what to do in danger."
                },
                {
                    question: "2. Why should you learn this, Nyra?",
                    answer: "Safety rules protect you from harm. They help you feel secure."
                },
                {
                    question: "3. How will you learn this, Nyra?",
                    answer: "You will learn through stories and role-play. You will practice safe choices every day."
                }
            ]
        } 
      },
    ],
    caseStudyIds: ['1', '2', '3', '4', '5']
  },
  {
    id: '2',
    title: '21st Century Skills',
    description: 'Develop modern skills for a changing world, like creativity and teamwork.',
    progress: 40,
    imageUrl: '11',
    points: 250,
    lessons: 1230,
    classRank: 15,
    chapters: [
        { id: 'c2-1', title: 'Creative Thinking', completed: true, imageUrl: 'l1', description: 'Unleash your imagination and come up with new ideas.', content: { type: 'video', duration: '25 min' } },
        { id: 'c2-2', title: 'Working With Others', completed: true, imageUrl: 'l2', description: 'Learn the secrets of successful teamwork and collaboration.', content: { type: 'pdf', pages: 30 } },
        { id: 'c2-3', title: 'Digital Citizenship', completed: false, imageUrl: 'l1', description: 'Navigate the online world safely and responsibly.', content: { type: 'quiz', questions: 15 } },
    ],
    caseStudyIds: ['1', '2']
  },
  {
    id: '3',
    title: 'Communication Skills',
    description: 'Become a great communicator by learning to speak and listen effectively.',
    progress: 90,
    imageUrl: '12',
    points: 350,
    lessons: 1780,
    classRank: 25,
    chapters: [
        { id: 'c3-1', title: 'Listening Superpowers', completed: true, imageUrl: 'l2', description: 'Discover how to truly hear what others are saying.', content: { type: 'video', duration: '20 min' } },
        { id: 'c3-2', title: 'Speaking with Confidence', completed: true, imageUrl: 'l1', description: 'Share your ideas clearly and confidently in front of others.', content: { type: 'pdf', pages: 40 } },
        { id: 'c3-3', title: 'Understanding Body Language', completed: true, imageUrl: 'l2', description: 'Learn what people are saying without even speaking.', content: { type: 'quiz', questions: 12 } },
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

const mockCaseStudies: CaseStudy[] = [
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
        grade: 'Grade 4-6',
        content: {
            scenario: "Your Science Ma'am has asked you to check all the assignments in the class. While checking, you find that one of your friends from your volleyball team has not completed the assignment because she was genuinely sick.",
            quote: "Please don't tell the teacher about my assignment, I was sick all night.",
            prompt: "If you were in this situation, what would you do?",
            dilemma: "Would you tell the teacher the truth, <br />OR <br />keep your friend's secret?",
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
        grade: 'Grade 4-6',
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
        title: 'The Found Wallet',
        description: 'A multiple choice quiz about honesty.',
        imageUrl: '15',
        status: 'Not Started',
        dueDate: getFutureDate(5),
        category: 'Cognitive Ability',
        caseNumber: 41,
        points: 15,
        type: 'mcq',
        grade: 'Grade 4-6',
        mcqs: [
            {
                id: 'mcq-1',
                question: 'You find a wallet on the playground with 500 rupees in it. What do you do?',
                correctOptionId: 'q1-opt3',
                options: [
                    { id: 'q1-opt1', text: 'Keep the money. Finders keepers!' },
                    { id: 'q1-opt2', text: 'Look for an ID and return it to the owner.' },
                    { id: 'q1-opt3', text: 'Give it to a teacher or the principal.' },
                    { id: 'q1-opt4', text: 'Ask your friends what you should do.' }
                ]
            }
        ],
        content: {
            scenario: "You are playing during recess and see a wallet lying on the ground.",
            quote: "",
            prompt: "Choose the best course of action.",
            explanation: "Think about what is the most responsible and honest thing to do."
        },
        tags: ['Honesty', 'Responsibility']
    },
    {
        id: '4',
        title: 'Team Project Troubles',
        description: 'A scenario about collaboration and fairness.',
        imageUrl: '13',
        status: 'In Progress',
        dueDate: getFutureDate(3),
        category: 'Emotional Intelligence',
        caseNumber: 42,
        points: 10,
        type: 'video',
        grade: 'Grade 7-9',
        content: {
            scenario: "You are in a group project and one member is not doing any work. The deadline is tomorrow.",
            quote: "I've been too busy, can you just do my part? I'll cover for you next time.",
            prompt: "How do you respond to your teammate?",
            explanation: "Explain how you would ensure the work gets done fairly."
        },
        tags: ['Teamwork', 'Fairness']
    },
    {
        id: '5',
        title: 'I Need Help',
        description: 'A case study about asking for help in class.',
        imageUrl: '31',
        status: 'Not Started',
        dueDate: getFutureDate(4),
        category: 'Communication',
        caseNumber: 43,
        points: 5,
        type: 'mcq',
        grade: 'Grade 1-3',
        mcqs: [
            {
                id: 'mcq-2',
                question: 'What should Anaya say to her teacher?',
                correctOptionId: 'q2-opt2',
                options: [
                    { id: 'q2-opt1', text: "This is too hard." },
                    { id: 'q2-opt2', text: "Ma’am, I don’t understand this question. Can you please help me?" },
                    { id: 'q2-opt3', text: "I don't want to do this." },
                    { id: 'q2-opt4', text: 'Stay quiet and say nothing.' }
                ]
            }
        ],
        content: {
            scenario: "Anaya is sitting in class. She does not understand the math question on the board. She feels confused but stays quiet.",
            quote: "",
            prompt: "What should Anaya say to her teacher?",
            explanation: "Choose the best way for Anaya to ask for help."
        },
        tags: ['Communication', 'Classroom']
    }
];

const mockGamificationData: Gamification = {
    points: 1250,
    badges: [
        { id: '1', name: 'Course Completer', icon: 'BadgeCheck', description: 'Finish your first course', imageUrl: '20' },
        { id: '2', name: 'Streak Starter', icon: 'Flame', description: 'Maintain a 3-day streak', imageUrl: '21' },
        { id: '3', name: 'Top Learner', icon: 'Crown', description: 'Reach the top 10 on the leaderboard', imageUrl: '22' },
        { id: '4-pro', name: 'Case Study Pro', icon: 'Briefcase', description: 'Complete 3 case studies', imageUrl: '23' },
    ],
    leaderboard: mockUsers.sort((a, b) => b.points - a.points).map((user, index) => ({...user, rank: index + 1})),
    streak: 5,
};

const mockProfileData: Profile = {
    ...mockMainUser,
    username: 'alia_sharma',
    email: 'alia.sharma@example.com',
    phone: '123-456-7890',
    school: 'Delhi Public School',
    class: '10th',
    age: 15,
    gender: 'Female',
    bio: 'Aspiring full-stack developer with a passion for creating beautiful and functional web applications. Currently learning about advanced React and UI/UX design.',
    achievements: mockGamificationData.badges,
    settings: {
        notifications: {
            email: true,
            push: false,
        },
        privacy: {
            showProfile: true,
        }
    }
};

const mockPendingTasks: Task[] = [
    { id: '1', title: 'Homework tasks', type: 'Course', dueDate: '3 days', progress: { current: 5, total: 10 } },
    { id: '2', title: 'Communication skill exercise', type: 'Case Study', dueDate: '5 days', progress: { current: 1, total: 5 } },
];

const mockWhatsNew: { id: string; title: string; description: string; date: string; imageUrl: string; }[] = [
    { id: '1', title: 'Upgrade Curriculum & Boost Admissions', description: 'Nirmaan | Upgrade your School Curriculum', date: '2024-08-20', imageUrl: '30' },
    { id: '2', title: 'UNLOCK Your Child\'s True Potential', description: 'Nirmaan | Provide Holistic Education for your kids (English)', date: '2024-08-25', imageUrl: '31' },
    { id: '3', title: 'Doctor\'s Day Celebration', description: 'Join us in celebrating the heroes in white coats.', date: '2024-09-01', imageUrl: '32' },
];

const mockSchools: School[] = [
    { id: '1', name: 'Delhi Public School' },
    { id: '2', name: 'Kendriya Vidyalaya' },
    { id: '3', name: 'The Doon School' },
    { id: '4', name: 'St. Xavier\'s Collegiate School' },
    { id: '5', name: 'La Martiniere for Boys' }
];

const mockHabits: Habit[] = [
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

export async function getCourses(): Promise<Course[]> {
   return mockCourses;
}

export async function getCourseById(id: string): Promise<Course | null> {
    const course = mockCourses.find((c) => c.id === id);
    return course ? { ...course } : null;
}

export async function getCaseStudies(): Promise<CaseStudy[]> {
   return mockCaseStudies;
}

export async function getCaseStudyById(id: string): Promise<CaseStudy | null> {
    const caseStudy = mockCaseStudies.find((c) => c.id === id);
    return caseStudy ? { ...caseStudy } : null;
}

export async function getCaseStudiesForCourse(caseStudyIds: string[]): Promise<CaseStudy[]> {
    const allCaseStudies = await getCaseStudies();
    return allCaseStudies.filter(cs => caseStudyIds.includes(cs.id));
}


export async function getMainUser(): Promise<User> {
    return mockMainUser;
}

export async function getGamificationData(): Promise<Gamification> {
    return mockGamificationData;
}

export async function getProfileData(): Promise<Profile> {
    return mockProfileData;
}


export async function getPendingTasks(): Promise<Task[]> {
    return mockPendingTasks;
}

export async function getWhatsNew(): Promise<{ id: string; title: string; description: string; date: string; imageUrl: string; }[]> {
    return mockWhatsNew;
}

export async function getSchools(): Promise<School[]> {
    return mockSchools;
}

export async function getHabits(): Promise<Habit[]> {
    return mockHabits;
}

export async function getUsers(): Promise<User[]> {
    return mockUsers;
}
