import { WifiOff } from 'lucide-react';
import Link from 'next/link';

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
      <WifiOff className="w-24 h-24 text-muted-foreground mb-4" />
      <h1 className="text-3xl font-bold mb-2">You are Offline</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        It looks like you've lost your internet connection. Don't worry, you can still access previously visited pages.
      </p>
      <Link href="/dashboard" className="text-primary hover:underline">
        Go to Dashboard
      </Link>
    </div>
  );
}
