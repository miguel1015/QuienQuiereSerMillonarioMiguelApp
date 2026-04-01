import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import AnimatedBackground from '../components/AnimatedBackground';
import logo from '../assets/images/¿Quién quiere ser millonario_ edición cristiana.png';

interface HomeScreenProps {
  onStart: () => void;
}

// Pre-generate convergence particles
const convergenceParticles = Array.from({ length: 40 }, (_, i) => {
  const angle = (i / 40) * Math.PI * 2;
  const distance = 400 + Math.random() * 300;
  return {
    id: i,
    startX: Math.cos(angle) * distance,
    startY: Math.sin(angle) * distance,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 1.5,
    duration: 1.5 + Math.random() * 1,
  };
});

export default function HomeScreen({ onStart }: HomeScreenProps) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center relative overflow-hidden noise-overlay">
      <AnimatedBackground variant="default" />

      {/* Light rays from center - now more dramatic */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 12 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 w-0.5 origin-bottom"
            style={{
              height: '140vh',
              transform: `rotate(${i * 30}deg)`,
              background: 'linear-gradient(to top, rgba(219,163,71,0.06) 0%, rgba(219,163,71,0.02) 30%, transparent 60%)',
            }}
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: [0.2, 0.5, 0.2], scaleY: 1 }}
            transition={{
              opacity: { duration: 3 + i * 0.3, repeat: Infinity, ease: 'easeInOut' },
              scaleY: { duration: 2, delay: i * 0.1, ease: 'easeOut' },
            }}
          />
        ))}
      </div>

      {/* Convergence particles - fly toward logo */}
      {showContent && convergenceParticles.map((p) => (
        <motion.div
          key={`conv-${p.id}`}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: '50%',
            top: '45%',
            backgroundColor: '#f0c96e',
            boxShadow: '0 0 8px rgba(240,201,110,0.6)',
          }}
          initial={{ x: p.startX, y: p.startY, opacity: 0, scale: 0 }}
          animate={{ x: 0, y: 0, opacity: [0, 1, 1, 0], scale: [0, 1, 1, 0] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'easeIn',
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="flex flex-col items-center justify-center z-10 px-4"
      >
        {/* Logo with epic entrance */}
        <motion.div
          initial={{ scale: 0, rotate: -10, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.5, type: 'spring', stiffness: 100, damping: 15 }}
          className="relative inline-block mb-6"
        >
          <img
            src={logo}
            alt="¿Quién Quiere Ser Millonario? Edición Cristiana"
            className="w-[90vw] h-[65vh] md:w-[70vw] md:h-[72vh] object-contain relative z-10 drop-shadow-2xl"
          />
          {/* Pulsating glow behind logo */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ filter: 'blur(60px)', background: 'rgba(219,163,71,0.3)' }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Secondary glow ring */}
          <motion.div
            className="absolute inset-[-10%] rounded-full"
            style={{ filter: 'blur(80px)', background: 'rgba(219,163,71,0.1)' }}
            animate={{ scale: [1.2, 1.6, 1.2], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          />
        </motion.div>

        {/* Start button - premium with energy rings */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          className="relative"
        >
          {/* Energy pulse rings */}
          {[0, 0.7, 1.4].map((delay, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-2xl border-2 border-gold/40"
              animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
              transition={{ duration: 2, delay, repeat: Infinity, ease: 'easeOut' }}
            />
          ))}
          <motion.button
            whileHover={{
              scale: 1.08,
              boxShadow: '0 0 80px rgba(219, 163, 71, 0.6), 0 0 160px rgba(219, 163, 71, 0.2)',
            }}
            whileTap={{ scale: 0.92 }}
            onClick={onStart}
            className="relative px-12 py-5 bg-linear-to-r from-gold-dark via-gold to-gold-light text-dark font-display font-bold text-xl rounded-2xl shadow-2xl shadow-gold/30 transition-all uppercase tracking-[0.2em] overflow-hidden border border-gold-light/50"
          >
            {/* Shimmer sweep */}
            <motion.div
              className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ['-200%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5 }}
            />
            {/* Inner glow */}
            <motion.div
              className="absolute inset-0 bg-linear-to-t from-transparent via-white/10 to-transparent"
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="relative z-10 flex items-center gap-3">
              <span>Iniciar</span>
            </span>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Decorative bottom verse - with elegant entrance */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-8 text-gray-game/30 text-sm tracking-wider text-center px-4 z-10 font-display italic"
      >
        Porque donde hay dos o tres congregados en mi nombre, alli estoy yo — Mateo 18:20
      </motion.p>
    </div>
  );
}
