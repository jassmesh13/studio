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
        <div className="min-h-screen w-full bg-gradient-to-b from-accent to-orange-100 relative flex overflow-x-hidden">
            {/* Navigation (Responsive) */}
            <AppSidebar />
            
            {/* Main Content Area */}
            <main className="flex-1 min-h-screen w-full md:ml-72 transition-all">
                <div className="p-4 md:p-10 lg:p-12 max-w-6xl mx-auto w-full pb-24 md:pb-12">
                    {children}
                </div>
            </main>
        </div>
    );
}
