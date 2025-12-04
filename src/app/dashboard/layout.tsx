import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - Nirmaan Edu',
  description: 'Your personalized learning dashboard.',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen w-full flex-col bg-background">
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
              {children}
            </main>
        </div>
      );
}
