'use client';
import { usePathname } from 'next/navigation';
import { AppSidebar } from '@/components/app/app-sidebar';

export function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // For the chat page, we want a full-screen experience without the default dashboard layout
    if (pathname === '/dashboard/chat') {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-accent to-orange-200 relative">
            <main className="p-4 md:p-6">
              {children}
            </main>
            <AppSidebar />
        </div>
      );
}
