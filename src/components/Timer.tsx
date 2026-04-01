import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface TimerProps {
  timeLeft: number;
  maxTime: number;
}

// Pre-generate disintegration particles
const disintegrationParticles = Array.from({ length: 16 }, (_, i) => {
  const angle = (i / 16) * Math.PI * 2;
  return {
    x: Math.cos(angle) * (30 + Math.random() * 40),
    y: Math.sin(angle) * (30 + Math.random() * 40),
    size: Math.random() * 3 + 1,
    delay: Math.random() * 0.5,
  };
});

export default function Timer({ timeLeft, maxTime }: TimerProps) {
  const percentage = (timeLeft / maxTime) * 100;
  const isLow = timeLeft <= 5;
  const isCritical = timeLeft <= 3;
  const isZero = timeLeft === 0;

  // Circular timer math
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - timeLeft / maxTime);

  // Color based on time
  const timerColor = useMemo(() => {
    if (isCritical) return '#e74c3c';
    if (isLow) return '#f39c12';
    return '#dba347';
  }, [isCritical, isLow]);

  const glowColor = useMemo(() => {
    if (isCritical) return 'rgba(231,76,60,0.5)';
    if (isLow) return 'rgba(243,156,18,0.3)';
    return 'rgba(219,163,71,0.2)';
  }, [isCritical, isLow]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex items-center gap-3 md:gap-4">
        {/* Circular timer */}
        <div className="relative shrink-0">
          <motion.div
            animate={isCritical ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.6, repeat: isCritical ? Infinity : 0 }}
          >
            <svg width="70" height="70" viewBox="0 0 90 90" className="-rotate-90 md:w-22.5 md:h-22.5">
              {/* Background circle */}
              <circle
                cx="45"
                cy="45"
                r={radius}
                fill="none"
                stroke="rgba(18,18,42,0.8)"
                strokeWidth="6"
              />
              {/* Track glow */}
              <circle
                cx="45"
                cy="45"
                r={radius}
                fill="none"
                stroke={glowColor}
                strokeWidth="8"
                opacity="0.3"
                style={{ filter: 'blur(4px)' }}
              />
              {/* Progress circle */}
              <motion.circle
                cx="45"
                cy="45"
                r={radius}
                fill="none"
                stroke={timerColor}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={false}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.5, ease: 'linear' }}
              />
              {/* Glow overlay on progress */}
              <motion.circle
                cx="45"
                cy="45"
                r={radius}
                fill="none"
                stroke={timerColor}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={false}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.5, ease: 'linear' }}
                opacity="0.15"
                style={{ filter: 'blur(6px)' }}
              />
            </svg>
          </motion.div>

          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              key={timeLeft}
              className={`text-lg md:text-2xl font-display font-bold tabular-nums ${
                isCritical ? 'text-incorrect' : isLow ? 'text-gold' : 'text-white'
              }`}
              initial={isLow ? { scale: 1.5, opacity: 0.5 } : false}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              {timeLeft}
            </motion.span>
          </div>

          {/* Glow ring on low time */}
          {isLow && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ boxShadow: `0 0 25px ${glowColor}` }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            />
          )}

          {/* Disintegration particles when time runs out */}
          {isZero && disintegrationParticles.map((p, i) => (
            <motion.div
              key={`disint-${i}`}
              className="absolute rounded-full"
              style={{
                width: p.size,
                height: p.size,
                backgroundColor: '#e74c3c',
                left: '50%',
                top: '50%',
              }}
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={{ x: p.x, y: p.y, opacity: 0, scale: 0 }}
              transition={{ duration: 0.8, delay: p.delay, ease: 'easeOut' }}
            />
          ))}
        </div>

        {/* Linear bar */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-gray-game text-xs font-semibold tracking-wider uppercase">Tiempo restante</span>
            <span className={`text-xs font-bold tabular-nums ${isCritical ? 'text-incorrect' : 'text-gray-game'}`}>
              {timeLeft}/{maxTime}s
            </span>
          </div>
          <div className="h-4 bg-dark-light rounded-full overflow-hidden border border-white/5 relative">
            <motion.div
              className="h-full rounded-full relative overflow-hidden"
              style={{
                background: isCritical
                  ? 'linear-gradient(90deg, #c0392b, #e74c3c, #e74c3c)'
                  : isLow
                  ? 'linear-gradient(90deg, #b8862e, #f39c12, #dba347)'
                  : 'linear-gradient(90deg, #b8862e, #dba347, #f0c96e)',
                boxShadow: `0 0 10px ${glowColor}`,
              }}
              initial={false}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.5, ease: 'linear' }}
            >
              {/* Moving shimmer */}
              <motion.div
                className="absolute inset-0 bg-linear-to-r from-transparent via-white/25 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: isCritical ? 0.6 : 1.5, repeat: Infinity, repeatDelay: isCritical ? 0 : 0.5 }}
              />
            </motion.div>

            {/* Tick marks */}
            <div className="absolute inset-0 flex justify-between px-0.5">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="w-px h-full bg-white/5" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Screen-wide pulse on critical - more dramatic */}
      {isCritical && (
        <>
          <motion.div
            className="fixed inset-0 pointer-events-none z-40"
            animate={{ opacity: [0, 0.15, 0] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            style={{ boxShadow: 'inset 0 0 100px rgba(231,76,60,0.4)' }}
          />
          <motion.div
            className="fixed inset-0 pointer-events-none z-40 border-2 border-incorrect/20"
            animate={{ opacity: [0, 0.4, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        </>
      )}
    </div>
  );
}
