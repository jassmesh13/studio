import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function GetStartedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <h1 className="text-4xl font-bold mb-4">Welcome!</h1>
      <p className="text-muted-foreground mb-8">What would you like to do?</p>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
