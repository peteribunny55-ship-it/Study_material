import { getStadium, type LightingCondition, type MatchState, type PitchCondition, type SavePayload, type Team, type WeatherCondition } from './matchEngine';

const STORAGE_KEY = 'ultra-cricket-ai-save';

function normalizeTeam(team: Partial<Team> | null | undefined, fallbackName: string): Team {
  const colors: [string, string] = Array.isArray(team?.colors) && team.colors.length >= 2
    ? [team.colors[0], team.colors[1]]
    : ['#1d4ed8', '#facc15'];
  return {
    name: team?.name ?? fallbackName,
    shortName: team?.shortName ?? fallbackName.slice(0, 3).toUpperCase(),
    rating: team?.rating ?? 85,
    colors,
    captain: team?.captain ?? 'Captain',
    roster: Array.isArray(team?.roster) && team.roster.length ? team.roster : [fallbackName],
  };
}

export function saveGame(payload: SavePayload) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function loadGame(): SavePayload | null {
  if (typeof window === 'undefined') return null;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as SavePayload;
    if (!parsed?.match) return null;

    const battingTeam = normalizeTeam(parsed.match.battingTeam, 'India');
    const bowlingTeam = normalizeTeam(parsed.match.bowlingTeam, 'Australia');
    const format = parsed.match.format ?? 't20';
    const stadium = getStadium(parsed.match.stadium?.id ?? 'eden-gardens');
    const weather: WeatherCondition = ['sunny', 'cloudy', 'windy'].includes(parsed.match.weather) ? parsed.match.weather : 'sunny';
    const lighting: LightingCondition = parsed.match.lighting === 'day' ? 'day' : 'night';
    const pitchCondition: PitchCondition = ['balanced', 'green', 'dry'].includes(parsed.match.pitchCondition) ? parsed.match.pitchCondition : 'balanced';
    const isLegacyMatch = !Array.isArray(parsed.match.inningsScores);
    const innings = isLegacyMatch ? 2 : parsed.match.innings ?? 1;
    const inningsScores = parsed.match.inningsScores
      ?? (isLegacyMatch ? [Math.max(0, (parsed.match.target ?? 1) - 1)] : []);
    const batterStats = parsed.match.batterStats
      ?? battingTeam.roster.map((name: string, index: number) => ({
        name,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        entered: index < 2,
        dismissed: false,
        dismissal: 'not out',
      }));
    const bowlerName = parsed.match.bowlerName ?? bowlingTeam.roster[0] ?? bowlingTeam.captain;
    const bowlerFigures = parsed.match.bowlerFigures
      ?? [{ name: bowlerName, balls: 0, runsConceded: 0, wickets: 0 }];

    return {
      ...parsed,
      match: {
        ...parsed.match,
        format,
        stadium,
        weather,
        lighting,
        pitchCondition,
        maxOvers: parsed.match.maxOvers !== undefined
          ? parsed.match.maxOvers
          : format === 'test' ? null : format === 'odi' ? 50 : format === 't20' ? 20 : format === 't10' ? 10 : 10,
        innings,
        inningsScores,
        batterStats,
        bowlerFigures,
        inningsScorecards: parsed.match.inningsScorecards ?? [],
        target: isLegacyMatch ? parsed.match.target ?? 176 : parsed.match.target,
        battingTeam,
        bowlingTeam,
        playerName: parsed.match.playerName ?? battingTeam.roster[0] ?? battingTeam.captain,
        nonStrikerName: parsed.match.nonStrikerName ?? battingTeam.roster[1] ?? parsed.match.playerName ?? battingTeam.captain,
        bowlerName,
      },
    };
  } catch {
    return null;
  }
}

export function clearSave() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function updateCurrentSave(match: MatchState) {
  const previous = loadGame();
  saveGame({
    match,
    lastSaved: previous?.lastSaved ?? Date.now(),
  });
}
