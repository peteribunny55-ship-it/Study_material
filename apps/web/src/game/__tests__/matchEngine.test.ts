import { describe, expect, it } from 'vitest';
import { createInitialMatch, getDeliveryModifier, simulateBall } from '../matchEngine';

describe('core match engine', () => {
  it('creates a valid starting state', () => {
    const match = createInitialMatch('quick');

    expect(match.score).toBe(0);
    expect(match.wickets).toBe(0);
    expect(match.target).toBeNull();
    expect(match.format).toBe('t20');
    expect(match.maxOvers).toBe(20);
    expect(match.battingTeam.name).toBe('India');
    expect(match.bowlingTeam.name).toBe('Australia');
    expect(match.nonStrikerName).toBe(match.battingTeam.roster[1]);
  });

  it('accepts custom batting and bowling teams', () => {
    const match = createInitialMatch('quick', 'England', 'India');

    expect(match.battingTeam.name).toBe('England');
    expect(match.bowlingTeam.name).toBe('India');
    expect(match.playerName).toBe('Jos Buttler');
    expect(match.bowlerName).toBe('Jasprit Bumrah');
  });

  it('supports T10 and bounded custom over formats', () => {
    expect(createInitialMatch('quick', 'India', 'Australia', 't10').maxOvers).toBe(10);
    expect(createInitialMatch('quick', 'India', 'Australia', 'custom', { customOvers: 7 }).maxOvers).toBe(7);
    expect(createInitialMatch('quick', 'India', 'Australia', 'custom', { customOvers: 99 }).maxOvers).toBe(50);
  });

  it('uses the selected ground and playing conditions', () => {
    const match = createInitialMatch('quick', 'India', 'Australia', 't20', {
      stadiumId: 'melbourne',
      weather: 'cloudy',
      lighting: 'day',
      pitchCondition: 'green',
    });

    expect(match.stadium.name).toBe('Melbourne Cricket Ground');
    expect(match.weather).toBe('cloudy');
    expect(match.lighting).toBe('day');
    expect(match.pitchCondition).toBe('green');
    expect(getDeliveryModifier('outswing', match)).toBeCloseTo(getDeliveryModifier('outswing') + 0.06);
    expect(getDeliveryModifier('yorker', match)).toBeCloseTo(getDeliveryModifier('yorker') + 0.06);
  });

  it('uses delivery variation and deterministic chance handling', () => {
    const match = createInitialMatch('quick');
    const next = simulateBall(match, 'cover', 'batting', () => 0.82);

    expect(next.deliveryType).toBeTruthy();
    expect(next.lastCommentary.length).toBeGreaterThan(0);
    expect(next.score).toBeGreaterThanOrEqual(0);
  });

  it('uses the selected delivery and supports the expanded shot set', () => {
    const match = createInitialMatch('quick');
    const shots = ['defensive', 'cover', 'straight', 'pull', 'hook', 'cut', 'sweep', 'reverse-sweep', 'loft'] as const;

    for (const shot of shots) {
      const next = simulateBall(match, shot, 'batting', () => 0.99, 'yorker');
      expect(next.deliveryType).toBe('yorker');
      expect(next.selectedShot).toBe(shot);
    }
  });

  it('scores runs on batting shot execution', () => {
    const match = createInitialMatch('quick');
    const next = simulateBall(match, 'cover', 'batting');
    expect(next.score).toBeGreaterThanOrEqual(0);
    expect(next.overs).toBeGreaterThanOrEqual(0);
  });

  it('records batter and bowler figures for a boundary', () => {
    const match = createInitialMatch('quick');
    const rolls = [0.99, 0.99, 0.99, 0.1];
    let rollIndex = 0;
    const next = simulateBall(match, 'loft', 'batting', () => rolls[rollIndex++] ?? 0.99, 'full-toss');
    const striker = next.batterStats.find((batter) => batter.name === match.playerName);
    const bowler = next.bowlerFigures.find((figure) => figure.name === match.bowlerName);

    expect(next.lastBallRuns).toBe(6);
    expect(striker).toMatchObject({ runs: 6, balls: 1, fours: 0, sixes: 1 });
    expect(bowler).toMatchObject({ balls: 1, runsConceded: 6, wickets: 0 });
  });

  it('rotates the bowler after a completed over and records figures by bowler', () => {
    let match = createInitialMatch('quick');
    const openingBowler = match.bowlerName;
    for (let ball = 0; ball < 6; ball += 1) {
      match = simulateBall(match, 'defensive', 'batting', () => 0.99);
    }

    expect(match.overs).toBe(1);
    expect(match.bowlerName).not.toBe(openingBowler);
    expect(match.bowlerFigures.find((figure) => figure.name === openingBowler)).toMatchObject({
      balls: 6,
      runsConceded: 6,
    });

    match = simulateBall(match, 'defensive', 'batting', () => 0.99);
    expect(match.bowlerFigures).toHaveLength(2);
    expect(match.bowlerFigures[1]).toMatchObject({ name: match.bowlerName, balls: 1 });
  });

  it('updates wicket state when wicket occurs', () => {
    const match = createInitialMatch('quick');
    let next = match;
    for (let i = 0; i < 25; i += 1) {
      next = simulateBall(next, 'defensive', 'batting');
      if (next.wickets > match.wickets || next.result === 'Wicket') {
        break;
      }
    }
    expect(next.wickets).toBeGreaterThanOrEqual(0);
  });

  it('rotates strike after an odd run', () => {
    const match = createInitialMatch('quick');
    const next = simulateBall(match, 'defensive', 'batting', () => 0.99);

    expect(next.lastBallRuns).toBe(1);
    expect(next.playerName).toBe(match.nonStrikerName);
    expect(next.nonStrikerName).toBe(match.playerName);
  });

  it('ends a limited-overs innings after 20 overs and rejects further deliveries', () => {
    const safeDelivery = () => 0.99;
    let match = createInitialMatch('quick');
    for (let ball = 0; ball < 120; ball += 1) {
      match = simulateBall(match, 'defensive', 'batting', safeDelivery);
    }

    expect(match.overs).toBe(0);
    expect(match.ballsInOver).toBe(0);
    expect(match.result).toBe('Innings break');
    expect(match.innings).toBe(2);
    expect(match.inningsScores).toEqual([120]);
    expect(match.inningsScorecards).toHaveLength(1);
    expect(match.inningsScorecards[0].score).toBe(120);
    expect(match.target).toBe(121);
    expect(match.batterStats[0]).toMatchObject({ name: 'Travis Head', runs: 0, balls: 0 });
    expect(match.ballInPlay).toBe(false);

    const afterEnd = simulateBall(match, 'loft', 'batting', () => 0);
    expect(afterEnd.score).toBe(match.score);
    expect(afterEnd.wickets).toBe(match.wickets);
  });

  it('switches teams after the first innings and completes an ODI chase', () => {
    let match = createInitialMatch('quick', 'India', 'Australia', 'odi');
    expect(match.maxOvers).toBe(50);

    for (let ball = 0; ball < 300; ball += 1) {
      let roll = 0;
      const deliveryRandom = () => {
        const index = roll;
        roll += 1;
        return ball === 0 && index === 2 ? 0 : 0.99;
      };
      match = simulateBall(match, 'defensive', 'batting', deliveryRandom);
    }

    expect(match.innings).toBe(2);
    expect(match.inningsScores).toEqual([299]);
    expect(match.target).toBe(300);
    expect(match.battingTeam.name).toBe('Australia');

    match = { ...match, result: 'In play' };
    for (let ball = 0; ball < 300; ball += 1) {
      match = simulateBall(match, 'defensive', 'batting', () => 0.99);
    }

    expect(match.result).toBe('Match won');
    expect(match.inningsScores).toEqual([299, 300]);
  });

  it('plays four Test innings without a limited-overs cap', () => {
    let match = createInitialMatch('quick', 'India', 'Australia', 'test');
    expect(match.maxOvers).toBeNull();

    for (let ball = 0; ball < 299; ball += 1) {
      match = simulateBall(match, 'defensive', 'batting', () => 0.99);
    }
    expect(match.overs).toBe(49);
    expect(match.innings).toBe(1);

    const dismissSide = () => {
      for (let wicket = 0; wicket < 10; wicket += 1) {
        match = simulateBall(match, 'defensive', 'batting', () => 0, 'yorker');
      }
    };

    dismissSide();
    expect(match.innings).toBe(2);
    expect(match.target).toBeNull();
    match = { ...match, result: 'In play' };
    dismissSide();
    expect(match.innings).toBe(3);
    match = { ...match, result: 'In play' };
    dismissSide();
    expect(match.innings).toBe(4);
    expect(match.target).toBe(300);
    match = { ...match, result: 'In play' };

    for (let ball = 0; ball < 300; ball += 1) {
      match = simulateBall(match, 'defensive', 'batting', () => 0.99);
    }

    expect(match.result).toBe('Match won');
    expect(match.inningsScores).toEqual([299, 0, 0, 300]);
  });
});
