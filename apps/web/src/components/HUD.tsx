import { useState } from 'react';
import type { DeliveryType, MatchMode, MatchState, ShotType } from '../game/matchEngine';
import { formatOvers } from '../game/matchEngine';

type GraphicsQuality = 'low' | 'medium' | 'high' | 'ultra' | 'cinematic';

interface MatchHudProps {
  match: MatchState;
  selectedShot: ShotType;
  selectedDelivery: DeliveryType;
  mode: MatchMode;
  onSelectShot: (shot: ShotType) => void;
  onSelectDelivery: (delivery: DeliveryType) => void;
  onTriggerShot: (shot: ShotType) => void;
  onNextDelivery: () => void;
  onSave: () => void;
  onPause: () => void;
  onNextInnings: () => void;
  status: string;
  quality: GraphicsQuality;
  onSetQuality: (quality: GraphicsQuality) => void;
}

const shotOptions: { type: ShotType; label: string; key: string }[] = [
  { type: 'defensive', label: 'Defend', key: '1' },
  { type: 'cover', label: 'Cover', key: '2' },
  { type: 'straight', label: 'Straight', key: '3' },
  { type: 'pull', label: 'Pull', key: '4' },
  { type: 'hook', label: 'Hook', key: '5' },
  { type: 'cut', label: 'Cut', key: '6' },
  { type: 'sweep', label: 'Sweep', key: '7' },
  { type: 'reverse-sweep', label: 'Reverse', key: '8' },
  { type: 'loft', label: 'Loft', key: '9' },
];

const deliveryOptions: { type: DeliveryType; label: string }[] = [
  { type: 'outswing', label: 'Outswing' },
  { type: 'inswing', label: 'Inswing' },
  { type: 'yorker', label: 'Yorker' },
  { type: 'bouncer', label: 'Bouncer' },
  { type: 'offspin', label: 'Off spin' },
  { type: 'slower-ball', label: 'Slower' },
  { type: 'full-toss', label: 'Full toss' },
];

const qualityOptions: GraphicsQuality[] = ['low', 'medium', 'high', 'ultra', 'cinematic'];

export function MatchHud({
  match,
  selectedShot,
  selectedDelivery,
  onSelectShot,
  onSelectDelivery,
  onTriggerShot,
  onNextDelivery,
  onSave,
  onPause,
  onNextInnings,
  status,
  mode,
  quality,
  onSetQuality,
}: MatchHudProps) {
  const [scorecardOpen, setScorecardOpen] = useState(false);
  const battingTeam = match.battingTeam;
  const bowlingTeam = match.bowlingTeam;
  const batterStats = match.batterStats ?? battingTeam.roster.map((name, index) => ({
    name,
    runs: 0,
    balls: 0,
    fours: 0,
    sixes: 0,
    entered: index < 2,
    dismissed: false,
    dismissal: 'not out',
  }));
  const bowlerFigures = match.bowlerFigures ?? [{ name: match.bowlerName, balls: 0, runsConceded: 0, wickets: 0 }];
  const inningsScorecards = match.inningsScorecards ?? [];
  const matchOver = match.result === 'Match won' || match.result === 'Match lost' || match.result === 'Match drawn' || match.result === 'Match tied' || match.result === 'Innings complete';
  const ballsRemaining = match.mode === 'practice' || match.maxOvers === null
    ? null
    : Math.max(0, match.maxOvers * 6 - (match.overs * 6 + match.ballsInOver));
  const inningsLabel = match.format === 'test' ? `${match.innings}${match.innings === 1 ? 'ST' : match.innings === 2 ? 'ND' : match.innings === 3 ? 'RD' : 'TH'} INNINGS` : `${match.innings === 1 ? '1ST' : '2ND'} INNINGS`;

  return (
    <div className="match-ui">
      <header className="match-topbar">
        <button className="brand-lockup" onClick={onPause} aria-label="Return to match hub">
          <span className="brand-mark">C</span>
          <span>CREASE<span className="brand-light">PLAY</span></span>
        </button>
        <div className="broadcast-label"><span className="live-dot" /> LIVE MATCH <span className="broadcast-divider">/</span> {match.format.toUpperCase()}</div>
        <div className="topbar-actions">
          <span className="ground-label">{match.stadium.name.toUpperCase()} <span>·</span> {match.stadium.location.toUpperCase()}</span>
          <button className="icon-button" onClick={onSave} title="Save match" aria-label="Save match">↥</button>
          <button className="icon-button" onClick={onPause} title="Pause match" aria-label="Pause match">Ⅱ</button>
        </div>
      </header>

      <section className="scoreboard" aria-label="Live scoreboard">
        <div className="scoreboard-heading">
          <div className="innings-label"><span>{inningsLabel}</span><span className="innings-rule" /> <span>{formatOvers(match.overs, match.ballsInOver)} OVERS</span></div>
          <button className="scorecard-toggle" onClick={() => setScorecardOpen((open) => !open)} aria-expanded={scorecardOpen}>
            {scorecardOpen ? 'CLOSE' : 'SCORECARD'}
          </button>
        </div>
        {match.format === 'test' && match.inningsScores.length > 0 && (
          <div className="innings-totals">INNINGS {match.inningsScores.map((score, index) => `${index + 1}: ${score}`).join('  ·  ')}</div>
        )}
        <div className="score-main">
          <div className="team-ident">
            <span className="team-emblem" style={{ backgroundColor: battingTeam.colors[0] }}>{battingTeam.shortName.slice(0, 1)}</span>
            <span className="team-name">{battingTeam.name}</span>
          </div>
          <div className="score-numbers"><strong>{match.score}<i>/</i>{match.wickets}</strong><span>{match.target === null ? `${match.format === 'test' ? 'TEST' : 'FIRST INNINGS'} · NO TARGET` : `TARGET ${match.target}`}</span></div>
          <div className="team-ident opponent">
            <span className="team-name">{bowlingTeam.name}</span>
            <span className="team-emblem" style={{ backgroundColor: bowlingTeam.colors[0] }}>{bowlingTeam.shortName.slice(0, 1)}</span>
          </div>
        </div>
        <div className="score-detail-row">
          <span>CRR <strong>{match.currentRunRate.toFixed(2)}</strong></span>
          <span>RRR <strong>{match.maxOvers === null ? '—' : match.requiredRunRate.toFixed(2)}</strong></span>
          <span>{ballsRemaining === null ? 'OVERS BOWLED' : 'OVERS LEFT'} <strong>{ballsRemaining === null ? formatOvers(match.overs, match.ballsInOver) : formatOvers(Math.floor(ballsRemaining / 6), ballsRemaining % 6)}</strong></span>
        </div>
      </section>

      {scorecardOpen && (
        <section className="scorecard-panel" aria-label="Full match scorecard">
          <header className="scorecard-header">
            <div><span className="card-kicker">MATCH CENTRE · {match.format.toUpperCase()}</span><h2>Full scorecard</h2></div>
            <button className="scorecard-close" onClick={() => setScorecardOpen(false)} aria-label="Close scorecard">×</button>
          </header>
          {inningsScorecards.map((innings) => (
            <div className="scorecard-innings" key={`innings-${innings.innings}`}>
              <div className="scorecard-innings-heading">
                <strong>{innings.battingTeamName}</strong>
                <span>{innings.score}/{innings.wickets} <i>({formatOvers(innings.overs, innings.ballsInOver)} ov)</i></span>
              </div>
              <div className="scorecard-table-wrap">
                <table className="scorecard-table">
                  <thead><tr><th>BATTER</th><th>DISMISSAL</th><th>R</th><th>B</th><th>4s</th><th>6s</th></tr></thead>
                  <tbody>{innings.batters.map((batter) => (
                    <tr key={batter.name}>
                      <td>{batter.name}</td>
                      <td>{batter.dismissed ? batter.dismissal : batter.entered ? 'not out' : 'DNB'}</td>
                      <td>{batter.runs}</td><td>{batter.balls}</td><td>{batter.fours}</td><td>{batter.sixes}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
              <div className="scorecard-table-wrap bowling-table-wrap">
                <table className="scorecard-table bowling-table">
                  <thead><tr><th>BOWLER</th><th>O</th><th>R</th><th>W</th></tr></thead>
                  <tbody>{innings.bowlers.map((bowler) => (
                    <tr key={bowler.name}>
                      <td>{bowler.name}</td><td>{formatOvers(Math.floor(bowler.balls / 6), bowler.balls % 6)}</td><td>{bowler.runsConceded}</td><td>{bowler.wickets}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          ))}
          <div className="scorecard-innings current-scorecard">
            <div className="scorecard-innings-heading">
              <strong>{battingTeam.name} · INNINGS {match.innings}</strong>
              <span>{match.score}/{match.wickets} <i>({formatOvers(match.overs, match.ballsInOver)} ov)</i></span>
            </div>
            <div className="scorecard-table-wrap">
              <table className="scorecard-table">
                <thead><tr><th>BATTER</th><th>DISMISSAL</th><th>R</th><th>B</th><th>4s</th><th>6s</th></tr></thead>
                <tbody>{batterStats.map((batter) => (
                  <tr key={batter.name}>
                    <td>{batter.name}{batter.name === match.playerName ? ' *' : ''}</td>
                    <td>{batter.dismissed ? batter.dismissal : batter.entered ? 'not out' : 'DNB'}</td>
                    <td>{batter.runs}</td><td>{batter.balls}</td><td>{batter.fours}</td><td>{batter.sixes}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
            <div className="scorecard-table-wrap bowling-table-wrap">
              <table className="scorecard-table bowling-table">
                <thead><tr><th>BOWLER</th><th>O</th><th>R</th><th>W</th></tr></thead>
                <tbody>{bowlerFigures.map((bowler) => (
                  <tr key={bowler.name}>
                    <td>{bowler.name}</td><td>{formatOvers(Math.floor(bowler.balls / 6), bowler.balls % 6)}</td><td>{bowler.runsConceded}</td><td>{bowler.wickets}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      <aside className="batter-card">
        <div className="card-kicker">AT THE CREASE <span>●</span></div>
        <div className="batter-row"><span className="batter-indicator" /> <strong>{match.playerName}</strong><span className="batter-star">*</span></div>
        <div className="batter-row secondary"><span />{match.nonStrikerName}<span /></div>
        <div className="batter-divider" />
        <div className="bowler-row"><span className="bowler-ball">◉</span><div><span className="card-kicker">BOWLING</span><strong>{match.bowlerName}</strong></div></div>
      </aside>

      <div className="commentary-pill" aria-live="polite">
        <span className="commentary-icon">✦</span>
        <span>{status || match.lastCommentary}</span>
        <span className="delivery-chip">{match.deliveryType === 'waiting' ? 'READY' : match.deliveryType.replace('-', ' ').toUpperCase()}</span>
      </div>

      <section className="controls-dock">
        <div className="dock-heading">
          <div><span className="card-kicker">YOUR MOVE</span><span className="dock-title">Choose your shot</span></div>
          <span className="control-hint"><kbd>SPACE</kbd> PLAY SELECTED</span>
        </div>
        <div className="shot-grid">
          {shotOptions.map(({ type, label, key }) => (
            <button
              key={type}
              className={`shot-choice${selectedShot === type ? ' is-selected' : ''}`}
              onClick={() => onSelectShot(type)}
              aria-pressed={selectedShot === type}
              title={`${label} · ${key}`}
            >
              <span className={`shot-glyph glyph-${type}`} aria-hidden="true">{type === 'defensive' ? '▰' : type === 'loft' ? '↗' : type === 'reverse-sweep' ? '↶' : '⌁'}</span>
              <span>{label}</span>
              <kbd>{key}</kbd>
            </button>
          ))}
        </div>
        <div className="dock-footer">
          <div className="delivery-select">
            <span className="card-kicker">BOWLER'S PLAN</span>
            <div className="delivery-options">
              {deliveryOptions.map(({ type, label }) => (
                <button
                  key={type}
                  className={`delivery-choice${selectedDelivery === type ? ' is-selected' : ''}`}
                  onClick={() => onSelectDelivery(type)}
                  aria-pressed={selectedDelivery === type}
                >{label}</button>
              ))}
            </div>
          </div>
          <button
            className="play-ball-button"
            onClick={() => match.result === 'Innings break' ? onNextInnings() : onTriggerShot(selectedShot)}
            disabled={matchOver}
          >
            <span>{matchOver ? match.result.toUpperCase() : match.result === 'Innings break' ? 'START NEXT INNINGS' : 'PLAY THIS BALL'}</span>
            <span className="play-arrow">↗</span>
          </button>
        </div>
        <button className="next-ball-link" onClick={onNextDelivery} disabled={matchOver || match.result === 'Innings break'}>Simulate AI batting instead <span>→</span></button>
      </section>

      <div className="scene-tools">
        <span className="scene-tools-label">RENDER</span>
        {qualityOptions.map((level) => (
          <button
            key={level}
            className={`quality-button${quality === level ? ' is-selected' : ''}`}
            onClick={() => onSetQuality(level)}
            aria-pressed={quality === level}
          >{level === 'cinematic' ? 'CINE' : level.toUpperCase()}</button>
        ))}
      </div>
    </div>
  );
}
