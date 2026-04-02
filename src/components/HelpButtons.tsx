import { motion, AnimatePresence } from 'framer-motion';
import type { HelpState } from '../utils/types';

interface HelpButtonsProps {
  helps: HelpState;
  audienceResults: number[] | null;
  friendSuggestion: number | null;
  currentQuestion: { options: string[] };
  onStatistics: () => void;
  onFriend: () => void;
  onAudience: () => void;
  onCloseHelp: () => void;
  onPauseTimer: () => void;
  onResumeTimer: () => void;
  isDisabled: boolean;
}

const optionLabels = ['A', 'B', 'C', 'D'];

export default function HelpButtons({
  helps,
  audienceResults,
  friendSuggestion,
  currentQuestion,
  onStatistics,
  onFriend,
  onAudience,
  onCloseHelp,
  onPauseTimer,
  onResumeTimer,
  isDisabled,
}: HelpButtonsProps) {
  const showModal = audienceResults !== null || friendSuggestion !== null;
  const isLoading = (audienceResults === undefined || friendSuggestion === undefined);

  const handleFriendClick = () => {
    onPauseTimer();
    onFriend();
  };

  const handleAudienceClick = () => {
    onPauseTimer();
    onAudience();
  };

  const handleCloseModal = () => {
    onResumeTimer();
    onCloseHelp();
  };

  return (
    <>
      <div className="flex justify-center gap-2 md:gap-3 flex-wrap">
        {[
          { key: 'statistics' as const, icon: '📊', label: 'Estadísticas', action: onStatistics, available: true },
          { key: 'callFriend' as const, icon: '📞', label: 'Llamar a un amigo', action: handleFriendClick, available: helps.callFriend },
          { key: 'askAudience' as const, icon: '👥', label: 'Preguntar al público', action: handleAudienceClick, available: helps.askAudience },
        ].map((help) => (
          <motion.button
            key={help.key}
            whileHover={help.available && !isDisabled ? { scale: 1.08, y: -3 } : {}}
            whileTap={help.available && !isDisabled ? { scale: 0.95 } : {}}
            onClick={help.action}
            disabled={!help.available || isDisabled}
            className={`relative px-3 py-2 md:px-4 md:py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all overflow-hidden ${
              help.available && !isDisabled
                ? 'bg-dark-card/80 backdrop-blur-md border-2 border-gold/30 text-gold hover:border-gold/60 hover:shadow-lg hover:shadow-gold/15'
                : 'bg-dark-light/20 border-2 border-white/5 text-gray-game/25 cursor-not-allowed'
            }`}
          >
            {help.available && !isDisabled && (
              <motion.div
                className="absolute inset-0 bg-linear-to-r from-gold/0 via-gold/8 to-gold/0"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5 }}
              />
            )}
            <span className="relative z-10">
              {help.icon} {help.label}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Audience / Friend Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={handleCloseModal}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-lg" />

            <motion.div
              initial={{ scale: 0.6, y: 60, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              className="relative z-10 bg-dark-card/95 border-2 border-gold/25 rounded-3xl p-4 md:p-8 mx-4 max-w-lg w-full shadow-2xl shadow-gold/10 backdrop-blur-md"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Audience results - Only show if loaded */}
              {audienceResults && (
                <>
                  <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} className="text-4xl md:text-5xl text-center mb-3 md:mb-4">
                    👥
                  </motion.div>
                  <h3 className="text-gold font-display font-bold text-xl md:text-2xl text-center mb-4 md:mb-6">
                    El público ha votado
                  </h3>
                  <div className="space-y-4">
                    {audienceResults.map((percent, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-gold font-display font-bold w-7 text-lg">{optionLabels[i]}</span>
                        <div className="flex-1 h-8 md:h-10 bg-dark-light/80 rounded-xl overflow-hidden border border-white/5">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            transition={{ duration: 1, delay: i * 0.15, ease: 'easeOut' }}
                            className="h-full bg-linear-to-r from-gold-dark to-gold rounded-xl flex items-center justify-end pr-3 relative overflow-hidden"
                          >
                            <motion.div
                              className="absolute inset-0 bg-linear-to-r from-transparent via-white/15 to-transparent"
                              animate={{ x: ['-100%', '200%'] }}
                              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1, delay: i * 0.15 + 1 }}
                            />
                            {percent > 10 && (
                              <span className="text-dark text-sm font-bold relative z-10">{percent}%</span>
                            )}
                          </motion.div>
                        </div>
                        {percent <= 10 && (
                          <span className="text-gold text-sm font-bold w-10">{percent}%</span>
                        )}
                        <span className="text-gray-game text-xs md:text-sm w-20 md:w-28 truncate text-right">
                          {currentQuestion.options[i]}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Loading state for audience - Show if in loading state */}
              {friendSuggestion === undefined && audienceResults === undefined && (
                <>
                  <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} className="text-4xl md:text-5xl text-center mb-3 md:mb-4">
                    👥
                  </motion.div>
                  <h3 className="text-gold font-display font-bold text-xl md:text-2xl text-center mb-6 md:mb-8">
                    Consultando el público...
                  </h3>
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="flex justify-center gap-2"
                  >
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-3 h-3 bg-gold rounded-full"
                      />
                    ))}
                  </motion.div>
                </>
              )}

              {/* Friend suggestion - Only show if loaded */}
              {friendSuggestion !== null && (
                <>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-5xl text-center mb-4">
                    📞
                  </motion.div>
                  <h3 className="text-gold font-display font-bold text-2xl text-center mb-2">
                    Tu amigo dice...
                  </h3>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-game text-center text-lg mb-6 italic"
                  >
                    "Estoy bastante seguro de que la respuesta es..."
                  </motion.p>
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6, type: 'spring' }}
                    className="flex items-center justify-center gap-3 bg-gold/10 border-2 border-gold/30 rounded-2xl px-8 py-5 mx-auto max-w-xs"
                  >
                    <span className="text-gold font-display font-bold text-3xl">
                      {optionLabels[friendSuggestion]}
                    </span>
                    <span className="text-white font-bold text-xl">
                      {currentQuestion.options[friendSuggestion]}
                    </span>
                  </motion.div>
                </>
              )}

              {/* Loading state for friend - Show if in loading state */}
              {friendSuggestion === undefined && audienceResults !== undefined && (
                <>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-5xl text-center mb-4">
                    📞
                  </motion.div>
                  <h3 className="text-gold font-display font-bold text-2xl text-center mb-8">
                    Llamando a un amigo...
                  </h3>
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="flex justify-center gap-2"
                  >
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-3 h-3 bg-gold rounded-full"
                      />
                    ))}
                  </motion.div>
                </>
              )}

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleCloseModal}
                className="mt-6 w-full py-2.5 bg-gold/10 border border-gold/30 rounded-xl text-gold font-semibold text-sm hover:bg-gold/20 transition-all"
              >
                Cerrar
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}