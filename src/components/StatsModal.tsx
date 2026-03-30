import { motion, AnimatePresence } from 'framer-motion';
import type { Participant } from '../utils/types';

interface StatsModalProps {
  show: boolean;
  participants: Participant[];
  currentParticipant: Participant;
  onClose: () => void;
}

export default function StatsModal({
  show,
  participants,
  currentParticipant,
  onClose,
}: StatsModalProps) {
  const sortedParticipants = [...participants]
    .filter((p) => p.questionsAnswered > 0)
    .sort((a, b) => b.score - a.score);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

          <motion.div
            initial={{ scale: 0.7, y: 60, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className="relative z-10 bg-dark-card border-2 border-gold/30 rounded-3xl p-4 md:p-8 mx-4 max-w-lg w-full shadow-2xl shadow-gold/10"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-5xl text-center mb-4"
            >
              📊
            </motion.div>
            <h3 className="text-gold font-extrabold text-2xl text-center mb-6 tracking-wide">
              Tabla de posiciones
            </h3>

            {/* Current participant highlight */}
            <div className="bg-gold/10 border border-gold/30 rounded-xl p-4 mb-5">
              <p className="text-gold text-xs uppercase tracking-widest mb-1">Jugador actual</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                    currentParticipant.group === 'A' ? 'bg-blue-500/30 text-blue-400 border border-blue-500/50' : 'bg-purple-500/30 text-purple-400 border border-purple-500/50'
                  }`}>
                    {currentParticipant.group}
                  </div>
                  <span className="text-white font-bold text-base md:text-lg truncate">{currentParticipant.name}</span>
                </div>
                <div className="flex items-center gap-3 md:gap-4 shrink-0">
                  <div className="text-center">
                    <p className="text-gray-game text-[10px] uppercase">Aciertos</p>
                    <p className="text-gold text-lg md:text-2xl font-extrabold">{currentParticipant.score}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-game text-[10px] uppercase">Respondidas</p>
                    <p className="text-white text-lg md:text-2xl font-extrabold">{currentParticipant.questionsAnswered}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* All participants */}
            {sortedParticipants.length > 0 && (
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {sortedParticipants.map((p, i) => {
                  const avg = p.questionsAnswered > 0
                    ? (p.totalTime / p.questionsAnswered).toFixed(1)
                    : '-';
                  const isCurrent = p.name === currentParticipant.name && p.group === currentParticipant.group;
                  return (
                    <motion.div
                      key={`${p.name}-${p.group}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                        isCurrent ? 'bg-gold/10 border border-gold/20' : 'bg-dark-light/50'
                      }`}
                    >
                      <span className="text-gray-game font-bold w-5 text-sm">
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
                      </span>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        p.group === 'A' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                      }`}>
                        {p.group}
                      </div>
                      <span className={`flex-1 font-semibold truncate ${isCurrent ? 'text-gold' : 'text-white'}`}>
                        {p.name}
                      </span>
                      <span className="text-gold font-bold">{p.score}/{p.questionsAnswered}</span>
                      <span className="text-gray-game text-xs w-12 text-right">{avg}s</span>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {sortedParticipants.length === 0 && (
              <p className="text-gray-game text-center text-sm">Aún no hay datos de otros participantes.</p>
            )}

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
              className="mt-6 w-full py-2.5 bg-gold/15 border border-gold/40 rounded-xl text-gold font-semibold text-sm hover:bg-gold/25 transition-colors"
            >
              Cerrar
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
