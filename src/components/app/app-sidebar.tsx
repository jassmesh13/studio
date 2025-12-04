'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpenCheck,
  Briefcase,
  Home,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/dashboard/case-studies', icon: Briefcase, label: 'Case Studies' },
  { href: '/dashboard/courses', icon: BookOpenCheck, label: 'Courses' },
  { href: '/dashboard/profile', icon: User, label: 'Profile' },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed bottom-4 left-1/2 -translate-x-1/2 z-10 w-[90vw] max-w-md mx-auto sm:hidden">
        <nav className="flex items-center justify-around gap-2 rounded-full bg-primary text-primary-foreground p-3 shadow-2xl">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-full transition-colors',
                pathname === item.href ? 'bg-white/20' : 'hover:bg-white/10'
              )}
            >
              <item.icon className="h-6 w-6" />
              <span className="sr-only">{item.label}</span>
            </Link>
          ))}
        </nav>
    </aside>
  );
}
