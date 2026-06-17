import { Canvas } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, OrbitControls } from '@react-three/drei';
import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { motion } from 'motion/react';

function Background() {
  return (
    <mesh scale={100} rotation={[0, 0, 0]}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshBasicMaterial side={THREE.BackSide} color="#121A1B" />
    </mesh>
  );
}

function FloatingShapes() {
  return (
    <>
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <Sphere args={[1, 100, 200]} position={[2, 0, 0]} scale={1.2}>
          <MeshDistortMaterial
            color="#A7AA63"
            attach="material"
            distort={0.4}
            speed={2}
            roughness={0.2}
            metalness={0.8}
          />
        </Sphere>
      </Float>

      <Float speed={3} rotationIntensity={2} floatIntensity={1.5}>
        <mesh position={[-3, 2, -2]} rotation={[Math.PI / 4, 0, Math.PI / 4]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#505039" metalness={0.5} roughness={0.1} />
        </mesh>
      </Float>

      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={3}>
        <mesh position={[-2, -2, -1]} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
          <octahedronGeometry args={[0.8]} />
          <meshStandardMaterial color="#EAE6D2" metalness={0.8} roughness={0.2} />
        </mesh>
      </Float>
    </>
  );
}

export default function Hero3D() {
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const supported = !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
      setWebglSupported(supported);
    } catch (e) {
      setWebglSupported(false);
    }
  }, []);

  // While detecting, render a transparent placeholder to prevent layout layout shifts
  if (webglSupported === null) {
    return <div className="absolute inset-0 -z-10 bg-transparent" />;
  }

  // Purely CSS/SVG glassmorphic shapes generated offline when WebGL is offline or unsupported
  if (!webglSupported) {
    return (
      <div className="absolute inset-0 -z-10 bg-transparent overflow-hidden">
        {/* Glowing backdrop blur shapes */}
        <div className="absolute inset-0 flex items-center justify-center opacity-40 blur-[130px]">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, -30, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="w-[300px] h-[300px] rounded-full bg-accent/20 absolute -top-10 left-[20%]"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.15, 1],
              x: [0, -40, 0],
              y: [0, 40, 0]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="w-[400px] h-[400px] rounded-full bg-secondary/15 absolute -bottom-10 right-[25%]"
          />
        </div>

        {/* Elegant layered vector abstract shape representing the main glowing sphere */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <motion.div
            animate={{ 
              y: [-15, 15, -15],
              rotate: 360 
            }}
            transition={{ 
              y: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
              rotate: { duration: 40, repeat: Infinity, ease: 'linear' }
            }}
            className="w-48 h-48 md:w-64 md:h-64 absolute right-[10%] md:right-[20%] top-[35%] opacity-35"
          >
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <defs>
                <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#A7AA63" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#303c2a" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              <path 
                d="M100 15C53 15 15 53 15 100C15 147 53 185 100 185C147 185 185 147 185 100C185 53 147 15 100 15ZM100 45C130.4 45 155 69.6 155 100C155 130.4 130.4 155 100 155C69.6 155 45 130.4 45 100C45 69.6 69.6 45 100 45Z" 
                fill="url(#glowGrad)" 
              />
            </svg>
          </motion.div>

          <motion.div
            animate={{ 
              y: [10, -10, 10],
              rotate: -360 
            }}
            transition={{ 
              y: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
              rotate: { duration: 30, repeat: Infinity, ease: 'linear' }
            }}
            className="w-16 h-16 md:w-24 md:h-24 absolute left-[15%] top-[25%] opacity-20"
          >
            <rect className="w-full h-full bg-accent/25 rounded-2xl transform rotate-45 border border-white/10 backdrop-blur-sm" />
          </motion.div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/50 to-primary pointer-events-none" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 -z-10 bg-transparent overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }} dpr={[1, 2]}>
        <ambientLight intensity={0.6} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <directionalLight position={[-5, 5, -5]} intensity={0.4} color="#A7AA63" />
        <pointLight position={[-10, -10, -10]} color="#A7AA63" intensity={1} />
        <pointLight position={[10, -10, 5]} color="#ffffff" intensity={0.8} />
        
        <FloatingShapes />
        
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/50 to-primary pointer-events-none" />
    </div>
  );
}

