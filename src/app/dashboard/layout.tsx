import type { Metadata } from 'next';
import { DashboardLayoutClient } from './dashboard-layout-client';

export const metadata: Metadata = {
  title: 'Dashboard - Nirmaan Edu',
  description: 'Your personalized learning dashboard.',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return <DashboardLayoutClient>{children}</DashboardLayoutClient>
}
