"use client";

import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import message from "@/message.json";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { BackgroundBeams } from "@/components/ui/background-beams";

export default function Home() {
  return (
    <>
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gray-800 text-white">
        <section className="text-center mb-8 md:mb-10">
          <h1 className="text-3xl md:text-5xl font-bold">
            Unlock Honest Insights
          </h1>
          <p className="mt-5 md:mt-4 text-base md:text-lg">
            Get and give anonymous feedback safely, fostering genuine and
            constructive growth.
          </p>
        </section>

        {/* Carousel Component */}
        <div className="relative z-10 w-full max-w-lg md:max-w-xl mb-20">
          <Carousel
            plugins={[Autoplay({ delay: 2000 })]}
            className="w-full max-w-lg md:max-w-xl mb-20"
          >
            <CarouselContent>
              {message.map((message, index) => (
                <CarouselItem key={index} className="p-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{message.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                      <Mail className="flex-shrink-0" />
                      <div>
                        <p>{message.content}</p>
                        <p className="text-xs text-muted-foreground">
                          {message.received}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </main>
      <footer className="text-center p-4 md:p-6 bg-gray-900 text-white">
        © 2023 True Feedback. All rights reserved.
      </footer>
      <BackgroundBeams />
    </>
  );
}
