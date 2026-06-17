import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageOff } from 'lucide-react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  category?: string;
}

// Generate a stable deterministic hash code for any string to assign beautiful unique colors
const hashCode = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

// Generates an super-lightweight SVG vector mesh representing a beautiful micro blurred neon glow
const getDynamicPlaceholder = (seed: string, category?: string) => {
  const hash = hashCode(seed);
  
  // High-performance cybersecurity & developer neon accent palettes
  const colors = [
    ['#00f2fe', '#4facfe'], // Cyan / Royal Blue
    ['#f59e0b', '#ff007f'], // Cyberpunk Gold / Neon Pink
    ['#10b981', '#05c1e6'], // Tech Mint / Sky
    ['#a855f7', '#fb53ff'], // Magenta / Electric Purple
    ['#3b82f6', '#6366f1'], // Deep Indigo / Dark Purple
    ['#14b8a6', '#00f2fe'], // Emerald / Matrix Cyan
  ];

  let colorPair = colors[hash % colors.length];
  if (category) {
    const catLower = category.toLowerCase();
    if (catLower.includes('business')) colorPair = colors[0];
    else if (catLower.includes('hospitality') || catLower.includes('residential')) colorPair = colors[1];
    else if (catLower.includes('saas') || catLower.includes('software')) colorPair = colors[2];
    else if (catLower.includes('agri') || catLower.includes('farm')) colorPair = colors[3];
  }

  const [color1, color2] = colorPair;
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250" width="100%" height="100%">
    <rect width="100%" height="100%" fill="#0a0f10" />
    <g filter="blur(50px)" opacity="0.6">
      <circle cx="${80 + (hash % 120)}" cy="${60 + (hash % 100)}" r="100" fill="${color1}" />
      <circle cx="${320 - (hash % 120)}" cy="${190 - (hash % 100)}" r="110" fill="${color2}" />
      <circle cx="${200 + (hash % 60)}" cy="${130 + (hash % 60)}" r="80" fill="#0bc5ea" opacity="0.15" />
    </g>
  </svg>`;
  
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
};

export default function LazyImage({
  src,
  alt,
  className = '',
  wrapperClassName = '',
  category,
}: LazyImageProps) {
  const [isIntersected, setIsIntersected] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Immediate fallback if intersection observer is unsupported
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
        rootMargin: '200px 0px', // Preload images 200px before scroll
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const placeholderUrl = getDynamicPlaceholder(alt, category);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-[#0a0f10] ${wrapperClassName}`}
      style={{ minHeight: !isLoaded && !hasError ? '150px' : undefined }}
    >
      {/* Absolute Blurred Vector Glow Placeholder / Ambient Light */}
      <AnimatePresence>
        {!isLoaded && !hasError && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="absolute inset-0 z-10 select-none overflow-hidden"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center scale-110"
              style={{ 
                backgroundImage: `url("${placeholderUrl}")`,
                filter: 'blur(8px)',
              }}
            />
            {/* Elegant Shimmer Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error state fallback */}
      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/40 text-beige/20 p-4 text-center z-10">
          <ImageOff size={24} className="mb-2 text-beige/40" />
          <span className="text-[10px] font-black uppercase tracking-widest text-beige/30">Image Offline</span>
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
            initial={{ filter: 'blur(25px)', scale: 1.05, opacity: 0 }}
            animate={{
              filter: isLoaded ? 'blur(0px)' : 'blur(25px)',
              scale: isLoaded ? 1 : 1.05,
              opacity: isLoaded ? 1 : 0,
            }}
            transition={{ 
              duration: 0.8, 
              ease: [0.16, 1, 0.3, 1] // Custom smooth cinematic exponential out ease
            }}
            className={`${className} ${!isLoaded ? 'invisible' : 'visible'}`}
          />
        )
      )}
    </div>
  );
}

