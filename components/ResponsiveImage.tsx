'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: '16-9' | '4-3' | 'square' | 'auto';
  priority?: boolean;
  quality?: number;
  sizes?: string;
  objectFit?: 'cover' | 'contain' | 'fill';
  loading?: 'lazy' | 'eager';
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export default function ResponsiveImage({
  src,
  alt,
  className,
  aspectRatio = 'auto',
  priority = false,
  quality = 80,
  sizes = '100vw',
  objectFit = 'cover',
  loading = 'lazy',
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  onError
}: ResponsiveImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  const aspectRatioClass = {
    '16-9': 'aspect-16-9',
    '4-3': 'aspect-4-3',
    'square': 'aspect-square',
    'auto': ''
  }[aspectRatio];

  const objectFitClass = {
    'cover': 'object-cover',
    'contain': 'object-contain',
    'fill': 'object-fill'
  }[objectFit];

  return (
    <div className={cn(
      'relative overflow-hidden',
      aspectRatioClass,
      className
    )}>
      {/* Loading placeholder */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        </div>
      )}
      
      {/* Error fallback */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">Gambar tidak dapat dimuat</p>
          </div>
        </div>
      )}
      
      {/* Main image */}
      {!hasError && (
        <Image
          src={src}
          alt={alt}
          fill
          className={cn(
            objectFitClass,
            'transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100'
          )}
          priority={priority}
          quality={quality}
          sizes={sizes}
          loading={loading}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
}

// Preset configurations for common use cases
export const HeroImage = (props: Omit<ResponsiveImageProps, 'aspectRatio' | 'priority' | 'sizes'>) => (
  <ResponsiveImage
    {...props}
    aspectRatio="16-9"
    priority
    sizes="100vw"
    quality={85}
    className={cn('hero-image', props.className)}
  />
);

export const CardImage = (props: Omit<ResponsiveImageProps, 'aspectRatio' | 'sizes'>) => (
  <ResponsiveImage
    {...props}
    aspectRatio="4-3"
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    className={cn('card-image', props.className)}
  />
);

export const SquareImage = (props: Omit<ResponsiveImageProps, 'aspectRatio'>) => (
  <ResponsiveImage
    {...props}
    aspectRatio="square"
    className={cn('card-image', props.className)}
  />
);

export const NewsImage = (props: Omit<ResponsiveImageProps, 'aspectRatio' | 'sizes'>) => (
  <ResponsiveImage
    {...props}
    aspectRatio="16-9"
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    className={cn('card-image', props.className)}
  />
);