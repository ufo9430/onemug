import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const CarouselContext = React.createContext(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }
  return context;
}

const Carousel = React.forwardRef(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        axis: orientation === "vertical" ? "y" : "x",
        ...opts,
      },
      plugins,
    );
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);

    React.useEffect(() => {
      if (!api) return;
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
      api.on("select", () => {
        setCanScrollPrev(api.canScrollPrev());
        setCanScrollNext(api.canScrollNext());
      });
    }, [api]);

    const scrollPrev = () => api && api.scrollPrev();
    const scrollNext = () => api && api.scrollNext();

    React.useEffect(() => {
      if (setApi && api) setApi(api);
    }, [api, setApi]);

    const contextValue = {
      carouselRef,
      api,
      scrollPrev,
      scrollNext,
      canScrollPrev,
      canScrollNext,
      orientation,
      opts,
      plugins,
      setApi,
    };

    return (
      <CarouselContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(
            "relative w-full",
            orientation === "vertical" && "flex flex-col",
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  },
);
Carousel.displayName = "Carousel";

const CarouselPrevious = React.forwardRef(
  ({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { orientation, scrollPrev, canScrollPrev } = useCarousel();
    return (
      <Button
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        variant={variant}
        size={size}
        className={cn(
          "absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full",
          orientation === "vertical" && "left-1/2 top-2 -translate-x-1/2 -translate-y-0 rotate-90",
          className,
        )}
        {...props}
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
    );
  }
);
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = React.forwardRef(
  ({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { orientation, scrollNext, canScrollNext } = useCarousel();
    return (
      <Button
        onClick={scrollNext}
        disabled={!canScrollNext}
        variant={variant}
        size={size}
        className={cn(
          "absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full",
          orientation === "vertical" && "right-1/2 top-2 -translate-x-1/2 -translate-y-0 rotate-90",
          className,
        )}
        {...props}
      >
        <ArrowRight className="h-4 w-4" />
      </Button>
    );
  }
);
CarouselNext.displayName = "CarouselNext";

export {
  Carousel,
  CarouselPrevious,
  CarouselNext,
  useCarousel,
};
