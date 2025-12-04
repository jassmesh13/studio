'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { profileData } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';

export default function ProfilePage() {
    const userAvatar = PlaceHolderImages.find(p => p.id === profileData.avatarUrl);

  return (
    <div className="flex flex-col items-center max-w-sm mx-auto p-4">
        <div className='w-full flex justify-end'>
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
                <Label htmlFor="email" className="text-muted-foreground font-semibold">Email</Label>
                <Input type="email" id="email" defaultValue={profileData.email} className="bg-muted border-none h-12 rounded-2xl" />
            </div>
        </div>

        <Button asChild size="lg" className="w-full mt-8 rounded-full">
            <Link href="/dashboard">Start Learning</Link>
        </Button>
    </div>
  );
}
