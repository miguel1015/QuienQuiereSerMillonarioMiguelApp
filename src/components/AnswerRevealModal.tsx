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
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Radial glow behind modal */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute w-[600px] h-[600px] rounded-full"
            style={{
              background: isCorrect
                ? 'radial-gradient(circle, rgba(39,174,96,0.2) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(231,76,60,0.2) 0%, transparent 70%)',
            }}
          />

          {/* Modal content */}
          <motion.div
            initial={{ scale: 0.5, y: 60, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="relative z-10 w-full max-w-lg mx-4"
          >
            {/* Big icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.15 }}
              className="text-center mb-6"
            >
              <span className="text-6xl md:text-9xl drop-shadow-2xl inline-block">
                {isTimeout ? '⏰' : isCorrect ? '🎉' : '😢'}
              </span>
            </motion.div>

            {/* Result text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-center mb-6"
            >
              <h2
                className={`text-2xl md:text-5xl font-extrabold mb-2 ${
                  isTimeout
                    ? 'text-gold'
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

            {/* Correct answer card */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.35 }}
              className={`rounded-2xl border-2 p-4 md:p-6 mb-4 md:mb-6 ${
                isCorrect
                  ? 'bg-correct/10 border-correct/40'
                  : 'bg-dark-card border-gold/30'
              }`}
            >
              <p className="text-gray-game text-sm uppercase tracking-wider mb-2 text-center">
                Respuesta correcta
              </p>
              <p className="text-lg md:text-3xl font-bold text-white text-center mb-4">
                {question.options[question.correct]}
              </p>

              {/* Divider */}
              <div className="w-16 h-0.5 bg-gold/30 mx-auto mb-4" />

              {/* Explanation */}
              <p className="text-gray-game text-sm md:text-base leading-relaxed text-center mb-3">
                {question.explanation}
              </p>

              {/* Verse */}
              <div className="flex items-center justify-center gap-2 bg-gold/10 rounded-xl px-4 py-2.5">
                <span className="text-gold text-lg">📖</span>
                <span className="text-gold font-semibold text-base">
                  {question.verse}
                </span>
              </div>
            </motion.div>

            {/* Floating particles for correct answers */}
            {isCorrect &&
              Array.from({ length: 20 }, (_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: Math.random() * 6 + 3,
                    height: Math.random() * 6 + 3,
                    backgroundColor:
                      i % 3 === 0 ? '#27ae60' : i % 3 === 1 ? '#dba347' : '#f0c96e',
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                    y: [0, -(Math.random() * 100 + 50)],
                    x: [(Math.random() - 0.5) * 80],
                  }}
                  transition={{
                    duration: Math.random() * 1.5 + 1,
                    delay: Math.random() * 0.5 + 0.2,
                    repeat: Infinity,
                    repeatDelay: Math.random() * 2,
                  }}
                />
              ))}

            {/* Buttons row */}
            <div className="flex flex-col md:flex-row gap-2 md:gap-3">

            {/* Statistics button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onShowStats}
              className="py-2.5 md:py-3 px-4 bg-dark-light/80 border border-gold/30 rounded-xl text-gold font-semibold text-sm hover:bg-gold/10 transition-colors text-center"
            >
              📊 Estadísticas
            </motion.button>

            {/* Next button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 0 50px rgba(219, 163, 71, 0.5)',
              }}
              whileTap={{ scale: 0.95 }}
              onClick={onNext}
              className="w-full py-3 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-dark font-semibold text-base rounded-xl shadow-lg shadow-gold/30 uppercase tracking-wider"
            >
              {nextLabel}
            </motion.button>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
