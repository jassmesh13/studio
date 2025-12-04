import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-accent to-orange-200">
      <header className="p-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/get-started">Get Started</Link>
        </Button>
      </header>
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-7xl font-extrabold text-primary mb-4" style={{
          background: 'linear-gradient(180deg, #FF8C42 0%, #FF5C00 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Nirmaan
        </h1>
        <p className="text-2xl text-foreground/80">
          Shaping a Generation that
        </p>
        <p className="text-2xl font-bold text-primary">
          Thinks, Feels, And Leads.
        </p>
      </main>
      <footer className="p-8">
        <Button size="lg" className="w-full rounded-full h-14 text-lg font-bold" asChild>
          <Link href="/login">Start Learning</Link>
        </Button>
      </footer>
    </div>
  );
}
