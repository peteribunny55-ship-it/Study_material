export type ShotType = 'defensive' | 'cover' | 'pull' | 'sweep' | 'loft';
export type MatchMode = 'quick' | 'career' | 'tournament' | 'practice' | 'challenge';

export interface Team {
  name: string;
  shortName: string;
  rating: number;
}

export interface MatchState {
  mode: MatchMode;
  battingTeam: Team;
  bowlingTeam: Team;
  score: number;
  wickets: number;
  overs: number;
  ballsInOver: number;
  target: number | null;
  innings: number;
  ballInPlay: boolean;
  lastBallRuns: number;
  lastBallType: string;
  lastCommentary: string;
  selectedShot: ShotType;
  playerName: string;
  requiredRunRate: number;
  currentRunRate: number;
  result: string;
  ballPosition: [number, number, number];
}

export function formatOvers(overs: number, ballsInOver: number) {
  return `${Math.floor(overs)}.${ballsInOver}`;
}

export function createInitialMatch(mode: MatchMode): MatchState {
  return {
    mode,
    battingTeam: { name: 'Mumbai Mavericks', shortName: 'MM', rating: 86 },
    bowlingTeam: { name: 'Chennai Chargers', shortName: 'CC', rating: 82 },
    score: 0,
    wickets: 0,
    overs: 0,
    ballsInOver: 0,
    target: 176,
    innings: 1,
    ballInPlay: false,
    lastBallRuns: 0,
    lastBallType: 'Waiting for delivery',
    lastCommentary: 'The innings is underway. Choose a shot and press space.',
    selectedShot: 'defensive',
    playerName: 'Aarav Patel',
    requiredRunRate: 8.8,
    currentRunRate: 0,
    result: 'In play',
    ballPosition: [0, 1.2, 10],
  };
}
