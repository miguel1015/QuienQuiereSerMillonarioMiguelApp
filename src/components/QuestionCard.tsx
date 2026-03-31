import { motion } from 'framer-motion';
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

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  isRevealed,
  onSelect,
}: QuestionCardProps) {
  const getOptionStyle = (index: number) => {
    if (!isRevealed) {
      if (selectedAnswer === index) {
        return 'border-gold bg-gold/20 text-gold-light shadow-lg shadow-gold/20';
      }
      return 'border-gray-game/20 bg-dark-light/60 hover:border-gold/60 hover:bg-gold/10 hover:shadow-lg hover:shadow-gold/10 text-white';
    }
    if (index === question.correct) {
      return 'border-correct bg-correct/15 text-correct shadow-lg shadow-correct/20';
    }
    if (selectedAnswer === index && index !== question.correct) {
      return 'border-incorrect bg-incorrect/15 text-incorrect shadow-lg shadow-incorrect/20';
    }
    return 'border-gray-game/10 bg-dark-light/20 text-gray-game/30';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="w-full max-w-3xl mx-auto"
    >
      {/* Progress dots */}
      <div className="flex justify-center gap-2 mb-4">
        {Array.from({ length: totalQuestions }, (_, i) => (
          <motion.div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i < questionNumber - 1
                ? 'w-8 bg-gold'
                : i === questionNumber - 1
                ? 'w-10 bg-gradient-to-r from-gold to-gold-light'
                : 'w-4 bg-dark-light border border-gray-game/20'
            }`}
            animate={i === questionNumber - 1 ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        ))}
      </div>

      {/* Question badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-4"
      >
        <span className="inline-block bg-gold/15 border border-gold/30 text-gold text-sm font-bold px-4 py-1.5 rounded-full tracking-wider uppercase">
          Pregunta {questionNumber} de {totalQuestions}
        </span>
        {question.difficulty && (
          <span className={`inline-block ml-2 border text-xs font-bold px-3 py-1.5 rounded-full tracking-wider uppercase ${difficultyColors[question.difficulty]}`}>
            {DIFFICULTY_LABELS[question.difficulty]} — {DIFFICULTY_POINTS[question.difficulty]} {DIFFICULTY_POINTS[question.difficulty] === 1 ? 'pt' : 'pts'}
          </span>
        )}
      </motion.div>

      {/* Question text - bigger and bolder */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-dark-card/80 backdrop-blur-sm border border-gold/25 rounded-2xl p-4 md:p-6 mb-4 md:mb-5 shadow-lg shadow-gold/5 relative overflow-hidden"
      >
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-gold/30 rounded-tl-3xl" />
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-gold/30 rounded-br-3xl" />

        <h2 className="text-base md:text-2xl font-bold text-center text-white leading-snug">
          {question.question}
        </h2>
      </motion.div>

      {/* Options - bigger, more visual */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {question.options.map((option, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.08 }}
            onClick={() => !isRevealed && selectedAnswer === null && onSelect(index)}
            className={`group relative flex items-center justify-center gap-2 md:gap-3 px-3 py-2.5 md:px-4 md:py-3.5 rounded-xl border-2 transition-all duration-300 text-center ${getOptionStyle(index)}`}
            whileHover={!isRevealed && selectedAnswer === null ? { scale: 1.03, y: -2 } : {}}
            whileTap={!isRevealed && selectedAnswer === null ? { scale: 0.97 } : {}}
            disabled={isRevealed || selectedAnswer !== null}
          >
            {/* Option label */}
            <span className={`shrink-0 w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center font-bold text-xs md:text-sm transition-all ${
              selectedAnswer === index && !isRevealed
                ? 'bg-gold text-dark'
                : isRevealed && index === question.correct
                ? 'bg-correct text-white'
                : isRevealed && selectedAnswer === index
                ? 'bg-incorrect text-white'
                : 'bg-gold/15 border border-gold/30 text-gold group-hover:bg-gold/25'
            }`}>
              {optionLabels[index]}
            </span>

            {/* Option text */}
            <span className="text-xs md:text-base font-medium flex-1">{option}</span>

            {/* Result icons */}
            {isRevealed && index === question.correct && (
              <motion.div
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 500 }}
                className="shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full bg-correct flex items-center justify-center"
              >
                <span className="text-white text-xl font-bold">✓</span>
              </motion.div>
            )}
            {isRevealed && selectedAnswer === index && index !== question.correct && (
              <motion.div
                initial={{ scale: 0, rotate: 90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 500 }}
                className="shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full bg-incorrect flex items-center justify-center"
              >
                <span className="text-white text-xl font-bold">✗</span>
              </motion.div>
            )}

            {/* Hover shine effect */}
            {!isRevealed && selectedAnswer === null && (
              <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
              />
            )}

            {/* Selected pulse */}
            {selectedAnswer === index && !isRevealed && (
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-gold/40"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
