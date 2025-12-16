
'use client';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { getWhatsNew } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

export function WhatsNew() {
    const [whatsNew, setWhatsNew] = useState<{ id: string; title: string; description: string; date: string; imageUrl: string; }[]>([]);
    
    useEffect(() => {
        const fetchWhatsNew = async () => {
            const data = await getWhatsNew();
            // Sort events by date, earliest first
            const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            setWhatsNew(sortedData);
        };
        fetchWhatsNew();
    }, []);


    return (
        <div>
            <h2 className="text-xl font-bold text-primary mb-2">What's New</h2>
            <Carousel opts={{ align: "start", loop: false }} className="w-full">
                <CarouselContent className="-ml-2">
                    {whatsNew.map(item => {
                        const image = PlaceHolderImages.find(p => p.id === item.imageUrl);
                        return (
                        <CarouselItem key={item.id} className="pl-4 basis-3/4 sm:basis-1/2 md:basis-1/3">
                            <div className="p-1">
                                <Card className="overflow-hidden">
                                    <CardHeader className="p-0">
                                        <div className="relative h-32 w-full">
                                            {image && (
                                                <Image
                                                    src={image.imageUrl}
                                                    alt={item.title}
                                                    data-ai-hint={image.imageHint}
                                                    fill
                                                    className="object-cover"
                                                />
                                            )}
                                            <Badge className="absolute top-2 right-2">{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-3">
                                        <p className="text-sm font-semibold leading-tight truncate">{item.title}</p>
                                    </CardContent>
                                    <CardFooter className="p-3 pt-0">
                                        <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                                    </CardFooter>
                                </Card>
                            </div>
                        </CarouselItem>
                    )})}
                </CarouselContent>
            </Carousel>
        </div>
    )
}
