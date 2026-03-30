import { motion } from 'framer-motion';

interface TimerProps {
  timeLeft: number;
  maxTime: number;
}

export default function Timer({ timeLeft, maxTime }: TimerProps) {
  const percentage = (timeLeft / maxTime) * 100;
  const isLow = timeLeft <= 5;
  const isCritical = timeLeft <= 3;

  // Circular timer math
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - timeLeft / maxTime);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex items-center gap-3 md:gap-4">
        {/* Circular timer */}
        <div className="relative shrink-0">
          <svg width="70" height="70" viewBox="0 0 90 90" className="-rotate-90 md:w-22.5 md:h-22.5">
            {/* Background circle */}
            <circle
              cx="45"
              cy="45"
              r={radius}
              fill="none"
              stroke="rgba(26,26,46,0.8)"
              strokeWidth="6"
            />
            {/* Progress circle */}
            <motion.circle
              cx="45"
              cy="45"
              r={radius}
              fill="none"
              stroke={isCritical ? '#e74c3c' : isLow ? '#dba347' : '#dba347'}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={false}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.5, ease: 'linear' }}
            />
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              className={`text-lg md:text-2xl font-extrabold tabular-nums ${
                isCritical ? 'text-incorrect' : isLow ? 'text-gold' : 'text-white'
              }`}
              animate={
                isCritical
                  ? { scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }
                  : isLow
                  ? { scale: [1, 1.15, 1] }
                  : {}
              }
              transition={{ duration: 0.6, repeat: isLow ? Infinity : 0 }}
            >
              {timeLeft}
            </motion.span>
          </div>

          {/* Glow ring on low time */}
          {isLow && (
            <motion.div
              className={`absolute inset-0 rounded-full ${
                isCritical ? 'shadow-[0_0_20px_rgba(231,76,60,0.4)]' : 'shadow-[0_0_20px_rgba(219,163,71,0.3)]'
              }`}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          )}
        </div>

        {/* Linear bar */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-gray-game text-xs font-semibold tracking-wider uppercase">Tiempo restante</span>
            <span className={`text-xs font-bold ${isCritical ? 'text-incorrect' : 'text-gray-game'}`}>
              {timeLeft}/{maxTime}s
            </span>
          </div>
          <div className="h-4 bg-dark-light rounded-full overflow-hidden border border-gold/15 relative">
            <motion.div
              className={`h-full rounded-full relative overflow-hidden ${
                isCritical
                  ? 'bg-gradient-to-r from-incorrect to-red-400'
                  : isLow
                  ? 'bg-gradient-to-r from-gold-dark to-gold'
                  : 'bg-gradient-to-r from-gold-dark via-gold to-gold-light'
              }`}
              initial={false}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.5, ease: 'linear' }}
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Screen-wide pulse on critical */}
      {isCritical && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-40 border-4 border-incorrect/20 rounded-none"
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      )}
    </div>
  );
}
