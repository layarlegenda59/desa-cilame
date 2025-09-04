'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface ImageCarouselProps {
  images: string[];
  alt: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showControls?: boolean;
  showIndicators?: boolean;
  className?: string;
}

export function ImageCarousel({
  images,
  alt,
  autoPlay = true,
  autoPlayInterval = 4000,
  showControls = true,
  showIndicators = true,
  className
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isHovered, setIsHovered] = useState(false);

  // Jika hanya ada satu gambar, tidak perlu carousel
  if (!images || images.length <= 1) {
    return (
      <div className={cn("relative aspect-video overflow-hidden rounded-lg", className)}>
        <Image
          src={images?.[0] || '/placeholder-image.jpg'}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 66vw"
          quality={90}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop';
          }}
        />
      </div>
    );
  }

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  }, [images.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const togglePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  // Auto play functionality
  useEffect(() => {
    if (!isPlaying || isHovered) return;

    const interval = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isPlaying, isHovered, nextSlide, autoPlayInterval]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        prevSlide();
      } else if (event.key === 'ArrowRight') {
        nextSlide();
      } else if (event.key === ' ') {
        event.preventDefault();
        togglePlayPause();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, togglePlayPause]);

  return (
    <div 
      className={cn("relative aspect-video overflow-hidden rounded-lg group", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative w-full h-full">
        {images.map((image, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-all duration-500 ease-in-out",
              index === currentIndex 
                ? "opacity-100 translate-x-0" 
                : index < currentIndex 
                  ? "opacity-0 -translate-x-full" 
                  : "opacity-0 translate-x-full"
            )}
          >
            <Image
              src={image}
              alt={`${alt} ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 66vw"
              quality={90}
              priority={index === 0}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop';
              }}
            />
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      {showControls && (
        <>
          {/* Previous Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={prevSlide}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          {/* Next Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={nextSlide}
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Play/Pause Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-black/20 hover:bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={togglePlayPause}
            aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
        </>
      )}

      {/* Slide Indicators */}
      {showIndicators && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                index === currentIndex 
                  ? "bg-white scale-125" 
                  : "bg-white/50 hover:bg-white/75"
              )}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Image Counter */}
      <div className="absolute top-2 left-2 bg-black/20 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Progress Bar */}
      {isPlaying && !isHovered && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-black/20">
          <div 
            className="h-full bg-white transition-all duration-100 ease-linear"
            style={{
              width: `${((currentIndex + 1) / images.length) * 100}%`
            }}
          />
        </div>
      )}
    </div>
  );
}