import Link from 'next/link';

const BotIcon = () => (
    <div className="relative flex-shrink-0">
        <svg width="60" height="60" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="32" fill="#FFC107"/>
            <path d="M16 32C16 22.0589 24.0589 14 34 14C43.9411 14 52 22.0589 52 32" stroke="white" strokeWidth="6"/>
            <rect x="12" y="29" width="8" height="16" rx="4" fill="white"/>
            <rect x="44" y="29" width="8" height="16" rx="4" fill="white"/>
            <rect x="18" y="24" width="28" height="22" rx="4" fill="#673AB7"/>
            <circle cx="27" cy="31" r="3" fill="white"/>
            <circle cx="37" cy="31" r="3" fill="white"/>
            <rect x="25" y="38" width="14" height="3" rx="1.5" fill="white"/>
            <rect x="23" y="49" width="18" height="10" rx="3" fill="#F44336"/>
            <text fill="white" xmlSpace="preserve" style={{whiteSpace: 'pre'}} fontFamily="sans-serif" fontSize="8" fontWeight="bold" letterSpacing="0em"><tspan x="26" y="56.5">BOT</tspan></text>
        </svg>
    </div>
);

export function ChatAICard() {
    return (
        <Link href="/dashboard/chat" className="block my-6">
            <div className="bg-primary text-primary-foreground font-bold text-xl p-2 rounded-full flex items-center gap-4 shadow-lg transition-transform hover:scale-105">
                <BotIcon />
                <span className="flex-1 text-center pr-10">Chat with Nirmaan AI</span>
            </div>
        </Link>
    )
}
