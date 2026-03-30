import { useEffect } from 'react';
import { motion } from 'framer-motion';
import AnimatedBackground from '../components/AnimatedBackground';
import type { Participant } from '../utils/types';
import type { SoundType } from '../hooks/useSound';

interface ResultsScreenProps {
  participants: Participant[];
  onRestart: () => void;
  playSound: (sound: SoundType) => void;
}

export default function ResultsScreen({ participants, onRestart, playSound }: ResultsScreenProps) {
  useEffect(() => {
    playSound('celebration');
  }, []);
  const sorted = [...participants].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.totalTime - b.totalTime;
  });

  const groupATotal = participants.filter((p) => p.group === 'A').reduce((s, p) => s + p.score, 0);
  const groupBTotal = participants.filter((p) => p.group === 'B').reduce((s, p) => s + p.score, 0);
  const winnerGroup = groupATotal > groupBTotal ? 'A' : groupBTotal > groupATotal ? 'B' : null;

  const getMedal = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}`;
  };

  return (
    <div className="h-screen w-screen relative overflow-hidden">
      <AnimatedBackground variant="celebration" />

      <div className="relative z-10 h-full flex flex-col items-center px-4 py-6 overflow-y-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="relative inline-block mb-4"
          >
            <span className="text-7xl md:text-8xl drop-shadow-2xl inline-block">🏆</span>
            <motion.div
              className="absolute inset-0"
              style={{ filter: 'blur(30px)', background: 'rgba(219,163,71,0.4)' }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-gold-dark via-gold to-gold-light mb-2">
            Resultados Finales
          </h1>
        </motion.div>

        {/* Group scores */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="flex gap-4 md:gap-10 mb-6 md:mb-8 items-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`text-center bg-dark-card/80 backdrop-blur-sm border-2 ${
              winnerGroup === 'A' ? 'border-gold shadow-xl shadow-gold/20' : 'border-blue-500/30'
            } rounded-2xl md:rounded-3xl px-6 py-4 md:px-10 md:py-6`}
          >
            <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-extrabold text-lg md:text-2xl mx-auto mb-2 shadow-lg shadow-blue-500/30">
              A
            </div>
            <p className={`text-3xl md:text-5xl font-extrabold ${winnerGroup === 'A' ? 'text-gold' : 'text-white'}`}>
              {groupATotal}
            </p>
            {winnerGroup === 'A' && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-gold text-sm font-bold mt-2 uppercase tracking-wider"
              >
                🏆 Ganador
              </motion.p>
            )}
          </motion.div>

          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="text-gold/50 text-4xl font-extrabold"
          >
            VS
          </motion.span>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`text-center bg-dark-card/80 backdrop-blur-sm border-2 ${
              winnerGroup === 'B' ? 'border-gold shadow-xl shadow-gold/20' : 'border-purple-500/30'
            } rounded-2xl md:rounded-3xl px-6 py-4 md:px-10 md:py-6`}
          >
            <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-linear-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-extrabold text-lg md:text-2xl mx-auto mb-2 shadow-lg shadow-purple-500/30">
              B
            </div>
            <p className={`text-3xl md:text-5xl font-extrabold ${winnerGroup === 'B' ? 'text-gold' : 'text-white'}`}>
              {groupBTotal}
            </p>
            {winnerGroup === 'B' && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-gold text-sm font-bold mt-2 uppercase tracking-wider"
              >
                🏆 Ganador
              </motion.p>
            )}
          </motion.div>
        </motion.div>

        {/* Ranking table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="w-full max-w-2xl"
        >
          <h2 className="text-xl font-extrabold text-gold mb-4 text-center uppercase tracking-[0.15em]">
            Ranking Individual
          </h2>
          <div className="bg-dark-card/80 backdrop-blur-sm border-2 border-gold/20 rounded-3xl overflow-hidden shadow-xl">
            {/* Header */}
            <div className="grid grid-cols-12 gap-1 md:gap-2 px-3 md:px-5 py-2.5 md:py-3 bg-gold/10 border-b border-gold/20 text-gold text-[10px] md:text-xs font-bold uppercase tracking-wider">
              <div className="col-span-1">#</div>
              <div className="col-span-4">Nombre</div>
              <div className="col-span-2 text-center">Grupo</div>
              <div className="col-span-2 text-center">Puntos</div>
              <div className="col-span-3 text-center">T. Prom.</div>
            </div>

            {/* Rows */}
            {sorted.map((participant, index) => {
              const avgTime = participant.questionsAnswered > 0
                ? (participant.totalTime / participant.questionsAnswered).toFixed(1)
                : '0.0';
              const isFirst = index === 0;

              return (
                <motion.div
                  key={`${participant.name}-${participant.group}`}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1, type: 'spring' }}
                  className={`grid grid-cols-12 gap-1 md:gap-2 px-3 md:px-5 py-3 md:py-4 items-center border-b border-gray-game/10 last:border-b-0 ${
                    isFirst ? 'bg-gold/8' : ''
                  }`}
                >
                  <div className="col-span-1">
                    <span className={`text-lg ${isFirst ? '' : 'text-gray-game'}`}>{getMedal(index)}</span>
                  </div>
                  <div className={`col-span-4 font-bold truncate text-sm md:text-base ${isFirst ? 'text-gold' : 'text-white'}`}>
                    {participant.name}
                  </div>
                  <div className="col-span-2 text-center">
                    <span className={`inline-flex w-6 h-6 md:w-8 md:h-8 items-center justify-center rounded-md md:rounded-lg text-[10px] md:text-xs font-bold ${
                      participant.group === 'A'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-purple-500/20 text-purple-400'
                    }`}>
                      {participant.group}
                    </span>
                  </div>
                  <div className={`col-span-2 text-center font-extrabold text-base md:text-xl ${isFirst ? 'text-gold' : 'text-white'}`}>
                    {participant.score}/5
                  </div>
                  <div className="col-span-3 text-center text-gray-game font-semibold text-sm md:text-base">
                    {avgTime}s
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Restart button */}
        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          whileHover={{ scale: 1.08, boxShadow: '0 0 60px rgba(219, 163, 71, 0.5)' }}
          whileTap={{ scale: 0.92 }}
          onClick={onRestart}
          className="relative mt-8 mb-6 px-8 py-3 bg-linear-to-r from-gold-dark via-gold to-gold-light text-dark font-semibold text-base rounded-xl shadow-lg shadow-gold/30 uppercase tracking-wider overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 bg-linear-to-r from-transparent via-white/25 to-transparent"
            animate={{ x: ['-200%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          />
          <span className="relative z-10">Jugar de nuevo</span>
        </motion.button>

        {/* Footer verse */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-gray-game/40 text-sm text-center mb-6"
        >
          ✝ Porque la palabra de Dios es viva y eficaz — Hebreos 4:12
        </motion.p>
      </div>
    </div>
  );
}
