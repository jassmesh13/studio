'use server';

import type { User, Course, CaseStudy, Task, Gamification, Profile, School, Habit } from '@/lib/types';
import { db } from './firebase';
import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';

// MOCK DATA - This will be used as a fallback or for initial setup.
// In a real application, you would remove this and only use Firestore.

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
      { id: 'c1-1', title: 'Everyday Communication', completed: true, imageUrl: 'l1', description: 'Learn how to talk and listen to friends and family.', content: { type: 'video', duration: '15 min' } },
      { id: 'c1-2', title: 'Making Smart Choices', completed: true, imageUrl: 'l2', description: 'Discover how to make good decisions in tricky situations.', content: { type: 'pdf', pages: 25 } },
      { id: 'c1-3', title: 'Understanding Your Feelings', completed: true, imageUrl: 'l1', description: 'Explore different emotions and how to manage them.', content: { type: 'quiz', questions: 10 } },
      { id: 'c1-4', title: 'Being a Good Friend', completed: true, imageUrl: 'l2', description: 'Find out what it means to be a supportive and kind friend.', content: { type: 'video', duration: '45 min' } },
      { id: 'c1-5', title: 'Solving Problems', completed: false, imageUrl: 'l1', description: 'Get tools to solve puzzles and challenges in your daily life.', content: { type: 'video', duration: '45 min' } },
    ],
    caseStudyIds: ['1', '2', '3', '4']
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
    // ... more mock case studies
];

const mockGamificationData: Gamification = {
    points: 1250,
    badges: [
        { id: '1', name: 'Course Completer', icon: 'BadgeCheck', description: 'Finish your first course', imageUrl: '20' },
        { id: '2', name: 'Streak Starter', icon: 'Flame', description: 'Maintain a 3-day streak', imageUrl: '21' },
        { id: '3', name: 'Top Learner', icon: 'Crown', description: 'Reach the top 10 on the leaderboard', imageUrl: '22' },
        { id: '4', name: 'Case Study Pro', icon: 'Briefcase', description: 'Complete 3 case studies', imageUrl: '23' },
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
    { id: '2', title: 'UNLOCK Your Child\'s True Potential', description: 'Nirmaan | Provide Holistic Education for your kids (English)', date: '20_24-08-25', imageUrl: '31' },
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

// DATA FETCHING FUNCTIONS - These functions will fetch data from Firestore.
// For now, they return mock data to keep the app working during development.

// To enable Firestore, uncomment the code inside each function and comment out the mock data return.

export async function getCourses(): Promise<Course[]> {
    // return mockCourses;
    
    // UNCOMMENT THIS TO USE FIRESTORE
    /*
    try {
        const coursesCollection = collection(db, 'courses');
        const courseSnapshot = await getDocs(coursesCollection);
        const coursesList = courseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
        return coursesList;
    } catch (error) {
        console.error("Error fetching courses: ", error);
        return []; // Return empty array on error
    }
    */
   return mockCourses;
}

export async function getCourseById(id: string): Promise<Course | null> {
    // return mockCourses.find((c) => c.id === id) || null;

    // UNCOMMENT THIS TO USE FIRESTORE
    /*
    try {
        const courseDoc = doc(db, 'courses', id);
        const courseSnapshot = await getDoc(courseDoc);
        if (courseSnapshot.exists()) {
            return { id: courseSnapshot.id, ...courseSnapshot.data() } as Course;
        } else {
            return null;
        }
    } catch (error) {
        console.error(`Error fetching course ${id}: `, error);
        return null;
    }
    */
    const course = mockCourses.find((c) => c.id === id);
    return course ? { ...course } : null;
}

export async function getCaseStudies(): Promise<CaseStudy[]> {
    // return mockCaseStudies;

    // UNCOMMENT THIS TO USE FIRESTORE
    /*
    try {
        const caseStudiesCollection = collection(db, 'caseStudies');
        const caseStudySnapshot = await getDocs(caseStudiesCollection);
        const caseStudiesList = caseStudySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CaseStudy));
        return caseStudiesList;
    } catch (error) {
        console.error("Error fetching case studies: ", error);
        return [];
    }
    */
   return mockCaseStudies;
}

export async function getCaseStudyById(id: string): Promise<CaseStudy | null> {
    // return mockCaseStudies.find((c) => c.id === id) || null;

    // UNCOMMENT THIS TO USE FIRESTORE
    /*
    try {
        const caseStudyDoc = doc(db, 'caseStudies', id);
        const caseStudySnapshot = await getDoc(caseStudyDoc);
        if (caseStudySnapshot.exists()) {
            return { id: caseStudySnapshot.id, ...caseStudySnapshot.data() } as CaseStudy;
        } else {
            return null;
        }
    } catch (error) {
        console.error(`Error fetching case study ${id}: `, error);
        return null;
    }
    */
    const caseStudy = mockCaseStudies.find((c) => c.id === id);
    return caseStudy ? { ...caseStudy } : null;
}

export async function getCaseStudiesForCourse(caseStudyIds: string[]): Promise<CaseStudy[]> {
    const allCaseStudies = await getCaseStudies();
    return allCaseStudies.filter(cs => caseStudyIds.includes(cs.id));

    // UNCOMMENT THIS TO USE FIRESTORE
    /*
    try {
        const caseStudiesRef = collection(db, 'caseStudies');
        const q = query(caseStudiesRef, where('id', 'in', caseStudyIds));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CaseStudy));
    } catch (error) {
        console.error("Error fetching case studies for course: ", error);
        return [];
    }
    */
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


// Functions to get mock data that was previously exported directly
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
