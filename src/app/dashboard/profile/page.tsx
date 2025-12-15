'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getProfileData } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Profile } from '@/lib/types';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const [profileData, setProfileData] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            const data = await getProfileData();
            setProfileData(data);
            setLoading(false);
        };
        fetchData();
    }, []);
    
    if (loading || !profileData) {
        return <div>Loading...</div>;
    }

    const userAvatar = PlaceHolderImages.find(p => p.id === profileData.avatarUrl);

  return (
    <div className="flex flex-col items-center max-w-sm mx-auto p-4 pb-24">
        <div className='w-full flex justify-between items-center'>
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <Button variant="outline" size="sm">Edit profile</Button>
        </div>
        
        <h1 className="text-2xl font-bold text-primary my-4">Your Profile</h1>

        <div className="flex flex-col items-center mb-6">
            <Avatar className="h-28 w-28 mb-2 border-4 border-primary">
                {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt={profileData.name} data-ai-hint={userAvatar.imageHint}/>}
                <AvatarFallback className="text-4xl">{profileData.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <Button variant="link" className="text-primary font-semibold">CHANGE AVATAR</Button>
        </div>
        
        <div className="w-full space-y-6">
            <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="name" className="text-muted-foreground font-semibold">Name</Label>
                <Input type="text" id="name" defaultValue={profileData.name} className="bg-muted border-none h-12 rounded-2xl" />
            </div>
            <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="username" className="text-muted-foreground font-semibold">Username</Label>
                <Input type="text" id="username" defaultValue={profileData.username} className="bg-muted border-none h-12 rounded-2xl" />
            </div>
            <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="password"  className="text-muted-foreground font-semibold">Password</Label>
                <Input type="password" id="password" defaultValue="************" className="bg-muted border-none h-12 rounded-2xl" />
            </div>
            <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="school" className="text-muted-foreground font-semibold">School</Label>
                <Input type="text" id="school" defaultValue={profileData.school} className="bg-muted border-none h-12 rounded-2xl" />
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="class" className="text-muted-foreground font-semibold">Class</Label>
                    <Input type="text" id="class" defaultValue={profileData.class} className="bg-muted border-none h-12 rounded-2xl" />
                </div>
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="age" className="text-muted-foreground font-semibold">Age</Label>
                    <Input type="number" id="age" defaultValue={profileData.age} className="bg-muted border-none h-12 rounded-2xl" />
                </div>
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="gender" className="text-muted-foreground font-semibold">Gender</Label>
                    <Input type="text" id="gender" defaultValue={profileData.gender} className="bg-muted border-none h-12 rounded-2xl" />
                </div>
            </div>
             <div className="grid w-full items-center gap-1.5">
                <Label className="text-muted-foreground font-semibold">Contact Details</Label>
                <div className="flex gap-4">
                    <Input type="email" id="email" defaultValue={profileData.email} className="bg-muted border-none h-12 rounded-2xl w-full" />
                    <Input type="tel" id="phone" defaultValue={profileData.phone} className="bg-muted border-none h-12 rounded-2xl w-full" />
                </div>
            </div>
        </div>
    </div>
  );
}
