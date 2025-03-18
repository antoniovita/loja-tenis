import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";

const CategoryCarousel = () => {
    return ( 
        <div>
            <Carousel>
                <CarouselContent className="-ml-2 md:-ml-4">
                    <CarouselItem className="pl-2 md:pl-4">...</CarouselItem>
                    <CarouselItem className="pl-2 md:pl-4">...</CarouselItem>
                    <CarouselItem className="pl-2 md:pl-4">...</CarouselItem>
                </CarouselContent>
            </Carousel>

        </div>
     );
}
 
export default CategoryCarousel;