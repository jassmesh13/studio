'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { profileData } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const userAvatar = PlaceHolderImages.find(p => p.id === profileData.avatarUrl);
    const router = useRouter();

  return (
    <div className="grid gap-6">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
                <ArrowLeft />
                <span className="sr-only">Back</span>
            </Button>
            <h1 className="text-2xl font-bold font-headline">Profile</h1>
        </div>
        <Card>
            <CardHeader className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                    {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt={profileData.name} data-ai-hint={userAvatar.imageHint}/>}
                    <AvatarFallback className="text-3xl">{profileData.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-2xl">{profileData.name}</CardTitle>
                <CardDescription>{profileData.email}</CardDescription>
                <p className="text-sm text-muted-foreground max-w-md mt-2">{profileData.bio}</p>
            </CardHeader>
        </Card>
        <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Profile</CardTitle>
                        <CardDescription>Make changes to your public profile.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" defaultValue={profileData.name} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" defaultValue={profileData.email} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea id="bio" defaultValue={profileData.bio} className="min-h-[100px]" />
                        </div>
                        <Button>Save Changes</Button>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="achievements">
                <Card>
                    <CardHeader>
                        <CardTitle>Achievements & Badges</CardTitle>
                        <CardDescription>All the badges you have collected.</CardDescription>
                    </CardHeader>
                    <CardContent>
                    <TooltipProvider>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            {profileData.achievements.map(badge => {
                                const image = PlaceHolderImages.find(p => p.id === badge.imageUrl);
                                return (
                                <Tooltip key={badge.id}>
                                    <TooltipTrigger>
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="relative w-24 h-24">
                                                {image && <Image src={image.imageUrl} alt={badge.name} data-ai-hint={image.imageHint} fill className="rounded-full object-cover" />}
                                            </div>
                                            <p className="text-sm font-medium text-center">{badge.name}</p>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{badge.description}</p>
                                    </TooltipContent>
                                </Tooltip>
                                )
                            })}
                        </div>
                    </TooltipProvider>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="settings">
                <Card>
                    <CardHeader>
                        <CardTitle>Settings</CardTitle>
                        <CardDescription>Manage your account settings.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="font-semibold">Notifications</h3>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="email-notifications">Email Notifications</Label>
                                <Switch id="email-notifications" defaultChecked={profileData.settings.notifications.email} />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="push-notifications">Push Notifications</Label>
                                <Switch id="push-notifications" defaultChecked={profileData.settings.notifications.push} />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-semibold">Privacy</h3>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="show-profile" className="flex flex-col space-y-1">
                                    <span>Public Profile</span>
                                    <span className="font-normal leading-snug text-muted-foreground">
                                        Allow other users to see your profile and achievements.
                                    </span>
                                </Label>
                                <Switch id="show-profile" defaultChecked={profileData.settings.privacy.showProfile} />
                            </div>
                        </div>
                        <Button>Save Settings</Button>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
  );
}
