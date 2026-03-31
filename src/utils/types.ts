export type Round = 'eliminatorias' | 'final';

export type Difficulty = 'facil' | 'medio_facil' | 'intermedio' | 'medio_dificil' | 'dificil';

export const DIFFICULTY_ORDER: Difficulty[] = ['facil', 'medio_facil', 'intermedio', 'medio_dificil', 'dificil'];

export const DIFFICULTY_POINTS: Record<Difficulty, number> = {
  facil: 1,
  medio_facil: 2,
  intermedio: 3,
  medio_dificil: 4,
  dificil: 5,
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  facil: 'Fácil',
  medio_facil: 'Medio fácil',
  intermedio: 'Intermedio',
  medio_dificil: 'Medio difícil',
  dificil: 'Difícil',
};

export const MAX_ROUND_SCORE = 15; // 1+2+3+4+5

export interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  verse: string;
  group?: 'A' | 'B';
  round?: Round;
  difficulty?: Difficulty;
}

export interface Participant {
  name: string;
  group: 'A' | 'B';
  score: number;
  totalTime: number;
  questionsAnswered: number;
  image?: string | null;
}

export interface HelpState {
  statistics: boolean;
  callFriend: boolean;
  askAudience: boolean;
}

export type Screen = 'home' | 'setup' | 'game' | 'results';

export interface ParticipantEntry {
  name: string;
  image: string | null;
}

export interface GameState {
  screen: Screen;
  round: Round;
  groupA: ParticipantEntry[];
  groupB: ParticipantEntry[];
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
  | { type: 'SET_GROUPS'; groupA: ParticipantEntry[]; groupB: ParticipantEntry[]; round: Round }
  | { type: 'START_GAME' }
  | { type: 'START_FINAL'; finalistA: string; finalistB: string }
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
