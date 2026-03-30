import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedBackground from '../components/AnimatedBackground';
import type { Round } from '../utils/types';

interface SetupScreenProps {
  onContinue: (groupA: string[], groupB: string[], round: Round) => void;
  onBack: () => void;
}

export default function SetupScreen({ onContinue, onBack }: SetupScreenProps) {
  const [groupA, setGroupA] = useState<string[]>(['']);
  const [groupB, setGroupB] = useState<string[]>(['']);
  const [round, setRound] = useState<Round>('eliminatorias');
  const [error, setError] = useState('');

  const addParticipant = (group: 'A' | 'B') => {
    if (group === 'A') setGroupA([...groupA, '']);
    else setGroupB([...groupB, '']);
  };

  const removeParticipant = (group: 'A' | 'B', index: number) => {
    if (group === 'A' && groupA.length > 1) {
      setGroupA(groupA.filter((_, i) => i !== index));
    } else if (group === 'B' && groupB.length > 1) {
      setGroupB(groupB.filter((_, i) => i !== index));
    }
  };

  const updateName = (group: 'A' | 'B', index: number, name: string) => {
    if (group === 'A') {
      const updated = [...groupA];
      updated[index] = name;
      setGroupA(updated);
    } else {
      const updated = [...groupB];
      updated[index] = name;
      setGroupB(updated);
    }
  };

  const handleContinue = () => {
    const filteredA = groupA.map((n) => n.trim()).filter(Boolean);
    const filteredB = groupB.map((n) => n.trim()).filter(Boolean);

    if (filteredA.length === 0 || filteredB.length === 0) {
      setError('Cada grupo necesita al menos un participante.');
      return;
    }
    setError('');
    onContinue(filteredA, filteredB, round);
  };

  const renderGroup = (group: 'A' | 'B', names: string[], gradientFrom: string, gradientTo: string, borderColor: string, textColor: string) => (
    <motion.div
      initial={{ opacity: 0, x: group === 'A' ? -40 : 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3, type: 'spring' }}
      className="flex-1 min-w-0"
    >
      <div className={`bg-dark-card/80 backdrop-blur-sm border-2 ${borderColor} rounded-3xl p-6 shadow-xl`}>
        {/* Group header */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className={`w-12 h-12 rounded-2xl bg-linear-to-br ${gradientFrom} ${gradientTo} flex items-center justify-center text-white font-extrabold text-xl shadow-lg`}>
            {group}
          </div>
          <h3 className={`text-2xl font-extrabold ${textColor}`}>
            Grupo {group}
          </h3>
        </div>

        <div className="space-y-3">
          <AnimatePresence>
            {names.map((name, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                className="flex gap-2"
              >
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-game/40 text-sm font-semibold">
                    {index + 1}.
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => updateName(group, index, e.target.value)}
                    placeholder={`Participante ${index + 1}`}
                    className="w-full bg-dark-light/80 border-2 border-gray-game/15 rounded-xl pl-10 pr-4 py-2.5 md:py-3 text-white text-base md:text-lg placeholder-gray-game/30 focus:border-gold/60 focus:outline-none focus:shadow-lg focus:shadow-gold/10 transition-all"
                  />
                </div>
                {names.length > 1 && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeParticipant(group, index)}
                    className="w-10 h-10 self-center bg-incorrect/10 border border-incorrect/30 rounded-lg text-incorrect hover:bg-incorrect/20 transition-colors flex items-center justify-center font-medium text-sm"
                  >
                    ✕
                  </motion.button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <motion.button
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => addParticipant(group)}
          className={`mt-4 w-full py-2.5 border border-dashed ${borderColor} rounded-lg ${textColor} font-medium text-sm hover:bg-white/5 transition-colors`}
        >
          + Agregar participante
        </motion.button>
      </div>
    </motion.div>
  );

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center relative overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 w-full max-w-4xl px-4 overflow-y-auto max-h-screen py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.1 }}
            className="text-5xl inline-block mb-3"
          >
            ⚔️
          </motion.span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-gold-dark via-gold to-gold-light mb-3">
            Configuración de Grupos
          </h2>
          <p className="text-gray-game text-lg">
            Ingresa los nombres de los participantes
          </p>
        </motion.div>

        {/* Round selector */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-3 mb-8"
        >
          {([
            { value: 'eliminatorias' as Round, label: 'Eliminatorias', icon: '⚔️' },
            { value: 'final' as Round, label: 'Final', icon: '🏆' },
          ]).map((option) => (
            <motion.button
              key={option.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (option.value === 'final') {
                  setError('La ronda Final se encuentra en construcción. Próximamente...');
                  return;
                }
                setError('');
                setRound(option.value);
              }}
              className={`px-5 py-3 rounded-xl font-bold text-sm md:text-base transition-all border-2 ${
                round === option.value
                  ? 'bg-gold/20 border-gold text-gold shadow-lg shadow-gold/20'
                  : 'bg-dark-card/80 border-gray-game/20 text-gray-game hover:border-gold/40'
              }`}
            >
              {option.icon} {option.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Groups side by side */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {renderGroup('A', groupA, 'from-blue-500', 'to-blue-700', 'border-blue-500/30', 'text-blue-400')}

          {/* VS divider */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="hidden md:flex items-center"
          >
            <span className="text-gold/40 text-3xl font-extrabold">VS</span>
          </motion.div>

          {renderGroup('B', groupB, 'from-purple-500', 'to-purple-700', 'border-purple-500/30', 'text-purple-400')}
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
            className="px-6 py-2.5 bg-dark-card/80 backdrop-blur-sm border border-gray-game/30 rounded-xl text-gray-game font-medium text-sm hover:bg-dark-light transition-colors"
          >
            Volver
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(219, 163, 71, 0.4)' }}
            whileTap={{ scale: 0.95 }}
            onClick={handleContinue}
            className="relative px-8 py-3 bg-linear-to-r from-gold-dark via-gold to-gold-light text-dark font-semibold text-base rounded-xl shadow-lg shadow-gold/25 overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ['-200%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5 }}
            />
            <span className="relative z-10">Comenzar juego</span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
