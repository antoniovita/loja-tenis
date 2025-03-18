'use client'
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Image from 'next/image';
import Autoplay from "embla-carousel-autoplay";

export function Example() {
  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 4000,
        }),
      ]}
    >
      // ...
    </Carousel>
  )
}


const HomeCarousel = () => {
  return (
    <div className="w-full">
      <Carousel plugins={[
        Autoplay({
          delay: 2000,
        }),
      ]}>
        <CarouselContent className="flex">
          <CarouselItem>
            <div className="w-full h-[400px] bg-red-300 flex items-center justify-center">
              <h1 className="text-2xl font-bold">Slide 1</h1>
            </div>
          </CarouselItem>
          <CarouselItem>
            <div className="w-full h-[400px] bg-green-300 flex items-center justify-center">
              <h1 className="text-2xl font-bold">Slide 2</h1>
            </div>
          </CarouselItem>
          <CarouselItem>
            <div className="w-full h-[400px] bg-blue-300 flex items-center justify-center">
              <h1 className="text-2xl font-bold">Slide 3</h1>
            </div>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  );
}

export default HomeCarousel;