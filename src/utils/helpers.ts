import type { Question, Round, Difficulty } from './types';
import { DIFFICULTY_ORDER } from './types';

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function pickProgressiveQuestions(
  allQuestions: Question[],
  excludeIndices: number[],
  group?: 'A' | 'B',
  round?: Round
): { questions: Question[]; indices: number[] } {
  const available = allQuestions
    .map((q, i) => ({ question: q, index: i }))
    .filter((item) => !excludeIndices.includes(item.index))
    .filter((item) => !group || item.question.group === group)
    .filter((item) => !round || item.question.round === round);

  const questions: Question[] = [];
  const indices: number[] = [];

  for (const difficulty of DIFFICULTY_ORDER) {
    const matching = available.filter(
      (item) => item.question.difficulty === difficulty && !indices.includes(item.index)
    );

    if (matching.length > 0) {
      const picked = matching[Math.floor(Math.random() * matching.length)];
      questions.push(picked.question);
      indices.push(picked.index);
    }
  }

  return { questions, indices };
}

export function pickRandomQuestions(
  allQuestions: Question[],
  count: number,
  excludeIndices: number[],
  group?: 'A' | 'B',
  round?: Round
): { questions: Question[]; indices: number[] } {
  const available = allQuestions
    .map((q, i) => ({ question: q, index: i }))
    .filter((item) => !excludeIndices.includes(item.index))
    .filter((item) => !group || item.question.group === group)
    .filter((item) => !round || item.question.round === round);

  const shuffled = shuffleArray(available);
  const picked = shuffled.slice(0, count);

  return {
    questions: picked.map((p) => p.question),
    indices: picked.map((p) => p.index),
  };
}

export function generateAudienceResults(correctIndex: number): number[] {
  const results = [0, 0, 0, 0];
  let remaining = 100;

  // Give correct answer between 45-75%
  results[correctIndex] = 45 + Math.floor(Math.random() * 31);
  remaining -= results[correctIndex];

  // Distribute remaining among wrong answers
  const wrongIndices = [0, 1, 2, 3].filter((i) => i !== correctIndex);
  for (let i = 0; i < wrongIndices.length - 1; i++) {
    const share = Math.floor(Math.random() * (remaining + 1));
    results[wrongIndices[i]] = Math.min(share, remaining);
    remaining -= results[wrongIndices[i]];
  }
  results[wrongIndices[wrongIndices.length - 1]] = remaining;

  return results;
}

export function generateFriendSuggestion(correctIndex: number): number {
  // 80% chance of correct answer
  if (Math.random() < 0.8) {
    return correctIndex;
  }
  const wrong = [0, 1, 2, 3].filter((i) => i !== correctIndex);
  return wrong[Math.floor(Math.random() * wrong.length)];
}

export function formatTime(seconds: number): string {
  return `${seconds}s`;
}

export function getPointsForQuestion(question: Question): number {
  const pointsMap: Record<Difficulty, number> = {
    facil: 1,
    medio_facil: 2,
    intermedio: 3,
    medio_dificil: 4,
    dificil: 5,
  };
  return question.difficulty ? pointsMap[question.difficulty] : 1;
}
