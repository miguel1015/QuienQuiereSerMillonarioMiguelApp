import { motion } from 'framer-motion';
import type { Participant } from '../utils/types';

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
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="relative flex items-center justify-between bg-dark-card/80 backdrop-blur-sm border-2 border-gold/20 rounded-2xl px-3 py-3 md:px-6 md:py-4 max-w-3xl mx-auto overflow-hidden"
    >
      {/* Background accent */}
      <div className={`absolute inset-0 opacity-5 ${
        isGroupA ? 'bg-gradient-to-r from-blue-500 to-transparent' : 'bg-gradient-to-r from-purple-500 to-transparent'
      }`} />

      <div className="relative flex items-center gap-2 md:gap-4 min-w-0">
        {/* Group badge */}
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl shrink-0 flex items-center justify-center font-extrabold text-base md:text-xl shadow-lg ${
            isGroupA
              ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-blue-500/30'
              : 'bg-gradient-to-br from-purple-500 to-purple-700 text-white shadow-purple-500/30'
          }`}
        >
          {participant.group}
        </motion.div>
        <div className="min-w-0">
          <p className="text-white font-extrabold text-base md:text-2xl truncate">{participant.name}</p>
          <p className={`text-xs md:text-sm font-semibold ${isGroupA ? 'text-blue-400' : 'text-purple-400'}`}>
            Grupo {participant.group}
          </p>
        </div>
      </div>

      <div className="relative flex items-center gap-3 md:gap-6 shrink-0">
        {/* Score */}
        <div className="text-center">
          <p className="text-gray-game text-[10px] uppercase tracking-widest font-semibold hidden md:block">Puntaje</p>
          <motion.p
            key={participant.score}
            initial={{ scale: 1.5, color: '#f0c96e' }}
            animate={{ scale: 1, color: '#dba347' }}
            className="text-gold font-extrabold text-xl md:text-3xl tabular-nums"
          >
            {participant.score}
          </motion.p>
        </div>

        {/* Divider */}
        <div className="w-px h-8 md:h-10 bg-gold/20" />

        {/* Round */}
        <div className="text-center">
          <p className="text-gray-game text-[10px] uppercase tracking-widest font-semibold hidden md:block">Ronda</p>
          <p className="text-white font-extrabold text-xl md:text-3xl tabular-nums">
            {questionIndex + 1}
            <span className="text-gray-game text-sm md:text-lg">/{totalQuestions}</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
