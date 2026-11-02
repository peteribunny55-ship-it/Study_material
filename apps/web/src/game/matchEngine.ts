export type ShotType = 'defensive' | 'cover' | 'straight' | 'pull' | 'hook' | 'cut' | 'sweep' | 'reverse-sweep' | 'loft';
export type MatchMode = 'quick' | 'career' | 'tournament' | 'practice' | 'challenge';
export type MatchFormat = 't10' | 't20' | 'odi' | 'test' | 'custom';
export type DeliveryType = 'yorker' | 'bouncer' | 'inswing' | 'outswing' | 'offspin' | 'full-toss' | 'slower-ball' | 'waiting';
export type WeatherCondition = 'sunny' | 'cloudy' | 'windy';
export type LightingCondition = 'day' | 'night';
export type PitchCondition = 'balanced' | 'green' | 'dry';

export interface Stadium {
  id: string;
  name: string;
  location: string;
  boundaryX: number;
  boundaryZ: number;
}

export const STADIUMS: Stadium[] = [
  { id: 'eden-gardens', name: 'Eden Gardens', location: 'Kolkata', boundaryX: 22.8, boundaryZ: 21.4 },
  { id: 'melbourne', name: 'Melbourne Cricket Ground', location: 'Melbourne', boundaryX: 25.2, boundaryZ: 24.5 },
  { id: 'lords', name: "Lord's Cricket Ground", location: 'London', boundaryX: 22.1, boundaryZ: 23.8 },
];

export function getStadium(stadiumId: string): Stadium {
  return STADIUMS.find((stadium) => stadium.id === stadiumId) ?? STADIUMS[0];
}

export interface Team {
  name: string;
  shortName: string;
  rating: number;
  colors: [string, string];
  captain: string;
  roster: string[];
}

export interface BatterInningsStats {
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  entered: boolean;
  dismissed: boolean;
  dismissal: string;
}

export interface BowlerFigures {
  name: string;
  balls: number;
  runsConceded: number;
  wickets: number;
}

export interface InningsScorecard {
  innings: number;
  battingTeamName: string;
  score: number;
  wickets: number;
  overs: number;
  ballsInOver: number;
  batters: BatterInningsStats[];
  bowlers: BowlerFigures[];
}

export const REAL_TEAMS: Team[] = [
  {
    name: 'India',
    shortName: 'IND',
    rating: 92,
    colors: ['#1d4ed8', '#facc15'],
    captain: 'Rohit Sharma',
    roster: ['Rohit Sharma', 'Shubman Gill', 'Virat Kohli', 'KL Rahul', 'Suryakumar Yadav', 'Hardik Pandya', 'Ravindra Jadeja', 'Rishabh Pant', 'Mohammed Siraj', 'Jasprit Bumrah', 'Kuldeep Yadav'],
  },
  {
    name: 'Australia',
    shortName: 'AUS',
    rating: 90,
    colors: ['#0b132b', '#eab308'],
    captain: 'Pat Cummins',
    roster: ['Travis Head', 'David Warner', 'Steve Smith', 'Marnus Labuschagne', 'Glenn Maxwell', 'Marcus Stoinis', 'Josh Inglis', 'Pat Cummins', 'Mitchell Starc', 'Adam Zampa', 'Josh Hazlewood'],
  },
  {
    name: 'England',
    shortName: 'ENG',
    rating: 89,
    colors: ['#1b4d7a', '#f8d45c'],
    captain: 'Jos Buttler',
    roster: ['Jos Buttler', 'Phil Salt', 'Ben Duckett', 'Joe Root', 'Harry Brook', 'Liam Livingstone', 'Moeen Ali', 'Sam Curran', 'Jofra Archer', 'Adil Rashid', 'Mark Wood'],
  },
  {
    name: 'New Zealand',
    shortName: 'NZ',
    rating: 88,
    colors: ['#000000', '#ffffff'],
    captain: 'Kane Williamson',
    roster: ['Rachin Ravindra', 'Devon Conway', 'Kane Williamson', 'Daryl Mitchell', 'Tom Latham', 'Glenn Phillips', 'Mitchell Santner', 'Lockie Ferguson', 'Trent Boult', 'Matt Henry', 'Tim Southee'],
  },
  {
    name: 'South Africa',
    shortName: 'SA',
    rating: 88,
    colors: ['#0d3b66', '#f7d154'],
    captain: 'Temba Bavuma',
    roster: ['Quinton de Kock', 'Temba Bavuma', 'Rassie van der Dussen', 'Aiden Markram', 'David Miller', 'Marco Jansen', 'Gerald Coetzee', 'Keshav Maharaj', 'Tabraiz Shamsi', 'Kagiso Rabada', 'Anrich Nortje'],
  },
  {
    name: 'Pakistan',
    shortName: 'PAK',
    rating: 87,
    colors: ['#0b4e7a', '#d5ad48'],
    captain: 'Babar Azam',
    roster: ['Babar Azam', 'Mohammad Rizwan', 'Saim Ayub', 'Usman Khan', 'Iftikhar Ahmed', 'Shadab Khan', 'Shaheen Afridi', 'Haris Rauf', 'Naseem Shah', 'Imad Wasim', 'Mohammad Nawaz'],
  },
  {
    name: 'Sri Lanka',
    shortName: 'SL',
    rating: 84,
    colors: ['#f4c430', '#1c3d73'],
    captain: 'Charith Asalanka',
    roster: ['Pathum Nissanka', 'Kusal Mendis', 'Sadeera Samarawickrama', 'Charith Asalanka', 'Kamindu Mendis', 'Dasun Shanaka', 'Wanindu Hasaranga', 'Maheesh Theekshana', 'Dilshan Madushanka', 'Matheesha Pathirana', 'Dushmantha Chameera'],
  },
  {
    name: 'Afghanistan',
    shortName: 'AFG',
    rating: 82,
    colors: ['#d32027', '#000000'],
    captain: 'Rashid Khan',
    roster: ['Rahmanullah Gurbaz', 'Ibrahim Zadran', 'Riaz Hassan', 'Najibullah Zadran', 'Mohammad Nabi', 'Azmatullah Omarzai', 'Gulbadin Naib', 'Mujeeb Ur Rahman', 'Rashid Khan', 'Naveen-ul-Haq', 'Noor Ahmad'],
  },
  {
    name: 'Bangladesh',
    shortName: 'BAN',
    rating: 81,
    colors: ['#1f5d39', '#f5d742'],
    captain: 'Najmul Hossain Shanto',
    roster: ['Litton Das', 'Najmul Hossain Shanto', 'Shakib Al Hasan', 'Towhid Hridoy', 'Mahmudullah', 'Mehidy Hasan Miraz', 'Taskin Ahmed', 'Mustafizur Rahman', 'Tanzid Hasan', 'Nasum Ahmed', 'Shoriful Islam'],
  },
  {
    name: 'West Indies',
    shortName: 'WI',
    rating: 79,
    colors: ['#7f1d1d', '#facc15'],
    captain: 'Shai Hope',
    roster: ['Shai Hope', 'Brandon King', 'Nicholas Pooran', 'Rovman Powell', 'Shimron Hetmyer', 'Andre Russell', 'Roston Chase', 'Jason Holder', 'Alzarri Joseph', 'Gudakesh Motie', 'Akeal Hosein'],
  },
];

export function getTeamByName(teamName: string): Team {
  const normalized = teamName.trim().toLowerCase();
  const team = REAL_TEAMS.find((candidate) => {
    return candidate.name.toLowerCase() === normalized || candidate.shortName.toLowerCase() === normalized;
  });

  return team ?? REAL_TEAMS[0];
}

export interface MatchState {
  mode: MatchMode;
  format: MatchFormat;
  stadium: Stadium;
  weather: WeatherCondition;
  lighting: LightingCondition;
  pitchCondition: PitchCondition;
  maxOvers: number | null;
  battingTeam: Team;
  bowlingTeam: Team;
  score: number;
  wickets: number;
  overs: number;
  ballsInOver: number;
  target: number | null;
  innings: number;
  inningsScores: number[];
  batterStats: BatterInningsStats[];
  bowlerFigures: BowlerFigures[];
  inningsScorecards: InningsScorecard[];
  ballInPlay: boolean;
  lastBallRuns: number;
  lastBallType: string;
  deliveryType: DeliveryType;
  lastCommentary: string;
  selectedShot: ShotType;
  playerName: string;
  nonStrikerName: string;
  bowlerName: string;
  requiredRunRate: number;
  currentRunRate: number;
  result: string;
  ballPosition: [number, number, number];
}

export interface SavePayload {
  match: MatchState;
  lastSaved: number;
}

export interface MatchSetupOptions {
  stadiumId?: string;
  weather?: WeatherCondition;
  lighting?: LightingCondition;
  pitchCondition?: PitchCondition;
  customOvers?: number;
}

export function createInitialMatch(
  mode: MatchMode,
  battingTeamName = 'India',
  bowlingTeamName = 'Australia',
  format: MatchFormat = 't20',
  options: MatchSetupOptions = {},
): MatchState {
  let battingTeam = getTeamByName(battingTeamName);
  let bowlingTeam = getTeamByName(bowlingTeamName);

  if (battingTeam.name === bowlingTeam.name) {
    const fallback = REAL_TEAMS.find((team) => team.name !== battingTeam.name) ?? REAL_TEAMS[1];
    bowlingTeam = fallback;
  }

  const opener = battingTeam.roster[0] ?? battingTeam.captain;
  const bowler = bowlingTeam.roster[Math.max(0, bowlingTeam.roster.length - 2)] ?? bowlingTeam.captain;
  const requestedCustomOvers = Number.isFinite(options.customOvers) ? Math.floor(options.customOvers!) : 10;
  const customOvers = Math.min(50, Math.max(1, requestedCustomOvers));
  const maxOvers = format === 't10' ? 10 : format === 't20' ? 20 : format === 'odi' ? 50 : format === 'custom' ? customOvers : null;

  return {
    mode,
    format,
    stadium: getStadium(options.stadiumId ?? STADIUMS[0].id),
    weather: options.weather ?? 'sunny',
    lighting: options.lighting ?? 'night',
    pitchCondition: options.pitchCondition ?? 'balanced',
    maxOvers,
    battingTeam,
    bowlingTeam,
    score: 0,
    wickets: 0,
    overs: 0,
    ballsInOver: 0,
    target: null,
    innings: 1,
    inningsScores: [],
    batterStats: battingTeam.roster.map((name, index) => createBatterStats(name, index < 2)),
    bowlerFigures: [createBowlerFigures(bowler)],
    inningsScorecards: [],
    ballInPlay: false,
    lastBallRuns: 0,
    lastBallType: 'Waiting for delivery',
    deliveryType: 'waiting',
    lastCommentary: `${opener} walks in. The crowd rises as ${battingTeam.name} start the chase against ${bowlingTeam.name}.`,
    selectedShot: 'defensive',
    playerName: opener,
    nonStrikerName: battingTeam.roster[1] ?? opener,
    bowlerName: bowler,
    requiredRunRate: 0,
    currentRunRate: 0,
    result: 'In play',
    ballPosition: [0, 1.2, 10],
  };
}

function createBatterStats(name: string, entered = false): BatterInningsStats {
  return { name, runs: 0, balls: 0, fours: 0, sixes: 0, entered, dismissed: false, dismissal: 'not out' };
}

function createBowlerFigures(name: string): BowlerFigures {
  return { name, balls: 0, runsConceded: 0, wickets: 0 };
}

export function formatOvers(overs: number, ballsInOver: number) {
  return `${Math.floor(overs)}.${ballsInOver}`;
}

export function getFormatLabel(format: MatchFormat, customOvers = 10) {
  if (format === 't10') return 'T10 · 10 OVERS';
  if (format === 't20') return 'T20 · 20 OVERS';
  if (format === 'odi') return 'ODI · 50 OVERS';
  if (format === 'custom') return `CUSTOM · ${customOvers} OVERS`;
  return 'TEST · 4 INNINGS';
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getShotProfile(shot: ShotType) {
  const profiles: Record<ShotType, { power: number; risk: number; labels: string[] }> = {
    defensive: { power: 0.42, risk: 0.15, labels: ['Defensive shot', 'block'] },
    cover: { power: 0.7, risk: 0.28, labels: ['Cover drive', 'drive'] },
    straight: { power: 0.72, risk: 0.24, labels: ['Straight drive', 'drive'] },
    pull: { power: 0.8, risk: 0.35, labels: ['Pull shot', 'pull'] },
    hook: { power: 0.84, risk: 0.43, labels: ['Hook shot', 'hook'] },
    cut: { power: 0.68, risk: 0.26, labels: ['Cut shot', 'cut'] },
    sweep: { power: 0.66, risk: 0.22, labels: ['Sweep shot', 'sweep'] },
    'reverse-sweep': { power: 0.7, risk: 0.39, labels: ['Reverse sweep', 'reverse sweep'] },
    loft: { power: 0.9, risk: 0.45, labels: ['Lofted drive', 'lofted shot'] },
  };

  return profiles[shot];
}

function selectDeliveryType(randomFn: () => number): DeliveryType {
  const options: DeliveryType[] = ['yorker', 'bouncer', 'inswing', 'outswing', 'offspin', 'full-toss', 'slower-ball'];
  const index = Math.min(options.length - 1, Math.floor(randomFn() * options.length));
  return options[index];
}

export function getDeliveryModifier(deliveryType: DeliveryType, match?: MatchState) {
  const map: Record<DeliveryType, number> = {
    yorker: -0.12,
    bouncer: -0.05,
    inswing: 0.08,
    outswing: 0.04,
    offspin: 0.02,
    'full-toss': 0.14,
    'slower-ball': -0.08,
    waiting: 0,
  };

  const swingDelivery = deliveryType === 'inswing' || deliveryType === 'outswing';
  const seamDelivery = swingDelivery || deliveryType === 'yorker' || deliveryType === 'bouncer';
  const spinDelivery = deliveryType === 'offspin';
  const conditionModifier = match?.weather === 'cloudy' && swingDelivery
    ? 0.06
    : match?.pitchCondition === 'green' && seamDelivery
      ? 0.06
      : match?.pitchCondition === 'dry' && spinDelivery
        ? 0.08
        : 0;
  return (map[deliveryType] ?? 0) + conditionModifier;
}

export function simulateBall(
  current: MatchState,
  shot: ShotType,
  phase: 'batting' | 'bowling',
  randomFn: () => number = Math.random,
  deliveryOverride?: DeliveryType,
): MatchState {
  const ballsBowled = current.overs * 6 + current.ballsInOver;
  const inningsAlreadyEnded = current.result === 'Match won'
    || current.result === 'Match lost'
    || current.result === 'Match drawn'
    || current.result === 'Match tied'
    || current.result === 'Innings complete'
    || current.result === 'Innings break';
  const oversLimitReached = current.mode !== 'practice'
    && current.maxOvers !== null
    && ballsBowled >= current.maxOvers * 6;
  if (inningsAlreadyEnded || current.wickets >= 10 || oversLimitReached) {
    return {
      ...current,
      ballInPlay: false,
      lastCommentary: inningsAlreadyEnded
        ? current.lastCommentary
        : current.wickets >= 10
          ? 'The innings is complete. The team is all out.'
          : 'The innings is complete. No more deliveries can be bowled.',
    };
  }

  const profile = getShotProfile(shot);
  const deliveryType = deliveryOverride && deliveryOverride !== 'waiting'
    ? deliveryOverride
    : selectDeliveryType(randomFn);
  const riskRoll = randomFn();
  const powerRoll = randomFn();
  let runs = 0;
  let wicket = false;
  let commentary = 'The bowler gets the release away.';

  if (phase === 'batting') {
    const deliveryImpact = getDeliveryModifier(deliveryType, current);
    const quality = clamp(0.36 + profile.power * 0.7 - profile.risk * 0.65 + deliveryImpact + randomFn() * 0.22, 0, 1);
    const wicketChance = clamp((1 - quality) * 0.34 + profile.risk * 0.22 + (deliveryType === 'yorker' ? 0.08 : 0) + (deliveryType === 'bouncer' ? 0.04 : 0), 0, 0.82);

    if (riskRoll < wicketChance) {
      wicket = true;
      runs = 0;
      commentary = `${current.playerName} tries the ${profile.labels[0].toLowerCase()} against a ${deliveryType} and loses the wicket.`;
    } else if (powerRoll < 0.12) {
      runs = 0;
      commentary = `${current.playerName} is beaten by the ${deliveryType}. Dot ball.`;
    } else if (quality > 0.86) {
      runs = randomFn() < 0.38 ? 6 : 4;
      commentary = runs === 6
        ? `${current.playerName} picks the ${deliveryType} and launches it for six!`
        : `${current.playerName} times the ${deliveryType} beautifully and finds the boundary.`;
    } else if (quality > 0.68) {
      runs = randomFn() < 0.7 ? 2 : 1;
      commentary = `${current.playerName} handles the ${deliveryType} with control and runs hard for ${runs}.`;
    } else if (quality > 0.5) {
      runs = 1;
      commentary = `${current.playerName} nudges the ${deliveryType} into space for a single.`;
    } else {
      runs = 0;
      commentary = `${current.playerName} defends the ${deliveryType} well. Dot ball.`;
    }
  } else {
    const bowlingControl = clamp(0.5 + getDeliveryModifier(deliveryType, current) + randomFn() * 0.32, 0, 1);
    const wicketSpin = clamp((1.2 - bowlingControl) * 0.46 + (deliveryType === 'outswing' ? 0.06 : 0), 0.08, 0.7);

    if (riskRoll < wicketSpin) {
      wicket = true;
      runs = 0;
      commentary = `${current.bowlerName} lands a threatening ${deliveryType}. ${current.playerName} is beaten and stumps are rattled.`;
    } else if (powerRoll < 0.18) {
      runs = 1;
      commentary = `${current.bowlerName} bowls a loose ${deliveryType} and gives away a single.`;
    } else if (powerRoll < 0.4) {
      runs = 2;
      commentary = `${current.bowlerName} drifts with the ${deliveryType} and concedes a couple.`;
    } else if (powerRoll < 0.58) {
      runs = 4;
      commentary = `${current.bowlerName} is punished for the ${deliveryType} as the boundary is struck.`;
    } else if (powerRoll < 0.7) {
      runs = 6;
      commentary = `${current.bowlerName} loses control of the ${deliveryType} and a maximum follows.`;
    } else {
      runs = 0;
      commentary = `${current.bowlerName} keeps it tight with the ${deliveryType}. Dot ball.`;
    }
  }

  const nextScore = current.score + runs;
  const nextWickets = wicket ? current.wickets + 1 : current.wickets;
  const nextBalls = current.ballsInOver + 1;
  const normalizedBalls = nextBalls % 6;
  const scoredOvers = current.overs + Math.floor(nextBalls / 6);
  const totalBalls = scoredOvers * 6 + normalizedBalls;
  const runRate = nextScore / Math.max(1 / 6, totalBalls / 6);
  const ballsRemaining = current.maxOvers === null
    ? 0
    : Math.max(0, current.maxOvers * 6 - totalBalls);
  const requiredRunRate = current.target
    ? ballsRemaining > 0
      ? Math.max(0, ((current.target - nextScore) / ballsRemaining) * 6)
      : 0
    : 0;

  let nextStriker = current.playerName;
  let nextNonStriker = current.nonStrikerName;
  if (wicket) {
    nextStriker = current.battingTeam.roster[nextWickets + 1] ?? current.playerName;
  }
  if (runs % 2 === 1 || (normalizedBalls === 0 && totalBalls > 0)) {
    [nextStriker, nextNonStriker] = [nextNonStriker, nextStriker];
  }

  let nextTarget = current.target;
  if (current.target && nextScore >= current.target) {
    nextTarget = current.target;
  }

  const batterStats = current.batterStats.map((batter) => ({ ...batter }));
  let strikerStats = batterStats.find((batter) => batter.name === current.playerName);
  if (!strikerStats) {
    strikerStats = createBatterStats(current.playerName, true);
    batterStats.push(strikerStats);
  }
  strikerStats.balls += 1;
  strikerStats.runs += runs;
  if (runs === 4) strikerStats.fours += 1;
  if (runs === 6) strikerStats.sixes += 1;
  if (wicket) {
    strikerStats.dismissed = true;
    strikerStats.dismissal = phase === 'bowling' ? 'bowled' : 'caught';
  }

  if (!batterStats.some((batter) => batter.name === nextStriker)) {
    batterStats.push(createBatterStats(nextStriker, true));
  }
  if (!batterStats.some((batter) => batter.name === nextNonStriker)) {
    batterStats.push(createBatterStats(nextNonStriker, true));
  }

  const bowlerFigures = current.bowlerFigures.map((bowler) => ({ ...bowler }));
  let activeBowler = bowlerFigures.find((bowler) => bowler.name === current.bowlerName);
  if (!activeBowler) {
    activeBowler = createBowlerFigures(current.bowlerName);
    bowlerFigures.push(activeBowler);
  }
  activeBowler.balls += 1;
  activeBowler.runsConceded += runs;
  if (wicket) activeBowler.wickets += 1;
  const nextBowlerName = normalizedBalls === 0
    ? getNextBowler(current.bowlingTeam, current.bowlerName)
    : current.bowlerName;

  const resultingState: MatchState = {
    ...current,
    score: nextScore,
    wickets: nextWickets,
    overs: scoredOvers,
    ballsInOver: normalizedBalls,
    currentRunRate: Number(runRate.toFixed(2)),
    requiredRunRate: Number(requiredRunRate.toFixed(2)),
    target: nextTarget,
    batterStats,
    bowlerFigures,
    bowlerName: nextBowlerName,
    lastBallRuns: runs,
    lastBallType: wicket ? 'Wicket' : runs === 4 ? 'Four' : runs === 6 ? 'Six' : runs === 0 ? 'Dot' : 'Runs',
    deliveryType,
    lastCommentary: commentary,
    selectedShot: shot,
    playerName: nextStriker,
    nonStrikerName: nextNonStriker,
    ballInPlay: true,
    ballPosition: [0, 1.4, 10],
    result: wicket ? 'Wicket' : runs >= 4 ? 'Boundary' : 'In play',
  };

  const chaseComplete = current.target !== null && nextScore >= current.target;
  const inningsComplete = nextWickets >= 10 || (current.maxOvers !== null && totalBalls >= current.maxOvers * 6);
  const completedScores = current.inningsScores.slice();
  completedScores[current.innings - 1] = nextScore;

  if (chaseComplete && (current.format !== 'test' || current.innings === 4)) {
    return {
      ...resultingState,
      inningsScores: completedScores,
      result: 'Match won',
      inningsScorecards: [...resultingState.inningsScorecards, createInningsScorecard(resultingState)],
      lastCommentary: `${current.battingTeam.name} complete the chase and win by ${10 - nextWickets} wickets.`,
      ballInPlay: false,
    };
  }

  if (inningsComplete && current.mode !== 'practice') {
    if (current.format !== 'test' && current.innings === 1) {
      return advanceLimitedOversInnings(resultingState, completedScores);
    }

    if (current.format === 'test' && current.innings < 4) {
      return advanceTestInnings(resultingState, completedScores);
    }

    if (current.format === 'test') {
      const firstTeamTotal = completedScores[0] + completedScores[2];
      const secondTeamTotal = completedScores[1] + completedScores[3];
      const isTied = firstTeamTotal === secondTeamTotal;
      const battingTeamWon = secondTeamTotal > firstTeamTotal;
      const winner = battingTeamWon ? current.battingTeam.name : current.bowlingTeam.name;
      const margin = Math.abs(firstTeamTotal - secondTeamTotal);
      return {
        ...resultingState,
        inningsScores: completedScores,
        inningsScorecards: [...resultingState.inningsScorecards, createInningsScorecard(resultingState)],
        result: isTied ? 'Match tied' : battingTeamWon ? 'Match won' : 'Match lost',
        lastCommentary: isTied
          ? 'All four innings are complete. The Test match is tied.'
          : `${winner} win the Test by ${margin} runs.`,
        ballInPlay: false,
      };
    }

    const firstInningsScore = completedScores[0] ?? 0;
    const won = nextScore >= firstInningsScore + 1;
    const tied = nextScore === firstInningsScore;
    return {
      ...resultingState,
      inningsScores: completedScores,
      inningsScorecards: [...resultingState.inningsScorecards, createInningsScorecard(resultingState)],
      result: won ? 'Match won' : tied ? 'Match tied' : 'Match lost',
      lastCommentary: won
        ? `${current.battingTeam.name} win by ${10 - nextWickets} wickets.`
        : tied
          ? 'Both teams finish level. The match is tied.'
        : `${current.bowlingTeam.name} win by ${firstInningsScore - nextScore} runs.`,
      ballInPlay: false,
    };
  }

  if (inningsComplete && current.mode === 'practice') {
    return {
      ...resultingState,
      inningsScores: completedScores,
      inningsScorecards: [...resultingState.inningsScorecards, createInningsScorecard(resultingState)],
      result: 'Innings complete',
      lastCommentary: `${current.battingTeam.name} finish practice on ${nextScore}/${nextWickets}.`,
      ballInPlay: false,
    };
  }

  return {
    ...resultingState,
    ballInPlay: true,
  };
}

function advanceLimitedOversInnings(current: MatchState, inningsScores: number[]): MatchState {
  const battingTeam = current.bowlingTeam;
  const bowlingTeam = current.battingTeam;
  const completedScorecards = [...current.inningsScorecards, createInningsScorecard(current)];
  const firstInningsScore = inningsScores[0] ?? 0;
  const chased = current.score > firstInningsScore;
  return {
    ...current,
    battingTeam,
    bowlingTeam,
    score: 0,
    wickets: 0,
    overs: 0,
    ballsInOver: 0,
    innings: 2,
    inningsScores,
    inningsScorecards: completedScorecards,
    target: (inningsScores[0] ?? 0) + 1,
    currentRunRate: 0,
    requiredRunRate: current.maxOvers === null
      ? 0
      : Number((((inningsScores[0] ?? 0) + 1) / current.maxOvers).toFixed(2)),
    playerName: battingTeam.roster[0] ?? battingTeam.captain,
    nonStrikerName: battingTeam.roster[1] ?? battingTeam.captain,
    bowlerName: bowlingTeam.roster[Math.max(0, bowlingTeam.roster.length - 2)] ?? bowlingTeam.captain,
    batterStats: battingTeam.roster.map((name, index) => createBatterStats(name, index < 2)),
    bowlerFigures: [createBowlerFigures(bowlingTeam.roster[Math.max(0, bowlingTeam.roster.length - 2)] ?? bowlingTeam.captain)],
    result: chased ? 'Match won' : 'Innings break',
    lastBallType: 'Innings break',
    lastCommentary: chased
      ? `${battingTeam.name} win by ${10 - current.wickets} wickets.`
      : `${battingTeam.name} begin their chase. Target: ${(inningsScores[0] ?? 0) + 1}.`,
    ballInPlay: false,
    ballPosition: [0, 1.2, 10],
  };
}

function advanceTestInnings(current: MatchState, inningsScores: number[]): MatchState {
  const battingTeam = current.bowlingTeam;
  const bowlingTeam = current.battingTeam;
  const completedScorecards = [...current.inningsScorecards, createInningsScorecard(current)];
  const innings = current.innings + 1;
  const firstSideTotal = (inningsScores[0] ?? 0) + (inningsScores[2] ?? 0);
  const secondSideFirstInnings = inningsScores[1] ?? 0;
  const target = innings === 4
    ? firstSideTotal - secondSideFirstInnings + 1
    : null;
  if (innings === 4 && firstSideTotal <= secondSideFirstInnings) {
    const margin = secondSideFirstInnings - firstSideTotal;
    return {
      ...current,
      inningsScores,
      inningsScorecards: completedScorecards,
      result: 'Match lost',
      lastCommentary: `${current.bowlingTeam.name} win by an innings${margin > 0 ? ` and ${margin} runs` : ''}.`,
      ballInPlay: false,
    };
  }
  return {
    ...current,
    battingTeam,
    bowlingTeam,
    score: 0,
    wickets: 0,
    overs: 0,
    ballsInOver: 0,
    innings,
    inningsScores,
    inningsScorecards: completedScorecards,
    target: target === null ? null : Math.max(1, target),
    currentRunRate: 0,
    requiredRunRate: 0,
    playerName: battingTeam.roster[0] ?? battingTeam.captain,
    nonStrikerName: battingTeam.roster[1] ?? battingTeam.captain,
    bowlerName: bowlingTeam.roster[Math.max(0, bowlingTeam.roster.length - 2)] ?? bowlingTeam.captain,
    batterStats: battingTeam.roster.map((name, index) => createBatterStats(name, index < 2)),
    bowlerFigures: [createBowlerFigures(bowlingTeam.roster[Math.max(0, bowlingTeam.roster.length - 2)] ?? bowlingTeam.captain)],
    result: 'Innings break',
    lastBallType: 'Innings break',
    lastCommentary: innings === 4
      ? `${battingTeam.name} need ${Math.max(1, target ?? 1)} to win in the fourth innings.`
      : `The third innings begins. ${battingTeam.name} take the crease.`,
    ballInPlay: false,
    ballPosition: [0, 1.2, 10],
  };
}

function getNextBowler(team: Team, currentBowler: string): string {
  const currentIndex = team.roster.indexOf(currentBowler);
  const nextIndex = currentIndex < 0 ? team.roster.length - 2 : (currentIndex + 1) % team.roster.length;
  return team.roster[nextIndex] ?? team.captain;
}

function createInningsScorecard(match: MatchState): InningsScorecard {
  return {
    innings: match.innings,
    battingTeamName: match.battingTeam.name,
    score: match.score,
    wickets: match.wickets,
    overs: match.overs,
    ballsInOver: match.ballsInOver,
    batters: match.batterStats.map((batter) => ({ ...batter })),
    bowlers: match.bowlerFigures.map((bowler) => ({ ...bowler })),
  };
}
