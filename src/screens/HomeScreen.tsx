import { motion } from 'framer-motion';
import AnimatedBackground from '../components/AnimatedBackground';

interface HomeScreenProps {
  onStart: () => void;
}

export default function HomeScreen({ onStart }: HomeScreenProps) {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center relative overflow-hidden">
      <AnimatedBackground variant="default" />

      {/* Light rays from center */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 8 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 w-1 origin-bottom"
            style={{
              height: '120vh',
              transform: `rotate(${i * 45}deg)`,
              background: 'linear-gradient(to top, rgba(219,163,71,0.03) 0%, transparent 60%)',
            }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center z-10 px-4"
      >
        {/* Crown icon with glow */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.3, type: 'spring' }}
          className="relative inline-block mb-8"
        >
          <span className="text-8xl md:text-9xl relative z-10 inline-block drop-shadow-2xl">👑</span>
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ filter: 'blur(40px)', background: 'rgba(219,163,71,0.3)' }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        {/* Title with stagger */}
        <div className="mb-2">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-3xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-gold-dark via-gold to-gold-light leading-tight"
          >
            ¿Quién Quiere Ser
          </motion.h1>
        </div>
        <motion.h1
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.6, type: 'spring' }}
          className="text-4xl md:text-7xl lg:text-8xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-gold via-gold-light to-gold mb-6"
        >
          Millonario?
        </motion.h1>

        {/* Subtitle card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.9, type: 'spring' }}
          className="mb-14"
        >
          <div className="inline-block bg-dark-card/80 backdrop-blur-sm border-2 border-gold/30 rounded-2xl px-5 py-3 md:px-8 md:py-4 shadow-xl shadow-gold/10">
            <p className="text-gold text-base md:text-2xl font-bold tracking-wide">
              Versión Camino Suroccidente
            </p>
            <div className="w-16 h-0.5 bg-gold/40 mx-auto my-2" />
            <p className="text-gray-game text-base">Edición Cristiana</p>
          </div>
        </motion.div>

        {/* Start button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, type: 'spring', stiffness: 200 }}
          whileHover={{
            scale: 1.1,
            boxShadow: '0 0 60px rgba(219, 163, 71, 0.5)',
          }}
          whileTap={{ scale: 0.92 }}
          onClick={onStart}
          className="relative px-8 py-3 bg-linear-to-r from-gold-dark via-gold to-gold-light text-dark font-semibold text-base rounded-xl shadow-lg shadow-gold/25 transition-all uppercase tracking-wider overflow-hidden"
        >
          {/* Button shimmer */}
          <motion.div
            className="absolute inset-0 bg-linear-to-r from-transparent via-white/25 to-transparent"
            animate={{ x: ['-200%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          />
          <span className="relative z-10">Iniciar</span>
        </motion.button>
      </motion.div>

      {/* Decorative bottom verse */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 text-gray-game/40 text-sm tracking-wider text-center px-4 z-10"
      >
        ✝ Porque donde hay dos o tres congregados en mi nombre, allí estoy yo — Mateo 18:20
      </motion.p>
    </div>
  );
}
