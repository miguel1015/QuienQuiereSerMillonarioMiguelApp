import { useEffect, useRef, useCallback, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Timer from '../components/Timer';
import QuestionCard from '../components/QuestionCard';
import HelpButtons from '../components/HelpButtons';
import ParticipantBanner from '../components/ParticipantBanner';
import AnswerRevealModal from '../components/AnswerRevealModal';
import StatsModal from '../components/StatsModal';
import AnimatedBackground from '../components/AnimatedBackground';
import type { GameState, HelpState, Participant, Question } from '../utils/types';
import type { SoundType } from '../hooks/useSound';

interface GameScreenProps {
  state: GameState;
  selectAnswer: (index: number) => void;
  revealAnswer: () => void;
  nextTurn: () => void;
  tickTimer: () => void;
  timeUp: () => void;
  onHelpFriend: () => void;
  onHelpAudience: () => void;
  closeHelp: () => void;
  playSound: (sound: SoundType) => void;
  stopSuspense: () => void;
}

const TIME_PER_QUESTION = 30;

export default function GameScreen({
  state,
  selectAnswer,
  revealAnswer,
  nextTurn,
  tickTimer,
  timeUp,
  onHelpFriend,
  onHelpAudience,
  closeHelp,
  playSound,
  stopSuspense,
}: GameScreenProps) {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasRevealedRef = useRef(false);
  const [showStatistics, setShowStatistics] = useState(false);

  const currentParticipant: Participant = state.participants[state.currentParticipantIndex];
  const currentQuestion: Question = state.currentQuestions[state.currentQuestionIndex];

  // Start suspense when a new question begins
  useEffect(() => {
    if (state.isTimerRunning && state.timeLeft === TIME_PER_QUESTION) {
      playSound('suspense');
    }
  }, [state.isTimerRunning, state.currentQuestionIndex, state.currentParticipantIndex]);

  // Timer effect
  useEffect(() => {
    if (state.isTimerRunning && state.timeLeft > 0) {
      timerRef.current = setInterval(() => {
        tickTimer();
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.isTimerRunning, state.timeLeft > 0, tickTimer]);

  // Timer sound at low time
  useEffect(() => {
    if (state.isTimerRunning && state.timeLeft <= 5 && state.timeLeft > 0) {
      playSound('timer');
    }
  }, [state.timeLeft, state.isTimerRunning, playSound]);

  // Time up
  useEffect(() => {
    if (state.timeLeft === 0 && state.isTimerRunning) {
      stopSuspense();
      playSound('timeup');
      timeUp();
    }
  }, [state.timeLeft, state.isTimerRunning, timeUp, stopSuspense, playSound]);

  // Auto-reveal after selecting
  const handleReveal = useCallback(() => {
    if (state.selectedAnswer !== null && !state.isAnswerRevealed && !hasRevealedRef.current) {
      hasRevealedRef.current = true;
      const timer = setTimeout(() => {
        revealAnswer();
        hasRevealedRef.current = false;
      }, 1000);
      return () => {
        clearTimeout(timer);
        hasRevealedRef.current = false;
      };
    }
  }, [state.selectedAnswer, state.isAnswerRevealed, revealAnswer]);

  useEffect(() => {
    return handleReveal();
  }, [handleReveal]);

  // Sound on reveal
  useEffect(() => {
    if (state.isAnswerRevealed) {
      stopSuspense();
      const isCorrect = state.selectedAnswer === currentQuestion.correct;
      if (state.selectedAnswer !== null) {
        playSound(isCorrect ? 'correct' : 'incorrect');
      } else {
        // timeup already played its own sound
      }
    }
  }, [state.isAnswerRevealed]);

  // Wrappers with sound
  const handleSelectAnswer = (index: number) => {
    playSound('select');
    selectAnswer(index);
  };

  const handleNextTurn = () => {
    playSound('whoosh');
    nextTurn();
  };

  const handleFriend = () => {
    playSound('lifeline');
    onHelpFriend();
  };

  const handleAudience = () => {
    playSound('lifeline');
    onHelpAudience();
  };

  const handleStatistics = () => {
    setShowStatistics(true);
  };

  const handleCloseStats = () => {
    setShowStatistics(false);
  };

  const getNextLabel = () => {
    if (state.currentQuestionIndex + 1 < state.questionsPerParticipant) return 'Siguiente pregunta';
    if (state.currentParticipantIndex + 1 < state.participants.length) return 'Siguiente participante';
    return 'Ver resultados';
  };

  if (!currentQuestion || !currentParticipant) return null;

  const bgVariant = state.timeLeft <= 3 && state.isTimerRunning ? 'intense' : 'default';

  return (
    <div className="h-screen w-screen flex flex-col items-center relative overflow-hidden">
      <AnimatedBackground variant={bgVariant} />

      <div className="relative z-10 flex flex-col h-full px-2 md:px-8 py-3 md:py-4 max-w-4xl mx-auto w-full">
        {/* Top: Participant */}
        <div className="mb-3">
          <ParticipantBanner
            participant={currentParticipant}
            questionIndex={state.currentQuestionIndex}
            totalQuestions={state.questionsPerParticipant}
          />
        </div>

        {/* Timer */}
        <div className="mb-3">
          <Timer timeLeft={state.timeLeft} maxTime={TIME_PER_QUESTION} />
        </div>

        {/* Main: Question card - takes remaining space */}
        <div className="flex-1 flex flex-col justify-center min-h-0 mb-3 overflow-y-auto">
          <AnimatePresence mode="wait">
            <QuestionCard
              key={`${state.currentParticipantIndex}-${state.currentQuestionIndex}`}
              question={currentQuestion}
              questionNumber={state.currentQuestionIndex + 1}
              totalQuestions={state.questionsPerParticipant}
              selectedAnswer={state.selectedAnswer}
              isRevealed={state.isAnswerRevealed}
              onSelect={handleSelectAnswer}
            />
          </AnimatePresence>
        </div>

        {/* Bottom: Help buttons */}
        <div className="pb-2">
          <HelpButtons
            helps={state.helps as HelpState}
            audienceResults={state.audienceResults}
            friendSuggestion={state.friendSuggestion}
            currentQuestion={currentQuestion}
            onStatistics={handleStatistics}
            onFriend={handleFriend}
            onAudience={handleAudience}
            onCloseHelp={closeHelp}
            isDisabled={state.isAnswerRevealed}
          />
        </div>
      </div>

      {/* Answer reveal modal - z-40 */}
      <AnswerRevealModal
        show={state.isAnswerRevealed}
        question={currentQuestion}
        selectedAnswer={state.selectedAnswer}
        onNext={handleNextTurn}
        onShowStats={handleStatistics}
        nextLabel={getNextLabel()}
      />

      {/* Statistics modal - z-50, always on top */}
      <StatsModal
        show={showStatistics}
        participants={state.participants}
        currentParticipant={currentParticipant}
        onClose={handleCloseStats}
      />
    </div>
  );
}
