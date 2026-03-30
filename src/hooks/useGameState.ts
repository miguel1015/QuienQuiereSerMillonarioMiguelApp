import { useReducer, useCallback } from 'react';
import type { GameState, GameAction, Participant } from '../utils/types';
import questionsData from '../data/questions.json';
import { pickRandomQuestions, generateAudienceResults, generateFriendSuggestion } from '../utils/helpers';
import type { Question } from '../utils/types';

const allQuestions = questionsData as Question[];
const QUESTIONS_PER_PARTICIPANT = 5;
const TIME_PER_QUESTION = 15;

const initialState: GameState = {
  screen: 'home',
  groupA: [],
  groupB: [],
  participants: [],
  currentParticipantIndex: 0,
  currentQuestionIndex: 0,
  questionsPerParticipant: QUESTIONS_PER_PARTICIPANT,
  usedQuestionIndices: [],
  currentQuestions: [],
  selectedAnswer: null,
  isAnswerRevealed: false,
  timeLeft: TIME_PER_QUESTION,
  helps: { statistics: true, callFriend: true, askAudience: true },
  audienceResults: null,
  friendSuggestion: null,
  isTimerRunning: false,
};

function buildParticipantOrder(groupA: string[], groupB: string[]): Participant[] {
  const participants: Participant[] = [];
  for (const name of groupA) {
    participants.push({ name, group: 'A', score: 0, totalTime: 0, questionsAnswered: 0 });
  }
  for (const name of groupB) {
    participants.push({ name, group: 'B', score: 0, totalTime: 0, questionsAnswered: 0 });
  }
  return participants;
}

function loadQuestionsForParticipant(usedIndices: number[], group: 'A' | 'B'): { questions: Question[]; indices: number[] } {
  return pickRandomQuestions(allQuestions, QUESTIONS_PER_PARTICIPANT, usedIndices, group);
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_SCREEN':
      return { ...state, screen: action.screen };

    case 'SET_GROUPS':
      return { ...state, groupA: action.groupA, groupB: action.groupB };

    case 'START_GAME': {
      const participants = buildParticipantOrder(state.groupA, state.groupB);
      const firstGroup = participants[0].group;
      const { questions, indices } = loadQuestionsForParticipant([], firstGroup);
      return {
        ...state,
        screen: 'game',
        participants,
        currentParticipantIndex: 0,
        currentQuestionIndex: 0,
        usedQuestionIndices: indices,
        currentQuestions: questions,
        selectedAnswer: null,
        isAnswerRevealed: false,
        timeLeft: TIME_PER_QUESTION,
        helps: { statistics: true, callFriend: true, askAudience: true },
        audienceResults: null,
        friendSuggestion: null,
        isTimerRunning: true,
      };
    }

    case 'SELECT_ANSWER':
      if (state.isAnswerRevealed || state.selectedAnswer !== null) return state;
      return {
        ...state,
        selectedAnswer: action.index,
        isTimerRunning: false,
      };

    case 'REVEAL_ANSWER': {
      const currentQ = state.currentQuestions[state.currentQuestionIndex];
      const isCorrect = state.selectedAnswer === currentQ.correct;
      const timeSpent = TIME_PER_QUESTION - state.timeLeft;

      const updatedParticipants = state.participants.map((p, i) => {
        if (i === state.currentParticipantIndex) {
          return {
            ...p,
            score: p.score + (isCorrect ? 1 : 0),
            totalTime: p.totalTime + timeSpent,
            questionsAnswered: p.questionsAnswered + 1,
          };
        }
        return p;
      });

      return {
        ...state,
        isAnswerRevealed: true,
        participants: updatedParticipants,
        isTimerRunning: false,
      };
    }

    case 'NEXT_TURN': {
      const nextQuestionIndex = state.currentQuestionIndex + 1;

      // Still has questions for current participant
      if (nextQuestionIndex < QUESTIONS_PER_PARTICIPANT) {
        return {
          ...state,
          currentQuestionIndex: nextQuestionIndex,
          selectedAnswer: null,
          isAnswerRevealed: false,
          timeLeft: TIME_PER_QUESTION,
          audienceResults: null,
          friendSuggestion: null,
          isTimerRunning: true,
        };
      }

      // Move to next participant
      const nextParticipantIndex = state.currentParticipantIndex + 1;

      // All participants done
      if (nextParticipantIndex >= state.participants.length) {
        return { ...state, screen: 'results', isTimerRunning: false };
      }

      // Load new questions for next participant
      const nextGroup = state.participants[nextParticipantIndex].group;
      const { questions, indices } = loadQuestionsForParticipant(state.usedQuestionIndices, nextGroup);
      return {
        ...state,
        currentParticipantIndex: nextParticipantIndex,
        currentQuestionIndex: 0,
        currentQuestions: questions,
        usedQuestionIndices: [...state.usedQuestionIndices, ...indices],
        selectedAnswer: null,
        isAnswerRevealed: false,
        timeLeft: TIME_PER_QUESTION,
        helps: { statistics: true, callFriend: true, askAudience: true },
        audienceResults: null,
        friendSuggestion: null,
        isTimerRunning: true,
      };
    }

    case 'TICK_TIMER':
      if (state.timeLeft <= 0) return state;
      return { ...state, timeLeft: state.timeLeft - 1 };

    case 'TIME_UP': {
      const timeUpQ = state.currentQuestions[state.currentQuestionIndex];
      const updatedParticipants = state.participants.map((p, i) => {
        if (i === state.currentParticipantIndex) {
          return {
            ...p,
            totalTime: p.totalTime + TIME_PER_QUESTION,
            questionsAnswered: p.questionsAnswered + 1,
          };
        }
        return p;
      });
      void timeUpQ;

      return {
        ...state,
        selectedAnswer: null,
        isAnswerRevealed: true,
        participants: updatedParticipants,
        isTimerRunning: false,
      };
    }

    case 'USE_HELP_STATISTICS':
      return { ...state, helps: { ...state.helps, statistics: false } };

    case 'USE_HELP_FRIEND': {
      const friendQ = state.currentQuestions[state.currentQuestionIndex];
      return {
        ...state,
        helps: { ...state.helps, callFriend: false },
        friendSuggestion: generateFriendSuggestion(friendQ.correct),
      };
    }

    case 'USE_HELP_AUDIENCE': {
      const audQ = state.currentQuestions[state.currentQuestionIndex];
      return {
        ...state,
        helps: { ...state.helps, askAudience: false },
        audienceResults: generateAudienceResults(audQ.correct),
      };
    }

    case 'CLOSE_HELP':
      return { ...state, audienceResults: null, friendSuggestion: null };

    case 'RESET_GAME':
      return { ...initialState };

    default:
      return state;
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const setScreen = useCallback((screen: GameState['screen']) => dispatch({ type: 'SET_SCREEN', screen }), []);
  const setGroups = useCallback((groupA: string[], groupB: string[]) => dispatch({ type: 'SET_GROUPS', groupA, groupB }), []);
  const startGame = useCallback(() => dispatch({ type: 'START_GAME' }), []);
  const selectAnswer = useCallback((index: number) => dispatch({ type: 'SELECT_ANSWER', index }), []);
  const revealAnswer = useCallback(() => dispatch({ type: 'REVEAL_ANSWER' }), []);
  const nextTurn = useCallback(() => dispatch({ type: 'NEXT_TURN' }), []);
  const tickTimer = useCallback(() => dispatch({ type: 'TICK_TIMER' }), []);
  const timeUp = useCallback(() => dispatch({ type: 'TIME_UP' }), []);
  const useHelpStatistics = useCallback(() => dispatch({ type: 'USE_HELP_STATISTICS' }), []);
  const useHelpFriend = useCallback(() => dispatch({ type: 'USE_HELP_FRIEND' }), []);
  const useHelpAudience = useCallback(() => dispatch({ type: 'USE_HELP_AUDIENCE' }), []);
  const closeHelp = useCallback(() => dispatch({ type: 'CLOSE_HELP' }), []);
  const resetGame = useCallback(() => dispatch({ type: 'RESET_GAME' }), []);

  return {
    state,
    setScreen,
    setGroups,
    startGame,
    selectAnswer,
    revealAnswer,
    nextTurn,
    tickTimer,
    timeUp,
    useHelpStatistics,
    useHelpFriend,
    useHelpAudience,
    closeHelp,
    resetGame,
  };
}
