import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameState } from './hooks/useGameState';
import { useSound } from './hooks/useSound';
import HomeScreen from './screens/HomeScreen';
import SetupScreen from './screens/SetupScreen';
import GameScreen from './screens/GameScreen';
import ResultsScreen from './screens/ResultsScreen';

function App() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  const {
    state,
    setScreen,
    setGroups,
    startGame,
    selectAnswer,
    revealAnswer,
    nextTurn,
    tickTimer,
    timeUp,
    useHelpFriend,
    useHelpAudience,
    closeHelp,
    resetGame,
  } = useGameState();

  const { playSound, stopSuspense } = useSound();

  const handleSetupContinue = (groupA: string[], groupB: string[], round: 'eliminatorias' | 'final') => {
    setGroups(groupA, groupB, round);
    setTimeout(() => startGame(), 50);
  };

  return (
    <div className="h-screen w-screen bg-dark overflow-hidden relative">
      <button
        onClick={toggleFullscreen}
        className="absolute top-3 right-3 z-50 p-2 rounded-lg bg-dark-card/70 border border-gold/30 text-gold hover:bg-dark-card hover:border-gold/60 backdrop-blur-sm transition-all cursor-pointer"
        title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
      >
        {isFullscreen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 14 10 14 10 20" />
            <polyline points="20 10 14 10 14 4" />
            <line x1="14" y1="10" x2="21" y2="3" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        )}
      </button>
      <AnimatePresence mode="wait">
        {state.screen === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="h-full w-full"
          >
            <HomeScreen onStart={() => { playSound('intro'); setScreen('setup'); }} />
          </motion.div>
        )}

        {state.screen === 'setup' && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="h-full w-full"
          >
            <SetupScreen
              onContinue={handleSetupContinue}
              onBack={() => setScreen('home')}
            />
          </motion.div>
        )}

        {state.screen === 'game' && (
          <motion.div
            key="game"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
            className="h-full w-full"
          >
            <GameScreen
              state={state}
              selectAnswer={selectAnswer}
              revealAnswer={revealAnswer}
              nextTurn={nextTurn}
              tickTimer={tickTimer}
              timeUp={timeUp}
              onHelpFriend={useHelpFriend}
              onHelpAudience={useHelpAudience}
              closeHelp={closeHelp}
              playSound={playSound}
              stopSuspense={stopSuspense}
            />
          </motion.div>
        )}

        {state.screen === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="h-full w-full"
          >
            <ResultsScreen
              participants={state.participants}
              onRestart={resetGame}
              playSound={playSound}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
