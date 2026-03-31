import { motion } from 'framer-motion';
import AnimatedBackground from '../components/AnimatedBackground';
import logo from '../assets/images/¿Quién quiere ser millonario_ edición cristiana.png';

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
        className="flex flex-col items-center justify-center z-10 px-4"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, type: 'spring' }}
          className="relative inline-block mb-6"
        >
          <img src={logo} alt="¿Quién Quiere Ser Millonario? Edición Cristiana" className="w-[90vw] h-[70vh] md:w-[70vw] md:h-[75vh] object-contain relative z-10 drop-shadow-2xl" />
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ filter: 'blur(50px)', background: 'rgba(219,163,71,0.25)' }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
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
          className="relative px-10 py-4 bg-linear-to-r from-gold-dark via-gold to-gold-light text-dark font-semibold text-lg rounded-xl shadow-lg shadow-gold/25 transition-all uppercase tracking-wider overflow-hidden"
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
