import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

interface AnimatedBackgroundProps {
  variant?: 'default' | 'intense' | 'celebration';
}

export default function AnimatedBackground({ variant = 'default' }: AnimatedBackgroundProps) {
  const particles = useMemo<Particle[]>(() => {
    const count = variant === 'celebration' ? 30 : variant === 'intense' ? 20 : 12;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.3 + 0.05,
    }));
  }, [variant]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(219,163,71,0.08)_0%,transparent_70%)]" />

      {/* Animated glow orbs */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(219,163,71,0.06) 0%, transparent 70%)',
          top: '10%',
          left: '10%',
        }}
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -80, 60, 0],
          scale: [1, 1.3, 0.9, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(219,163,71,0.04) 0%, transparent 70%)',
          bottom: '5%',
          right: '5%',
        }}
        animate={{
          x: [0, -120, 80, 0],
          y: [0, 60, -100, 0],
          scale: [1, 0.8, 1.2, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />

      {variant === 'intense' && (
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(231,76,60,0.04) 0%, transparent 70%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      )}

      {/* Floating particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gold"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -40, 20, -60, 0],
            x: [0, 20, -15, 10, 0],
            opacity: [p.opacity, p.opacity * 2, p.opacity * 0.5, p.opacity * 1.5, p.opacity],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Celebration confetti */}
      {variant === 'celebration' &&
        Array.from({ length: 40 }, (_, i) => {
          const colors = ['#dba347', '#f0c96e', '#27ae60', '#3498db', '#9b59b6', '#e74c3c'];
          return (
            <motion.div
              key={`confetti-${i}`}
              className="absolute"
              style={{
                width: Math.random() * 8 + 4,
                height: Math.random() * 8 + 4,
                backgroundColor: colors[i % colors.length],
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                left: `${Math.random() * 100}%`,
                top: '-5%',
              }}
              animate={{
                y: ['0vh', '110vh'],
                x: [0, (Math.random() - 0.5) * 200],
                rotate: [0, Math.random() * 720 - 360],
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                delay: Math.random() * 2,
                repeat: Infinity,
                ease: 'easeIn',
              }}
            />
          );
        })}

      {/* Subtle grid lines */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(219,163,71,1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(219,163,71,1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  );
}
