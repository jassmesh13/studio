import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { whatsNew } from "@/lib/data";

export function WhatsNew() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>What&apos;s New</CardTitle>
                <CardDescription>Latest updates and announcements.</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="space-y-4">
                    {whatsNew.map(item => (
                        <li key={item.id} className="grid gap-1">
                            <div className="font-semibold">{item.title}</div>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                            <p className="text-xs text-muted-foreground">{item.date}</p>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    )
}
