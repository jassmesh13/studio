import { AppSidebar } from '@/components/app/app-sidebar';
import { Header } from '@/components/app/header';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - Nirmaan Edu',
  description: 'Your personalized learning dashboard.',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
          <AppSidebar />
          <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
            <Header />
            <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
              {children}
            </main>
          </div>
        </div>
      );
}
