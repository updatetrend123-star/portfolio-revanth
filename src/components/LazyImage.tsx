import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageOff } from 'lucide-react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
}

export default function LazyImage({
  src,
  alt,
  className = '',
  wrapperClassName = '',
}: LazyImageProps) {
  const [isIntersected, setIsIntersected] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If IntersectionObserver is not supported, just load the image immediately
    if (!('IntersectionObserver' in window)) {
      setIsIntersected(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersected(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px 0px', // start loading 100px before the viewport
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-white/5 ${wrapperClassName}`}
      style={{ minHeight: !isLoaded && !hasError ? '50px' : undefined }}
    >
      {/* Shimmer / Loader state */}
      <AnimatePresence>
        {!isLoaded && !hasError && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center bg-zinc-900/60"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State Fallback */}
      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/40 text-beige/20 p-4 text-center">
          <ImageOff size={24} className="mb-2" />
          <span className="text-[10px] font-black uppercase tracking-wider">Image Offline</span>
        </div>
      ) : (
        isIntersected && (
          <motion.img
            src={src}
            alt={alt}
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            referrerPolicy="no-referrer"
            loading="lazy"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{
              opacity: isLoaded ? 1 : 0,
              scale: isLoaded ? 1 : 1.05,
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`${className} ${!isLoaded ? 'invisible' : ''}`}
          />
        )
      )}
    </div>
  );
}
