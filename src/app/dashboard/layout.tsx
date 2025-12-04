
import type { Metadata } from 'next';
import { AppSidebar } from '@/components/app/app-sidebar';

export const metadata: Metadata = {
  title: 'Dashboard - Nirmaan Edu',
  description: 'Your personalized learning dashboard.',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen w-full bg-background">
            <main className="p-4 md:p-6">
              {children}
            </main>
            <AppSidebar />
        </div>
      );
}
