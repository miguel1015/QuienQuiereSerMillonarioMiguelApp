import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [revealPhase, setRevealPhase] = useState(0);
  // 0 = initial dark, 1 = "Y los resultados son...", 2 = show scores, 3 = show ranking

  useEffect(() => {
    const timers = [
      setTimeout(() => setRevealPhase(1), 500),
      setTimeout(() => { setRevealPhase(2); playSound('celebration'); }, 2500),
      setTimeout(() => setRevealPhase(3), 4000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const sorted = [...participants].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.totalTime - b.totalTime;
  });

  const groupATotal = participants.filter((p) => p.group === 'A').reduce((s, p) => s + p.score, 0);
  const groupBTotal = participants.filter((p) => p.group === 'B').reduce((s, p) => s + p.score, 0);
  const winnerGroup = groupATotal > groupBTotal ? 'A' : groupBTotal > groupATotal ? 'B' : null;

  const isEliminatorias = round === 'eliminatorias';

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

  const finalWinner = !isEliminatorias ? sorted[0] : null;

  const handleStartFinal = () => {
    if (bestA && bestB) {
      onStartFinal(bestA.name, bestB.name);
    }
  };

  return (
    <div className="h-screen w-screen relative overflow-hidden noise-overlay">
      <AnimatedBackground variant="celebration" />

      <div className="relative z-10 h-full flex flex-col items-center px-4 py-6 overflow-y-auto">

        {/* Phase 1: Dramatic intro text */}
        <AnimatePresence>
          {revealPhase === 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.5 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            >
              <motion.h2
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-4xl md:text-7xl font-display font-bold text-metallic text-center"
              >
                {isEliminatorias ? 'Y los resultados son...' : 'Y el campeon es...'}
              </motion.h2>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={revealPhase >= 2 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-5"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={revealPhase >= 2 ? { scale: 1, rotate: 0 } : {}}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="relative inline-block mb-3"
          >
            <span className="text-6xl md:text-8xl drop-shadow-2xl inline-block">🏆</span>
            <motion.div
              className="absolute inset-0"
              style={{ filter: 'blur(35px)', background: 'rgba(219,163,71,0.5)' }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-metallic mb-1">
            {isEliminatorias ? 'Resultados Eliminatorias' : 'Resultados de la Gran Final'}
          </h1>
        </motion.div>

        {/* Group scores with animated counters */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={revealPhase >= 2 ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.4, type: 'spring' }}
          className="flex gap-4 md:gap-10 mb-6 md:mb-8 items-center"
        >
          {/* Group A */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`text-center bg-dark-card/80 backdrop-blur-md border-2 ${
              winnerGroup === 'A' ? 'border-gold shadow-xl shadow-gold/25' : 'border-blue-500/30'
            } rounded-2xl md:rounded-3xl px-6 py-4 md:px-10 md:py-6 relative overflow-hidden`}
          >
            {winnerGroup === 'A' && (
              <motion.div
                className="absolute inset-0 bg-linear-to-t from-gold/10 to-transparent"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
            <div className="relative">
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-display font-bold text-lg md:text-2xl mx-auto mb-2 shadow-lg shadow-blue-500/30">
                A
              </div>
              <motion.p
                className={`text-3xl md:text-5xl font-display font-bold ${winnerGroup === 'A' ? 'text-gold' : 'text-white'}`}
                initial={{ opacity: 0 }}
                animate={revealPhase >= 2 ? { opacity: 1 } : {}}
              >
                <CountUpNumber target={groupATotal} duration={1.5} delay={0.8} active={revealPhase >= 2} />
              </motion.p>
              <p className="text-gray-game text-xs mt-1">/ {groupAMax} pts</p>
              {winnerGroup === 'A' && revealPhase >= 2 && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.5 }}
                  className="text-gold text-sm font-display font-bold mt-2 uppercase tracking-wider"
                >
                  Ganador
                </motion.p>
              )}
            </div>
          </motion.div>

          <motion.span
            initial={{ scale: 0 }}
            animate={revealPhase >= 2 ? { scale: 1 } : {}}
            transition={{ delay: 0.5, type: 'spring' }}
            className="text-gold/40 text-4xl font-display font-bold"
          >
            VS
          </motion.span>

          {/* Group B */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`text-center bg-dark-card/80 backdrop-blur-md border-2 ${
              winnerGroup === 'B' ? 'border-gold shadow-xl shadow-gold/25' : 'border-purple-500/30'
            } rounded-2xl md:rounded-3xl px-6 py-4 md:px-10 md:py-6 relative overflow-hidden`}
          >
            {winnerGroup === 'B' && (
              <motion.div
                className="absolute inset-0 bg-linear-to-t from-gold/10 to-transparent"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
            <div className="relative">
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-linear-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-display font-bold text-lg md:text-2xl mx-auto mb-2 shadow-lg shadow-purple-500/30">
                B
              </div>
              <motion.p
                className={`text-3xl md:text-5xl font-display font-bold ${winnerGroup === 'B' ? 'text-gold' : 'text-white'}`}
                initial={{ opacity: 0 }}
                animate={revealPhase >= 2 ? { opacity: 1 } : {}}
              >
                <CountUpNumber target={groupBTotal} duration={1.5} delay={0.8} active={revealPhase >= 2} />
              </motion.p>
              <p className="text-gray-game text-xs mt-1">/ {groupBMax} pts</p>
              {winnerGroup === 'B' && revealPhase >= 2 && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.5 }}
                  className="text-gold text-sm font-display font-bold mt-2 uppercase tracking-wider"
                >
                  Ganador
                </motion.p>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Eliminatorias: Finalists banner */}
        {isEliminatorias && bestA && bestB && revealPhase >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-full max-w-2xl mb-6"
          >
            <div className="bg-dark-card/80 backdrop-blur-md border-2 border-gold/30 rounded-2xl px-6 py-5 text-center relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-linear-to-r from-transparent via-gold/5 to-transparent"
                animate={{ x: ['-200%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <h3 className="text-gold font-display font-bold text-sm uppercase tracking-[0.2em] mb-3 relative">
                Clasificados a la Gran Final
              </h3>
              <div className="flex justify-center gap-4 relative">
                <motion.span
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm bg-blue-500/15 text-blue-400 border border-blue-500/30"
                >
                  {bestA.name}
                  <span className="text-gray-game text-xs">({bestA.score} pts)</span>
                </motion.span>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                  className="text-gold/40 font-display font-bold self-center"
                >
                  vs
                </motion.span>
                <motion.span
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm bg-purple-500/15 text-purple-400 border border-purple-500/30"
                >
                  {bestB.name}
                  <span className="text-gray-game text-xs">({bestB.score} pts)</span>
                </motion.span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Final: Champion banner - EPIC */}
        {!isEliminatorias && finalWinner && revealPhase >= 2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 150 }}
            className="w-full max-w-2xl mb-6"
          >
            <div className="bg-dark-card/80 backdrop-blur-md border-2 border-gold shadow-2xl shadow-gold/30 rounded-3xl px-8 py-10 md:px-12 md:py-14 text-center relative overflow-hidden">
              {/* Animated gold shimmer */}
              <motion.div
                className="absolute inset-0 bg-linear-to-r from-transparent via-gold/8 to-transparent"
                animate={{ x: ['-200%', '200%'] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 0.5 }}
              />

              <motion.span
                className="text-7xl md:text-8xl inline-block mb-4 relative"
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                👑
              </motion.span>

              {/* Winner image */}
              {finalWinner.image && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.3, rotate: -20 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: 0.8, type: 'spring', stiffness: 120 }}
                  className="flex justify-center mb-6"
                >
                  <div className="relative">
                    <motion.div
                      className="absolute -inset-2 rounded-full"
                      style={{ background: 'linear-gradient(135deg, #dba347, #f0c96e, #b8862e, #f0c96e, #dba347)' }}
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                    />
                    {/* Outer glow ring */}
                    <motion.div
                      className="absolute -inset-6 rounded-full"
                      style={{ background: 'radial-gradient(circle, rgba(219,163,71,0.3) 40%, transparent 70%)' }}
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <img
                      src={finalWinner.image}
                      alt={finalWinner.name}
                      className="relative w-40 h-40 md:w-52 md:h-52 rounded-full object-cover border-4 border-dark shadow-2xl shadow-gold/40"
                    />
                  </div>
                </motion.div>
              )}

              <h3 className="text-gold font-display font-bold text-3xl md:text-4xl uppercase tracking-[0.15em] mb-2 relative text-metallic">
                Campeon Absoluto
              </h3>
              <motion.p
                className="text-white font-display font-bold text-4xl md:text-5xl mb-2 relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                {finalWinner.name}
              </motion.p>
              <p className="text-gold text-xl md:text-2xl font-bold relative">{finalWinner.score}/{MAX_ROUND_SCORE} pts</p>
            </div>
          </motion.div>
        )}

        {/* Ranking table */}
        {revealPhase >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl"
          >
            <h2 className="text-xl font-display font-bold text-gold mb-4 text-center uppercase tracking-[0.2em]">
              Ranking Individual
            </h2>
            <div className="bg-dark-card/80 backdrop-blur-md border-2 border-gold/15 rounded-3xl overflow-hidden shadow-xl">
              {/* Header */}
              <div className="grid grid-cols-12 gap-1 md:gap-2 px-3 md:px-5 py-2.5 md:py-3 bg-gold/8 border-b border-gold/15 text-gold text-[10px] md:text-xs font-bold uppercase tracking-wider">
                <div className="col-span-1">#</div>
                <div className="col-span-4">Nombre</div>
                <div className="col-span-2 text-center">Grupo</div>
                <div className="col-span-2 text-center">Puntos</div>
                <div className="col-span-3 text-center">T. Prom.</div>
              </div>

              {/* Rows with staggered entrance */}
              {sorted.map((participant, index) => {
                const avgTime = participant.questionsAnswered > 0
                  ? (participant.totalTime / participant.questionsAnswered).toFixed(1)
                  : '0.0';
                const isFirst = index === 0;

                return (
                  <motion.div
                    key={`${participant.name}-${participant.group}`}
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 * index, type: 'spring', stiffness: 200 }}
                    className={`grid grid-cols-12 gap-1 md:gap-2 px-3 md:px-5 py-3 md:py-4 items-center border-b border-white/5 last:border-b-0 relative ${
                      isFirst ? 'bg-gold/5' : ''
                    }`}
                  >
                    {isFirst && (
                      <motion.div
                        className="absolute inset-0 bg-linear-to-r from-gold/5 via-transparent to-gold/5"
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                    )}
                    <div className="col-span-1 relative">
                      <span className={`text-lg ${isFirst ? '' : 'text-gray-game'}`}>{getMedal(index)}</span>
                    </div>
                    <div className={`col-span-4 font-bold truncate text-sm md:text-base relative ${isFirst ? 'text-gold' : 'text-white'}`}>
                      {participant.name}
                    </div>
                    <div className="col-span-2 text-center relative">
                      <span className={`inline-flex w-6 h-6 md:w-8 md:h-8 items-center justify-center rounded-md md:rounded-lg text-[10px] md:text-xs font-bold ${
                        participant.group === 'A'
                          ? 'bg-blue-500/15 text-blue-400'
                          : 'bg-purple-500/15 text-purple-400'
                      }`}>
                        {participant.group}
                      </span>
                    </div>
                    <div className={`col-span-2 text-center font-bold text-base md:text-xl relative ${isFirst ? 'text-gold' : 'text-white'}`}>
                      {participant.score}/{MAX_ROUND_SCORE}
                    </div>
                    <div className="col-span-3 text-center text-gray-game font-semibold text-sm md:text-base relative">
                      {avgTime}s
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Action button */}
        {revealPhase >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 mb-6"
          >
            {isEliminatorias ? (
              <motion.button
                whileHover={{ scale: 1.08, boxShadow: '0 0 80px rgba(219, 163, 71, 0.6)' }}
                whileTap={{ scale: 0.92 }}
                onClick={handleStartFinal}
                className="relative group px-10 py-4 bg-linear-to-r from-gold-dark via-gold to-gold-light text-dark font-display font-bold text-lg rounded-2xl shadow-2xl shadow-gold/40 uppercase tracking-wider overflow-hidden border-2 border-gold-light/50"
              >
                <motion.div
                  className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ['-200%', '200%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
                />
                <span className="relative z-10 flex items-center gap-3">
                  Pasar a la Gran Final
                </span>
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.08, boxShadow: '0 0 60px rgba(219, 163, 71, 0.5)' }}
                whileTap={{ scale: 0.92 }}
                onClick={onRestart}
                className="relative px-8 py-3 bg-linear-to-r from-gold-dark via-gold to-gold-light text-dark font-display font-bold text-base rounded-xl shadow-lg shadow-gold/30 uppercase tracking-wider overflow-hidden"
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
        )}

        {/* Footer verse */}
        {revealPhase >= 3 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-gray-game/30 text-sm text-center mb-6 font-display italic"
          >
            Porque la palabra de Dios es viva y eficaz — Hebreos 4:12
          </motion.p>
        )}
      </div>
    </div>
  );
}

// Animated count-up number component
function CountUpNumber({ target, duration = 1.5, delay = 0, active }: { target: number; duration?: number; delay?: number; active: boolean }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!active) return;
    const timeout = setTimeout(() => {
      const start = performance.now();
      const animate = (now: number) => {
        const elapsed = (now - start) / 1000;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setCurrent(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [active, target, duration, delay]);

  return <>{current}</>;
}
