export type Round = 'eliminatorias' | 'final';

export interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  verse: string;
  group?: 'A' | 'B';
  round?: Round;
}

export interface Participant {
  name: string;
  group: 'A' | 'B';
  score: number;
  totalTime: number;
  questionsAnswered: number;
}

export interface HelpState {
  statistics: boolean;
  callFriend: boolean;
  askAudience: boolean;
}

export type Screen = 'home' | 'setup' | 'game' | 'results';

export interface GameState {
  screen: Screen;
  round: Round;
  groupA: string[];
  groupB: string[];
  participants: Participant[];
  currentParticipantIndex: number;
  currentQuestionIndex: number;
  questionsPerParticipant: number;
  usedQuestionIndices: number[];
  currentQuestions: Question[];
  selectedAnswer: number | null;
  isAnswerRevealed: boolean;
  timeLeft: number;
  helps: HelpState;
  audienceResults: number[] | null;
  friendSuggestion: number | null;
  isTimerRunning: boolean;
}

export type GameAction =
  | { type: 'SET_SCREEN'; screen: Screen }
  | { type: 'SET_GROUPS'; groupA: string[]; groupB: string[]; round: Round }
  | { type: 'START_GAME' }
  | { type: 'SELECT_ANSWER'; index: number }
  | { type: 'REVEAL_ANSWER' }
  | { type: 'NEXT_TURN' }
  | { type: 'TICK_TIMER' }
  | { type: 'TIME_UP' }
  | { type: 'USE_HELP_STATISTICS' }
  | { type: 'USE_HELP_FRIEND' }
  | { type: 'USE_HELP_AUDIENCE' }
  | { type: 'CLOSE_HELP' }
  | { type: 'RESET_GAME' };
