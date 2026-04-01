import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import type { Question } from '../utils/types';
import { DIFFICULTY_LABELS, DIFFICULTY_POINTS } from '../utils/types';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: number | null;
  isRevealed: boolean;
  onSelect: (index: number) => void;
}

const optionLabels = ['A', 'B', 'C', 'D'];

const difficultyColors: Record<string, string> = {
  facil: 'bg-green-500/20 text-green-400 border-green-500/30',
  medio_facil: 'bg-lime-500/20 text-lime-400 border-lime-500/30',
  intermedio: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  medio_dificil: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  dificil: 'bg-red-500/20 text-red-400 border-red-500/30',
};

// Hex diamond shape for option decoration
function HexDiamond({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 14" className={className} fill="currentColor">
      <path d="M12 0L24 7L12 14L0 7Z" />
    </svg>
  );
}

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  isRevealed,
  onSelect,
}: QuestionCardProps) {
  // Typewriter effect for question text
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    const text = question.question;
    let index = 0;
    const speed = Math.max(15, 800 / text.length); // Adaptive speed
    const timer = setInterval(() => {
      index++;
      setDisplayedText(text.slice(0, index));
      if (index >= text.length) {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [question.question]);

  // Reveal scanning state
  const [scanningIndex, setScanningIndex] = useState(-1);
  const [scanComplete, setScanComplete] = useState(false);

  useEffect(() => {
    if (!isRevealed) {
      setScanningIndex(-1);
      setScanComplete(false);
      return;
    }
    // Scan through options dramatically
    let current = 0;
    setScanComplete(false);
    const scanInterval = setInterval(() => {
      setScanningIndex(current);
      if (current === question.correct) {
        clearInterval(scanInterval);
        setTimeout(() => setScanComplete(true), 300);
        return;
      }
      current++;
      if (current > 3) {
        clearInterval(scanInterval);
        setScanComplete(true);
      }
    }, 400);
    return () => clearInterval(scanInterval);
  }, [isRevealed, question.correct]);

  const getOptionStyle = (index: number) => {
    if (!isRevealed) {
      if (selectedAnswer === index) {
        return 'border-gold bg-gold/15 text-gold-light shadow-lg shadow-gold/25 ring-1 ring-gold/30';
      }
      return 'border-white/10 bg-dark-light/60 hover:border-gold/50 hover:bg-gold/8 hover:shadow-lg hover:shadow-gold/10 text-white';
    }

    // During scanning phase
    if (!scanComplete && scanningIndex === index) {
      return 'border-gold bg-gold/20 text-gold-light shadow-lg shadow-gold/30';
    }

    if (scanComplete || scanningIndex >= index) {
      if (index === question.correct) {
        return 'border-correct bg-correct/15 text-correct shadow-xl shadow-correct/25 ring-1 ring-correct/40';
      }
      if (selectedAnswer === index && index !== question.correct) {
        return 'border-incorrect bg-incorrect/15 text-incorrect shadow-lg shadow-incorrect/20';
      }
    }
    return 'border-white/5 bg-dark-light/20 text-gray-game/25';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="w-full max-w-3xl mx-auto"
    >
      {/* Progress dots + Question badge */}
      <div className="bg-dark/70 backdrop-blur-lg rounded-2xl px-5 py-3 mb-4 border border-white/5">
        <div className="flex justify-center gap-2 mb-3">
          {Array.from({ length: totalQuestions }, (_, i) => (
            <motion.div
              key={i}
              className={`h-2 rounded-full transition-all duration-500 ${
                i < questionNumber - 1
                  ? 'w-8 bg-gold shadow-sm shadow-gold/30'
                  : i === questionNumber - 1
                  ? 'w-12 bg-linear-to-r from-gold to-gold-light shadow-md shadow-gold/40'
                  : 'w-4 bg-dark-light border border-white/10'
              }`}
              animate={i === questionNumber - 1 ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center"
        >
          <span className="inline-block bg-gold/10 border border-gold/25 text-gold text-sm font-display font-bold px-5 py-1.5 rounded-full tracking-wider uppercase">
            Pregunta {questionNumber} de {totalQuestions}
          </span>
          {question.difficulty && (
            <span className={`inline-block ml-2 border text-xs font-bold px-3 py-1.5 rounded-full tracking-wider uppercase ${difficultyColors[question.difficulty]}`}>
              {DIFFICULTY_LABELS[question.difficulty]} — {DIFFICULTY_POINTS[question.difficulty]} {DIFFICULTY_POINTS[question.difficulty] === 1 ? 'pt' : 'pts'}
            </span>
          )}
        </motion.div>
      </div>

      {/* Question text - with typewriter effect */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-dark-card/80 backdrop-blur-md border border-gold/20 rounded-2xl p-4 md:p-6 mb-4 md:mb-5 shadow-xl shadow-gold/5 relative overflow-hidden"
      >
        {/* Animated corner accents */}
        <motion.div
          className="absolute top-0 left-0 w-16 h-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-gold/50 to-transparent" />
          <div className="absolute top-0 left-0 w-0.5 h-full bg-linear-to-b from-gold/50 to-transparent" />
        </motion.div>
        <motion.div
          className="absolute bottom-0 right-0 w-16 h-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="absolute bottom-0 right-0 w-full h-0.5 bg-linear-to-l from-gold/50 to-transparent" />
          <div className="absolute bottom-0 right-0 w-0.5 h-full bg-linear-to-t from-gold/50 to-transparent" />
        </motion.div>

        {/* Diamond decorations */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 text-gold/20">
          <HexDiamond className="w-6 h-3" />
        </div>

        <h2 className="text-base md:text-2xl font-bold text-center text-white leading-snug mt-2">
          {displayedText}
          {isTyping && (
            <motion.span
              className="inline-block w-0.5 h-5 md:h-7 bg-gold ml-1 align-middle"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          )}
        </h2>
      </motion.div>

      {/* Options - Who Wants to Be a Millionaire style */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {question.options.map((option, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1, type: 'spring', stiffness: 200 }}
            onClick={() => !isRevealed && selectedAnswer === null && !isTyping && onSelect(index)}
            className={`group relative flex items-center gap-2 md:gap-3 px-3 py-2.5 md:px-4 md:py-3.5 rounded-xl border-2 transition-all duration-300 text-center overflow-hidden ${getOptionStyle(index)}`}
            whileHover={!isRevealed && selectedAnswer === null && !isTyping ? { scale: 1.03, y: -3 } : {}}
            whileTap={!isRevealed && selectedAnswer === null && !isTyping ? { scale: 0.97 } : {}}
            disabled={isRevealed || selectedAnswer !== null || isTyping}
          >
            {/* Option label diamond */}
            <span className={`shrink-0 w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center font-display font-bold text-xs md:text-sm transition-all ${
              selectedAnswer === index && !isRevealed
                ? 'bg-gold text-dark shadow-md shadow-gold/30'
                : isRevealed && scanComplete && index === question.correct
                ? 'bg-correct text-white shadow-md shadow-correct/30'
                : isRevealed && scanComplete && selectedAnswer === index
                ? 'bg-incorrect text-white'
                : 'bg-white/5 border border-white/10 text-gold/80 group-hover:bg-gold/15 group-hover:border-gold/30'
            }`}>
              {optionLabels[index]}
            </span>

            {/* Option text */}
            <span className="text-xs md:text-base font-medium flex-1 text-left">{option}</span>

            {/* Result icons with spring animation */}
            <AnimatePresence>
              {isRevealed && scanComplete && index === question.correct && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                  className="shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full bg-correct flex items-center justify-center shadow-lg shadow-correct/30"
                >
                  <span className="text-white text-lg font-bold">✓</span>
                </motion.div>
              )}
              {isRevealed && scanComplete && selectedAnswer === index && index !== question.correct && (
                <motion.div
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                  className="shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full bg-incorrect flex items-center justify-center"
                >
                  <span className="text-white text-lg font-bold">✗</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hover spotlight effect */}
            {!isRevealed && selectedAnswer === null && !isTyping && (
              <motion.div
                className="absolute inset-0 rounded-xl bg-linear-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            )}

            {/* Selected pulse ring */}
            {selectedAnswer === index && !isRevealed && (
              <motion.div
                className="absolute inset-0 rounded-xl border-2 border-gold/50"
                animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.02, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
            )}

            {/* Scanning highlight sweep */}
            {isRevealed && !scanComplete && scanningIndex === index && (
              <motion.div
                className="absolute inset-0 rounded-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.3, 0] }}
                transition={{ duration: 0.4 }}
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(219,163,71,0.3) 50%, transparent 100%)',
                }}
              />
            )}

            {/* Correct answer celebration particles */}
            {isRevealed && scanComplete && index === question.correct && (
              <>
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={`spark-${i}`}
                    className="absolute w-1 h-1 rounded-full bg-correct"
                    style={{ left: '50%', top: '50%' }}
                    initial={{ scale: 0 }}
                    animate={{
                      x: Math.cos((i / 6) * Math.PI * 2) * 60,
                      y: Math.sin((i / 6) * Math.PI * 2) * 30,
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  />
                ))}
              </>
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
