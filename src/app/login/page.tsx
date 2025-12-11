
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function LoginPage() {
  const loginBg = PlaceHolderImages.find(p => p.id === 'login-background');

  return (
    <div className="w-full h-screen lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <Image src="/logo.png" alt="Nirmaan Logo" width={240} height={60} className="mx-auto" />
            <p className="text-balance text-muted-foreground">Enter your User ID below to login to your account</p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>Welcome back! Please sign in to continue.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="userId">User Id</Label>
                  <Input id="userId" type="text" placeholder="your-user-id" required />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link href="#" className="ml-auto inline-block text-sm underline">
                      Forgot your password?
                    </Link>
                  </div>
                  <Input id="password" type="password" required />
                </div>
                <Button type="submit" className="w-full" asChild>
                  <Link href="/dashboard">Login</Link>
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{' '}
                <Link href="#" className="underline">
                  Sign up
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
