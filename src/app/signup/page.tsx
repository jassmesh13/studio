
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getSchools } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { School } from '@/lib/types';
import { useEffect, useState } from 'react';

export default function SignupPage() {
  const loginBg = PlaceHolderImages.find(p => p.id === 'login-background');
  const [schools, setSchools] = useState<School[]>([]);

  useEffect(() => {
      const fetchSchools = async () => {
          const schoolData = await getSchools();
          setSchools(schoolData);
      };
      fetchSchools();
  }, []);

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[400px] gap-6">
          <div className="grid gap-2 text-center">
            <Image src="/logo.png" alt="Nirmaan Logo" width={240} height={60} className="mx-auto" />
            <p className="text-balance text-muted-foreground">Create your account to start your learning journey</p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Sign Up</CardTitle>
              <CardDescription>Enter your information to create an account.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="John Doe" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email ID (Optional)</Label>
                  <Input id="email" type="email" placeholder="m@example.com" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="student-class">Student Class</Label>
                        <Input id="student-class" placeholder="e.g., 10th" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="mobile">Mobile (Optional)</Label>
                        <Input id="mobile" type="tel" placeholder="123-456-7890" />
                    </div>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="school">School Name</Label>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Select your school" />
                        </SelectTrigger>
                        <SelectContent>
                            {schools.map(school => (
                                <SelectItem key={school.id} value={school.name}>{school.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="user-id">User ID</Label>
                  <Input id="user-id" placeholder="Create a user ID" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" required />
                </div>
                <Button type="submit" className="w-full" asChild>
                  <Link href="/dashboard">Create an account</Link>
                </Button>
              <div className="mt-4 text-center text-sm">
                Already have an account?{' '}
                <Link href="/login" className="underline">
                  Login
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="hidden bg-muted lg:block relative">
        {loginBg && (
            <Image
                src={loginBg.imageUrl}
                alt={loginBg.description}
                data-ai-hint={loginBg.imageHint}
                fill
                className="object-cover"
            />
        )}
      </div>
    </div>
  );
}
