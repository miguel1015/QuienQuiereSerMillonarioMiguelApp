import { useEffect } from 'react';
import { motion } from 'framer-motion';
import AnimatedBackground from '../components/AnimatedBackground';
import type { Participant, Round } from '../utils/types';
import { MAX_ROUND_SCORE } from '../utils/types';
import type { SoundType } from '../hooks/useSound';

interface ResultsScreenProps {
  participants: Participant[];
  round: Round;
  onStartFinal: (finalistA: string, finalistB: string) => void;
  onRestart: () => void;
  playSound: (sound: SoundType) => void;
}

export default function ResultsScreen({ participants, round, onStartFinal, onRestart, playSound }: ResultsScreenProps) {
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

  const isEliminatorias = round === 'eliminatorias';

  // Best player from each group (for final qualification)
  const bestA = [...participants].filter((p) => p.group === 'A').sort((a, b) => b.score !== a.score ? b.score - a.score : a.totalTime - b.totalTime)[0];
  const bestB = [...participants].filter((p) => p.group === 'B').sort((a, b) => b.score !== a.score ? b.score - a.score : a.totalTime - b.totalTime)[0];

  const getMedal = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}`;
  };

  const groupACount = participants.filter((p) => p.group === 'A').length;
  const groupBCount = participants.filter((p) => p.group === 'B').length;
  const groupAMax = groupACount * MAX_ROUND_SCORE;
  const groupBMax = groupBCount * MAX_ROUND_SCORE;

  // Final: the overall winner
  const finalWinner = !isEliminatorias ? sorted[0] : null;

  const handleStartFinal = () => {
    if (bestA && bestB) {
      onStartFinal(bestA.name, bestB.name);
    }
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
            {isEliminatorias ? 'Resultados Eliminatorias' : 'Resultados de la Gran Final'}
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
            <p className="text-gray-game text-xs mt-1">/ {groupAMax} pts</p>
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
            <p className="text-gray-game text-xs mt-1">/ {groupBMax} pts</p>
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

        {/* Eliminatorias: Finalists banner */}
        {isEliminatorias && bestA && bestB && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="w-full max-w-2xl mb-6"
          >
            <div className="bg-dark-card/80 backdrop-blur-sm border-2 border-gold/30 rounded-2xl px-6 py-4 text-center">
              <h3 className="text-gold font-bold text-sm uppercase tracking-wider mb-3">
                Clasificados a la Gran Final
              </h3>
              <div className="flex justify-center gap-4">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  ⚔️ {bestA.name}
                  <span className="text-gray-game text-xs">(Grupo A — {bestA.score} pts)</span>
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  ⚔️ {bestB.name}
                  <span className="text-gray-game text-xs">(Grupo B — {bestB.score} pts)</span>
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Final: Champion banner */}
        {!isEliminatorias && finalWinner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: 'spring' }}
            className="w-full max-w-2xl mb-6"
          >
            <div className="bg-dark-card/80 backdrop-blur-sm border-2 border-gold shadow-2xl shadow-gold/30 rounded-3xl px-8 py-10 md:px-12 md:py-14 text-center">
              <motion.span
                className="text-7xl md:text-8xl inline-block mb-4"
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                👑
              </motion.span>

              {/* Winner image */}
              {finalWinner.image && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, type: 'spring', stiffness: 150 }}
                  className="flex justify-center mb-6"
                >
                  <div className="relative">
                    <motion.div
                      className="absolute -inset-2 rounded-full"
                      style={{ background: 'linear-gradient(135deg, #dba347, #f0c96e, #b8862e, #f0c96e, #dba347)' }}
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                    />
                    <img
                      src={finalWinner.image}
                      alt={finalWinner.name}
                      className="relative w-40 h-40 md:w-52 md:h-52 rounded-full object-cover border-4 border-dark shadow-2xl shadow-gold/40"
                    />
                  </div>
                </motion.div>
              )}

              <h3 className="text-gold font-extrabold text-3xl md:text-4xl uppercase tracking-wider mb-2">
                Campeón Absoluto
              </h3>
              <p className="text-white font-extrabold text-4xl md:text-5xl mb-2">{finalWinner.name}</p>
              <p className="text-gold text-xl md:text-2xl font-bold">{finalWinner.score}/{MAX_ROUND_SCORE} pts</p>
            </div>
          </motion.div>
        )}

        {/* Ranking table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
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
                  transition={{ delay: 0.8 + index * 0.1, type: 'spring' }}
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
                    {participant.score}/{MAX_ROUND_SCORE}
                  </div>
                  <div className="col-span-3 text-center text-gray-game font-semibold text-sm md:text-base">
                    {avgTime}s
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Action button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-8 mb-6"
        >
          {isEliminatorias ? (
            <motion.button
              whileHover={{ scale: 1.08, boxShadow: '0 0 80px rgba(219, 163, 71, 0.6)' }}
              whileTap={{ scale: 0.92 }}
              onClick={handleStartFinal}
              className="relative group px-10 py-4 bg-linear-to-r from-gold-dark via-gold to-gold-light text-dark font-extrabold text-lg rounded-2xl shadow-2xl shadow-gold/40 uppercase tracking-wider overflow-hidden border-2 border-gold-light/50"
            >
              <motion.div
                className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-200%', '200%'] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
              />
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)' }}
              />
              <span className="relative z-10 flex items-center gap-3">
                <span className="text-2xl">⚔️</span>
                Pasar a la Gran Final
                <span className="text-2xl">🏆</span>
              </span>
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.08, boxShadow: '0 0 60px rgba(219, 163, 71, 0.5)' }}
              whileTap={{ scale: 0.92 }}
              onClick={onRestart}
              className="relative px-8 py-3 bg-linear-to-r from-gold-dark via-gold to-gold-light text-dark font-semibold text-base rounded-xl shadow-lg shadow-gold/30 uppercase tracking-wider overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-linear-to-r from-transparent via-white/25 to-transparent"
                animate={{ x: ['-200%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              />
              <span className="relative z-10">Jugar de nuevo</span>
            </motion.button>
          )}
        </motion.div>

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
