'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Heart, Star } from "lucide-react";

interface PostSubmissionScreenProps {
    userName: string;
    onDone: () => void;
    caseStudyId: string;
}

const DefaultFeedback = () => (
    <>
        <Card className="mb-6 text-left bg-card shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Brain className="w-6 h-6 text-primary" />
                    Every choice has meaning.
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                <p>In this situation, there is no simple ‘right’ or ‘wrong’ answer. Some people choose one way because they believe it builds trust. Others choose another way because they care deeply about others.</p>
                <p className="font-semibold">What matters most is <span className="text-primary">why</span> you chose what you chose. Your reasons show your values — kindness, fairness, courage, or care.</p>
                <p className="italic">Great thinkers don’t just pick an option. They understand how their decision can affect others.</p>
            </CardContent>
        </Card>

        <Card className="mb-6 text-left bg-card shadow-lg">
            <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                    <Heart className="w-6 h-6 text-red-500" />
                    Growth Insight
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                <p>Real life is full of moments like this. Each one helps you become more thoughtful, more kind, and more wise.</p>
                <div className="bg-accent p-3 rounded-lg">
                    <p className="font-semibold">Next time, ask yourself:</p>
                    <p className="italic">‘How can I be kind and fair at the same time?’</p>
                </div>
            </CardContent>
        </Card>
    </>
);

const CaseStudy1Feedback = () => (
    <>
        <Card className="mb-6 text-left bg-card shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Brain className="w-6 h-6 text-primary" />
                    Honesty and Friendship
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                <p>That’s great, Nyra. It’s really good that you believe in being honest with your teacher. Honesty builds trust, and that is a strong value to have.</p>
                <p className="font-semibold">At the same time, it’s also important to think about how your friend might feel. She was genuinely sick and scared.</p>
            </CardContent>
        </Card>

        <Card className="mb-6 text-left bg-card shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Heart className="w-6 h-6 text-red-500" />
                    A Path for Both
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                 <p>I am not suggesting that you should lie. But you could have told the teacher the truth in a kinder way — that your friend was unwell and truly couldn’t complete the work, and then requested Ma’am to give her one more chance.</p>
                <div className="bg-accent p-3 rounded-lg">
                     <p className="font-semibold">This way, you stay honest and you stand up for your friend. You become someone who is fair, kind, and brave at the same time.</p>
                </div>
                 <p className="italic font-bold text-center mt-4">This is how strong decision-makers think.</p>
            </CardContent>
        </Card>
    </>
);

const CaseStudy2Feedback = () => (
     <>
        <Card className="mb-6 text-left bg-card shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Brain className="w-6 h-6 text-primary" />
                    Courage and Kindness
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                <p>That’s thoughtful, Nyra. It's tough when a friend is doing something you know is wrong, like telling mean jokes.</p>
                <p className="font-semibold">You’re right in wanting to be a good friend, but it’s also important to consider the feelings of the student being made fun of.</p>
            </CardContent>
        </Card>

        <Card className="mb-6 text-left bg-card shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Heart className="w-6 h-6 text-red-500" />
                    A Path for Both
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                 <p>You don't have to choose between your friendship and doing the right thing. You could talk to your friend privately and explain why the jokes are hurtful.</p>
                <div className="bg-accent p-3 rounded-lg">
                     <p className="font-semibold">True friends help each other be better people.</p>
                </div>
                 <p className="italic font-bold text-center mt-4">This is how you build empathy and show leadership.</p>
            </CardContent>
        </Card>
    </>
);

const CaseStudy3Feedback = () => (
     <>
        <Card className="mb-6 text-left bg-card shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Brain className="w-6 h-6 text-primary" />
                    Honesty and Responsibility
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                <p>That's a very responsible way to think, Nyra. Deciding what to do when you find a wallet with money tests our character.</p>
                <p className="font-semibold">While it might be tempting to keep it, you recognized that the money belongs to someone else. Giving it to a teacher is a great choice because it's a safe and responsible way to help.</p>
            </CardContent>
        </Card>

        <Card className="mb-6 text-left bg-card shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Heart className="w-6 h-6 text-red-500" />
                    Building Integrity
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                 <p>Thinking about who the wallet belongs to and how they might feel is a sign of great maturity. By choosing to return it, you are not just returning money, you are returning peace of mind to someone.</p>
                <div className="bg-accent p-3 rounded-lg">
                     <p className="font-semibold">This is how you build integrity and earn trust from others.</p>
                </div>
            </CardContent>
        </Card>
    </>
);

const CaseStudy4Feedback = () => (
    <>
       <Card className="mb-6 text-left bg-card shadow-lg">
           <CardHeader>
               <CardTitle className="flex items-center gap-2">
                   <Brain className="w-6 h-6 text-primary" />
                   Teamwork and Fairness
               </CardTitle>
           </CardHeader>
           <CardContent className="space-y-4 text-sm">
               <p>I like how you’re thinking about fairness in your team project. It can be frustrating when a team member isn't contributing their share, especially with a deadline approaching.</p>
               <p className="font-semibold">While it might seem easier to just do the work yourself, it's also important to learn how to communicate and solve problems as a team.</p>
           </CardContent>
       </Card>

       <Card className="mb-6 text-left bg-card shadow-lg">
           <CardHeader>
               <CardTitle className="flex items-center gap-2">
                   <Heart className="w-6 h-6 text-red-500" />
                   A Collaborative Path
               </CardTitle>
           </CardHeader>
           <CardContent className="space-y-4 text-sm">
                <p>Instead of just doing their part, you could have a gentle conversation. You could ask if they're having trouble and offer to help, while still making it clear that everyone needs to contribute.</p>
               <div className="bg-accent p-3 rounded-lg">
                    <p className="font-semibold">This way, you are being both kind and fair to the whole team.</p>
               </div>
                <p className="italic font-bold text-center mt-4">This is how strong leaders build collaborative and successful teams.</p>
           </CardContent>
       </Card>
   </>
);


export function PostSubmissionScreen({ userName, onDone, caseStudyId }: PostSubmissionScreenProps) {
    
    const renderFeedback = () => {
        switch (caseStudyId) {
            case '1':
                return <CaseStudy1Feedback />;
            case '2':
                return <CaseStudy2Feedback />;
            case '3':
                return <CaseStudy3Feedback />;
            case '4':
                return <CaseStudy4Feedback />;
            default:
                return <DefaultFeedback />;
        }
    };

    const getSkillBoost = () => {
        switch (caseStudyId) {
            case '1': return 'Honesty';
            case '2': return 'Empathy';
            case '3': return 'Decision-Making';
            case '4': return 'Teamwork';
            default: return null;
        }
    };

    const skillBoost = getSkillBoost();

    return (
        <div className="w-full max-w-md mx-auto text-center animate-pop-in">
            <div className="mb-6">
                <div className="relative inline-block">
                    <Star className="absolute -top-4 -left-4 w-8 h-8 text-yellow-400 animate-pulse fill-yellow-400" />
                    <Star className="absolute -bottom-4 -right-4 w-8 h-8 text-yellow-400 animate-pulse delay-200 fill-yellow-400" />
                    <h2 className="text-3xl font-bold text-primary">Well done, {userName}!</h2>
                </div>
                <p className="text-muted-foreground mt-2">
                    You took time to think, speak, and express your thoughts. That itself shows maturity.
                </p>
            </div>

            {renderFeedback()}
            
            {skillBoost && (
                <div className="bg-primary/10 border-2 border-dashed border-primary/20 p-4 rounded-xl mb-8">
                    <h3 className="font-bold text-primary mb-2">Skill Boost!</h3>
                    <div className="flex justify-around text-center">
                        <div className="font-semibold">
                            <p>{skillBoost}</p>
                            <p className="text-green-500">+1</p>
                        </div>
                    </div>
                </div>
            )}

            <Button size="lg" onClick={onDone} className="w-full h-14 rounded-full text-lg">
                Done
            </Button>
        </div>
    );
}
