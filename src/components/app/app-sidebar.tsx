'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpenCheck,
  Briefcase,
  Home,
  User,
  Trophy,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/dashboard/case-studies', icon: Briefcase, label: 'Case Studies' },
  { href: '/dashboard/courses', icon: BookOpenCheck, label: 'Courses' },
  { href: '/dashboard/gamification', icon: Trophy, label: 'Gamification' },
  { href: '/dashboard/profile', icon: User, label: 'Profile' },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Bottom Bar - Visible only on small screens */}
      <aside className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[94vw] max-w-md mx-auto md:hidden">
        <nav className="flex items-center justify-around gap-1 rounded-full bg-primary text-primary-foreground p-2 shadow-2xl border border-white/20 backdrop-blur-md">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-full transition-all active:scale-95',
                pathname === item.href ? 'bg-white/20 scale-110 shadow-inner' : 'hover:bg-white/10 opacity-80'
              )}
            >
              <item.icon className="h-6 w-6" />
              <span className="sr-only">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Desktop Sidebar - Visible only on medium and larger screens */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-72 flex-col bg-card border-r z-50 shadow-lg">
        <div className="p-8">
          <Link href="/dashboard" className="flex items-center gap-3 mb-10 group">
            <div className="bg-primary/20 p-2 rounded-xl transition-colors group-hover:bg-primary/30">
              <div className="w-8 h-8 relative">
                <Image src="/icon.png" alt="Nirmaan" fill className="object-contain" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-primary font-headline tracking-tight">Nirmaan Edu</h1>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Future Leaders</p>
            </div>
          </Link>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all duration-200',
                  pathname === item.href 
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 translate-x-2' 
                    : 'text-muted-foreground hover:bg-accent hover:text-primary'
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t bg-muted/30">
          <Link 
            href="/login" 
            className="flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </Link>
        </div>
      </aside>
    </>
  );
}
