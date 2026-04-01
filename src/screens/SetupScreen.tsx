import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedBackground from '../components/AnimatedBackground';
import { PARTICIPANTS, REQUIRED_PER_GROUP } from '../data/participants';
import type { ParticipantOption } from '../data/participants';

export interface ParticipantEntry {
  name: string;
  image: string | null;
}

interface SetupScreenProps {
  onContinue: (groupA: ParticipantEntry[], groupB: ParticipantEntry[]) => void;
  onBack: () => void;
}

type GroupAssignment = 'A' | 'B' | null;

export default function SetupScreen({ onContinue, onBack }: SetupScreenProps) {
  const [assignments, setAssignments] = useState<Record<string, GroupAssignment>>(
    () => Object.fromEntries(PARTICIPANTS.map((p) => [p.id, null]))
  );
  const [selectionOrder, setSelectionOrder] = useState<{ id: string; group: 'A' | 'B' }[]>([]);
  const [error, setError] = useState('');

  const groupACount = Object.values(assignments).filter((g) => g === 'A').length;
  const groupBCount = Object.values(assignments).filter((g) => g === 'B').length;

  const cycleGroup = (id: string) => {
    setError('');
    setAssignments((prev) => {
      const current = prev[id];
      let next: GroupAssignment;
      if (current === null) {
        if (groupACount < REQUIRED_PER_GROUP) next = 'A';
        else if (groupBCount < REQUIRED_PER_GROUP) next = 'B';
        else next = null;
      } else if (current === 'A') {
        next = groupBCount < REQUIRED_PER_GROUP ? 'B' : null;
      } else {
        next = null;
      }
      return { ...prev, [id]: next };
    });

    setSelectionOrder((prev) => {
      const current = assignments[id];
      const filtered = prev.filter((e) => e.id !== id);
      let nextGroup: GroupAssignment;
      if (current === null) {
        if (groupACount < REQUIRED_PER_GROUP) nextGroup = 'A';
        else if (groupBCount < REQUIRED_PER_GROUP) nextGroup = 'B';
        else nextGroup = null;
      } else if (current === 'A') {
        nextGroup = groupBCount < REQUIRED_PER_GROUP ? 'B' : null;
      } else {
        nextGroup = null;
      }
      if (nextGroup) {
        return [...filtered, { id, group: nextGroup }];
      }
      return filtered;
    });
  };

  const handleContinue = () => {
    if (groupACount !== REQUIRED_PER_GROUP || groupBCount !== REQUIRED_PER_GROUP) {
      setError(`Cada grupo debe tener exactamente ${REQUIRED_PER_GROUP} participantes.`);
      return;
    }
    const participantMap = Object.fromEntries(PARTICIPANTS.map((p) => [p.id, p]));
    const groupA = selectionOrder
      .filter((e) => e.group === 'A')
      .map((e) => ({ name: participantMap[e.id].name, image: participantMap[e.id].image }));
    const groupB = selectionOrder
      .filter((e) => e.group === 'B')
      .map((e) => ({ name: participantMap[e.id].name, image: participantMap[e.id].image }));
    onContinue(groupA, groupB);
  };

  const getCardStyle = (group: GroupAssignment) => {
    if (group === 'A') return 'border-blue-500 bg-blue-500/10 shadow-blue-500/20 shadow-lg';
    if (group === 'B') return 'border-purple-500 bg-purple-500/10 shadow-purple-500/20 shadow-lg';
    return 'border-white/10 bg-dark-card/60 hover:border-gold/30 hover:bg-dark-card/80';
  };

  const getBadge = (group: GroupAssignment) => {
    if (group === 'A')
      return (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-blue-500 text-white text-xs font-display font-bold flex items-center justify-center shadow-lg shadow-blue-500/40 z-10"
        >
          A
        </motion.span>
      );
    if (group === 'B')
      return (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-purple-500 text-white text-xs font-display font-bold flex items-center justify-center shadow-lg shadow-purple-500/40 z-10"
        >
          B
        </motion.span>
      );
    return null;
  };

  const renderParticipantCard = (participant: ParticipantOption, index: number) => {
    const group = assignments[participant.id];
    return (
      <motion.button
        key={participant.id}
        initial={{ opacity: 0, y: 25, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.05 + index * 0.04, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.04, y: -5 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => cycleGroup(participant.id)}
        className={`relative rounded-2xl border-2 p-3 transition-all duration-300 cursor-pointer flex flex-col items-center gap-2 overflow-hidden ${getCardStyle(group)}`}
      >
        {getBadge(group)}

        {/* Selection glow effect */}
        {group && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`absolute inset-0 ${
              group === 'A'
                ? 'bg-linear-to-t from-blue-500/10 to-transparent'
                : 'bg-linear-to-t from-purple-500/10 to-transparent'
            }`}
          />
        )}

        <div className="w-full aspect-square rounded-xl overflow-hidden bg-dark-light/50 relative">
          {participant.image ? (
            <img
              src={participant.image}
              alt={participant.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gold-dark/15 to-gold/5">
              <span className="text-4xl font-display font-bold text-gold/30">
                {participant.name.charAt(0)}
              </span>
            </div>
          )}
        </div>
        <span className="text-white font-semibold text-sm text-center leading-tight truncate w-full relative">
          {participant.name}
        </span>
      </motion.button>
    );
  };

  const isReady = groupACount === REQUIRED_PER_GROUP && groupBCount === REQUIRED_PER_GROUP;

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center relative overflow-hidden noise-overlay">
      <AnimatedBackground />

      <div className="relative z-10 w-full max-w-5xl px-4 overflow-y-auto max-h-screen py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold text-metallic mb-2">
            Arma los Grupos
          </h2>
          <p className="text-gray-game text-base md:text-lg">
            Toca cada participante para asignarlo a un grupo
          </p>
        </motion.div>

        {/* Group counters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center gap-6 mb-6"
        >
          <div className={`flex items-center gap-2 px-5 py-2 rounded-xl border-2 transition-all backdrop-blur-sm ${groupACount === REQUIRED_PER_GROUP ? 'border-blue-500 bg-blue-500/15 shadow-md shadow-blue-500/20' : 'border-blue-500/25 bg-blue-500/5'}`}>
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white font-display font-bold text-sm">
              A
            </div>
            <span className={`font-bold text-lg tabular-nums ${groupACount === REQUIRED_PER_GROUP ? 'text-blue-400' : 'text-blue-400/50'}`}>
              {groupACount}/{REQUIRED_PER_GROUP}
            </span>
          </div>

          <div className={`flex items-center gap-2 px-5 py-2 rounded-xl border-2 transition-all backdrop-blur-sm ${groupBCount === REQUIRED_PER_GROUP ? 'border-purple-500 bg-purple-500/15 shadow-md shadow-purple-500/20' : 'border-purple-500/25 bg-purple-500/5'}`}>
            <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center text-white font-display font-bold text-sm">
              B
            </div>
            <span className={`font-bold text-lg tabular-nums ${groupBCount === REQUIRED_PER_GROUP ? 'text-purple-400' : 'text-purple-400/50'}`}>
              {groupBCount}/{REQUIRED_PER_GROUP}
            </span>
          </div>
        </motion.div>

        {/* Participant grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
          {PARTICIPANTS.map((p, i) => renderParticipantCard(p, i))}
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center mb-6"
            >
              <p className="inline-block bg-incorrect/10 border border-incorrect/30 text-incorrect rounded-xl px-6 py-3 font-semibold">
                {error}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="px-6 py-2.5 bg-dark-card/80 backdrop-blur-md border border-white/10 rounded-xl text-gray-game font-medium text-sm hover:bg-dark-light hover:border-white/20 transition-all"
          >
            Volver
          </motion.button>
          <motion.button
            whileHover={isReady ? {
              scale: 1.05,
              boxShadow: '0 0 50px rgba(219, 163, 71, 0.4)',
            } : {}}
            whileTap={isReady ? { scale: 0.95 } : {}}
            onClick={handleContinue}
            className={`relative px-8 py-3 rounded-xl font-display font-bold text-base overflow-hidden transition-all ${
              isReady
                ? 'bg-linear-to-r from-gold-dark via-gold to-gold-light text-dark shadow-lg shadow-gold/25'
                : 'bg-white/5 text-gray-game/30 cursor-not-allowed border border-white/5'
            }`}
            disabled={!isReady}
          >
            {isReady && (
              <motion.div
                className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ['-200%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5 }}
              />
            )}
            <span className="relative z-10 uppercase tracking-wider">Comenzar juego</span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
