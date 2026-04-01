import { motion, AnimatePresence } from 'framer-motion';
import type { Question } from '../utils/types';

interface AnswerRevealModalProps {
  show: boolean;
  question: Question;
  selectedAnswer: number | null;
  onNext: () => void;
  onShowStats: () => void;
  nextLabel: string;
}

// Pre-computed burst particles
const burstParticles = Array.from({ length: 30 }, (_, i) => {
  const angle = (i / 30) * Math.PI * 2;
  const distance = 80 + Math.random() * 180;
  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
    size: Math.random() * 6 + 3,
    delay: Math.random() * 0.3,
    duration: 0.8 + Math.random() * 0.6,
    rotation: Math.random() * 360,
  };
});

export default function AnswerRevealModal({
  show,
  question,
  selectedAnswer,
  onNext,
  onShowStats,
  nextLabel,
}: AnswerRevealModalProps) {
  const isCorrect = selectedAnswer === question.correct;
  const isTimeout = selectedAnswer === null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 flex items-center justify-center"
        >
          {/* Backdrop with heavy blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/75 backdrop-blur-lg"
          />

          {/* Radial light burst */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 2.5], opacity: [0.8, 0] }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute w-125 h-125 rounded-full"
            style={{
              background: isCorrect
                ? 'radial-gradient(circle, rgba(39,174,96,0.4) 0%, rgba(39,174,96,0.1) 40%, transparent 70%)'
                : isTimeout
                ? 'radial-gradient(circle, rgba(219,163,71,0.3) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(231,76,60,0.4) 0%, rgba(231,76,60,0.1) 40%, transparent 70%)',
            }}
          />

          {/* Secondary persistent glow */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, opacity: [0.5, 0.8, 0.5] }}
            transition={{ scale: { duration: 0.5 }, opacity: { duration: 3, repeat: Infinity } }}
            className="absolute w-150 h-150 rounded-full"
            style={{
              background: isCorrect
                ? 'radial-gradient(circle, rgba(39,174,96,0.15) 0%, transparent 60%)'
                : 'radial-gradient(circle, rgba(231,76,60,0.1) 0%, transparent 60%)',
            }}
          />

          {/* Modal content */}
          <motion.div
            initial={{ scale: 0.3, y: 80, opacity: 0, rotateX: 20 }}
            animate={{ scale: 1, y: 0, opacity: 1, rotateX: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 250, damping: 18 }}
            className="relative z-10 w-full max-w-lg mx-4"
          >
            {/* Big icon with dramatic entrance */}
            <motion.div
              initial={{ scale: 0, rotate: -360 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 12, delay: 0.15 }}
              className="text-center mb-5"
            >
              <span className="text-7xl md:text-9xl drop-shadow-2xl inline-block">
                {isTimeout ? '⏰' : isCorrect ? '🎉' : '😢'}
              </span>

              {/* Burst particles around icon */}
              {isCorrect && burstParticles.map((p, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: p.size,
                    height: p.size,
                    left: '50%',
                    top: '50%',
                    backgroundColor: i % 3 === 0 ? '#27ae60' : i % 3 === 1 ? '#dba347' : '#f0c96e',
                  }}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{
                    x: p.x,
                    y: p.y,
                    opacity: 0,
                    scale: 0,
                    rotate: p.rotation,
                  }}
                  transition={{
                    duration: p.duration,
                    delay: 0.2 + p.delay,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </motion.div>

            {/* Result text */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-center mb-5"
            >
              <h2
                className={`text-3xl md:text-5xl font-display font-bold mb-2 ${
                  isTimeout
                    ? 'text-metallic'
                    : isCorrect
                    ? 'text-correct'
                    : 'text-incorrect'
                }`}
              >
                {isTimeout
                  ? 'Tiempo agotado'
                  : isCorrect
                  ? '¡Correcto!'
                  : '¡Incorrecto!'}
              </h2>
              {!isCorrect && !isTimeout && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-game text-lg"
                >
                  Tu respuesta:{' '}
                  <span className="text-incorrect font-semibold">
                    {question.options[selectedAnswer!]}
                  </span>
                </motion.p>
              )}
            </motion.div>

            {/* Correct answer card - premium glass look */}
            <motion.div
              initial={{ opacity: 0, y: 25, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.35, type: 'spring', stiffness: 200 }}
              className={`rounded-2xl border-2 p-4 md:p-6 mb-4 md:mb-5 backdrop-blur-md relative overflow-hidden ${
                isCorrect
                  ? 'bg-correct/10 border-correct/40'
                  : 'bg-dark-card/90 border-gold/25'
              }`}
            >
              {/* Shimmer effect on correct */}
              {isCorrect && (
                <motion.div
                  className="absolute inset-0 bg-linear-to-r from-transparent via-correct/10 to-transparent"
                  animate={{ x: ['-200%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                />
              )}

              <p className="text-gray-game text-sm uppercase tracking-widest mb-2 text-center font-display">
                Respuesta correcta
              </p>
              <p className="text-lg md:text-3xl font-bold text-white text-center mb-4">
                {question.options[question.correct]}
              </p>

              {/* Elegant divider */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-px flex-1 max-w-16 bg-linear-to-r from-transparent to-gold/30" />
                <div className="w-1.5 h-1.5 rounded-full bg-gold/40" />
                <div className="h-px flex-1 max-w-16 bg-linear-to-l from-transparent to-gold/30" />
              </div>

              {/* Explanation */}
              <p className="text-gray-game text-sm md:text-base leading-relaxed text-center mb-3">
                {question.explanation}
              </p>

              {/* Verse - premium styling */}
              <div className="flex items-center justify-center gap-2 bg-gold/8 border border-gold/15 rounded-xl px-4 py-2.5">
                <span className="text-gold text-lg">📖</span>
                <span className="text-gold font-display font-semibold text-base">
                  {question.verse}
                </span>
              </div>
            </motion.div>

            {/* Buttons row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col md:flex-row gap-2 md:gap-3"
            >
              {/* Statistics button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onShowStats}
                className="py-2.5 md:py-3 px-4 bg-dark-light/80 border border-gold/25 rounded-xl text-gold font-semibold text-sm hover:bg-gold/10 transition-all backdrop-blur-sm text-center"
              >
                📊 Estadísticas
              </motion.button>

              {/* Next button - premium */}
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 0 60px rgba(219, 163, 71, 0.5)',
                }}
                whileTap={{ scale: 0.95 }}
                onClick={onNext}
                className="relative w-full py-3 bg-linear-to-r from-gold-dark via-gold to-gold-light text-dark font-display font-bold text-base rounded-xl shadow-lg shadow-gold/30 uppercase tracking-wider overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-linear-to-r from-transparent via-white/25 to-transparent"
                  animate={{ x: ['-200%', '200%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                />
                <span className="relative z-10">{nextLabel}</span>
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
