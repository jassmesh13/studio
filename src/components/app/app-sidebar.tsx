'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpenCheck,
  Briefcase,
  Home,
  LifeBuoy,
  Settings,
  Trophy,
  User,
  Package2,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { mainUser } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/dashboard/courses', icon: BookOpenCheck, label: 'Courses' },
  { href: '/dashboard/case-studies', icon: Briefcase, label: 'Case Studies' },
  { href: '/dashboard/gamification', icon: Trophy, label: 'Gamification' },
  { href: '/dashboard/profile', icon: User, label: 'Profile' },
];

export function AppSidebar() {
  const pathname = usePathname();

  const userAvatar = PlaceHolderImages.find(p => p.id === mainUser.avatarUrl);

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-card sm:flex">
      <TooltipProvider>
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="#"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">Nirmaan Edu</span>
          </Link>
          {navItems.map((item) => (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
                    pathname.startsWith(item.href) && (item.href !== '/dashboard' || pathname === '/dashboard') ? 'bg-accent text-accent-foreground' : ''
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="sr-only">{item.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          ))}
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link
                    href="/dashboard/profile"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                    >
                    <Avatar className="h-8 w-8">
                        {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt={mainUser.name} data-ai-hint={userAvatar.imageHint}/>}
                        <AvatarFallback>{mainUser.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="sr-only">Profile</span>
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Profile</TooltipContent>
            </Tooltip>
        </nav>
      </TooltipProvider>
    </aside>
  );
}
