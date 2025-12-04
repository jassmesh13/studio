import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { whatsNew } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";

export function WhatsNew() {
    return (
        <div>
            <h2 className="text-xl font-bold text-primary mb-2">What's New</h2>
            <div className="grid grid-cols-2 gap-4">
                {whatsNew.map(item => {
                    const image = PlaceHolderImages.find(p => p.id === item.imageUrl);
                    return (
                    <Card key={item.id} className="overflow-hidden">
                        <CardHeader className="p-0">
                            <div className="relative h-24 w-full">
                                {image && (
                                    <Image
                                        src={image.imageUrl}
                                        alt={item.title}
                                        data-ai-hint={image.imageHint}
                                        fill
                                        className="object-cover"
                                    />
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="p-2">
                            <p className="text-xs font-semibold leading-tight">{item.title}</p>
                        </CardContent>
                        <CardFooter className="p-2 pt-0">
                            <p className="text-xs text-muted-foreground">{item.description}</p>
                        </CardFooter>
                    </Card>
                )})}
            </div>
        </div>
    )
}
