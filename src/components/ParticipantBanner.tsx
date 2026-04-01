import { motion } from 'framer-motion';
import type { Participant } from '../utils/types';
import { MAX_ROUND_SCORE } from '../utils/types';

interface ParticipantBannerProps {
  participant: Participant;
  questionIndex: number;
  totalQuestions: number;
}

export default function ParticipantBanner({ participant, questionIndex, totalQuestions }: ParticipantBannerProps) {
  const isGroupA = participant.group === 'A';

  return (
    <motion.div
      key={participant.name + participant.group}
      initial={{ opacity: 0, y: -25, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="relative flex items-center justify-between bg-dark-card/80 backdrop-blur-lg border-2 border-gold/15 rounded-2xl px-3 py-3 md:px-6 md:py-4 max-w-3xl mx-auto overflow-hidden"
    >
      {/* Background accent gradient */}
      <div className={`absolute inset-0 opacity-[0.04] ${
        isGroupA ? 'bg-linear-to-r from-blue-500 to-transparent' : 'bg-linear-to-r from-purple-500 to-transparent'
      }`} />

      {/* Subtle animated shimmer */}
      <motion.div
        className="absolute inset-0 bg-linear-to-r from-transparent via-white/2 to-transparent"
        animate={{ x: ['-200%', '200%'] }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      <div className="relative flex items-center gap-2 md:gap-4 min-w-0">
        {/* Participant image / Group badge */}
        <motion.div
          className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl shrink-0 overflow-hidden flex items-center justify-center font-display font-bold text-base md:text-xl shadow-lg ${
            !participant.image
              ? isGroupA
                ? 'bg-linear-to-br from-blue-500 to-blue-700 text-white shadow-blue-500/30'
                : 'bg-linear-to-br from-purple-500 to-purple-700 text-white shadow-purple-500/30'
              : isGroupA
                ? 'ring-2 ring-blue-500/60 shadow-blue-500/20'
                : 'ring-2 ring-purple-500/60 shadow-purple-500/20'
          }`}
        >
          {participant.image ? (
            <img src={participant.image} alt={participant.name} className="w-full h-full object-cover" />
          ) : (
            participant.group
          )}
        </motion.div>
        <div className="min-w-0">
          <p className="text-white font-bold text-base md:text-2xl truncate">{participant.name}</p>
          <p className={`text-xs md:text-sm font-semibold ${isGroupA ? 'text-blue-400' : 'text-purple-400'}`}>
            Grupo {participant.group}
          </p>
        </div>
      </div>

      <div className="relative flex items-center gap-3 md:gap-6 shrink-0">
        {/* Score with animated counter */}
        <div className="text-center">
          <p className="text-gray-game text-[10px] uppercase tracking-widest font-semibold hidden md:block">Puntaje</p>
          <motion.p
            key={participant.score}
            initial={{ scale: 1.8, color: '#f0c96e' }}
            animate={{ scale: 1, color: '#dba347' }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            className="text-gold font-display font-bold text-xl md:text-3xl tabular-nums"
          >
            {participant.score}
            <span className="text-gray-game text-sm md:text-lg font-body">/{MAX_ROUND_SCORE}</span>
          </motion.p>
        </div>

        {/* Divider */}
        <div className="w-px h-8 md:h-10 bg-gold/15" />

        {/* Round */}
        <div className="text-center">
          <p className="text-gray-game text-[10px] uppercase tracking-widest font-semibold hidden md:block">Ronda</p>
          <p className="text-white font-display font-bold text-xl md:text-3xl tabular-nums">
            {questionIndex + 1}
            <span className="text-gray-game text-sm md:text-lg font-body">/{totalQuestions}</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
