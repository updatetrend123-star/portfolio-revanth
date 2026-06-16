import { motion } from 'motion/react';
import { 
  Code2, 
  Figma, 
  Github, 
  Layout, 
  Smartphone, 
  Terminal, 
  Globe, 
  Database,
  Cpu,
  Layers
} from 'lucide-react';
import { cn } from '../lib/utils';

const icons = [
  { id: 'code', Icon: Code2, color: 'text-accent', delay: 0, top: '20%', left: '10%' },
  { id: 'figma', Icon: Figma, color: 'text-secondary', delay: 0.5, top: '15%', left: '80%' },
  { id: 'github', Icon: Github, color: 'text-beige', delay: 1, top: '70%', left: '15%' },
  { id: 'layout', Icon: Layout, color: 'text-accent', delay: 1.5, top: '75%', left: '75%' },
  { id: 'smartphone', Icon: Smartphone, color: 'text-secondary', delay: 2, top: '45%', left: '85%' },
  { id: 'terminal', Icon: Terminal, color: 'text-accent', delay: 2.5, top: '50%', left: '5%' },
  { id: 'globe', Icon: Globe, color: 'text-white', delay: 3, top: '30%', left: '40%' },
  { id: 'database', Icon: Database, color: 'text-secondary', delay: 3.5, top: '65%', left: '55%' },
];

export default function FloatingIcons() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {icons.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.1, 1],
            y: [-15, 15, -15],
            x: [-8, 8, -8]
          }}
          transition={{ 
            duration: 10 + (i * 0.5),
            repeat: Infinity,
            delay: item.delay,
            ease: "easeInOut"
          }}
          className={cn(
            "absolute filter blur-[1px] md:blur-none transition-all duration-1000",
            item.color,
            i > 3 ? "hidden sm:block" : "block" // Show fewer icons on mobile
          )}
          style={{
            top: item.top,
            left: item.left,
          }}
        >
          <item.Icon className="w-8 h-8 md:w-16 md:h-16 opacity-20 md:opacity-100" strokeWidth={1} />
        </motion.div>
      ))}
    </div>
  );
}
