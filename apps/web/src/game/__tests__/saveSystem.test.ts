import { afterEach, describe, expect, it } from 'vitest';
import { createInitialMatch } from '../matchEngine';
import { loadGame } from '../saveSystem';

const STORAGE_KEY = 'ultra-cricket-ai-save';

afterEach(() => {
  window.localStorage.removeItem(STORAGE_KEY);
});

describe('saved match compatibility', () => {
  it('restores legacy limited-overs saves as an active chase', () => {
    const {
      format: _format,
      maxOvers: _maxOvers,
      inningsScores: _inningsScores,
      ...legacyMatch
    } = createInitialMatch('quick');

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
      match: { ...legacyMatch, target: 176, score: 42, overs: 5, ballsInOver: 2 },
      lastSaved: Date.now(),
    }));

    const saved = loadGame();
    expect(saved?.match.format).toBe('t20');
    expect(saved?.match.maxOvers).toBe(20);
    expect(saved?.match.innings).toBe(2);
    expect(saved?.match.inningsScores).toEqual([175]);
    expect(saved?.match.score).toBe(42);
    expect(saved?.match.target).toBe(176);
    expect(saved?.match.stadium.id).toBe('eden-gardens');
    expect(saved?.match.weather).toBe('sunny');
    expect(saved?.match.lighting).toBe('night');
    expect(saved?.match.pitchCondition).toBe('balanced');
  });
});
