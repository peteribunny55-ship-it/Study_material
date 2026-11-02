import type { LightingCondition, MatchFormat, PitchCondition, Stadium, Team, WeatherCondition } from '../game/matchEngine';
import { getFormatLabel } from '../game/matchEngine';

interface MenuScreenProps {
  teams: Team[];
  battingTeam: string;
  bowlingTeam: string;
  onSelectBattingTeam: (name: string) => void;
  onSelectBowlingTeam: (name: string) => void;
  selectedFormat: MatchFormat;
  onSelectFormat: (format: MatchFormat) => void;
  stadiums: Stadium[];
  stadiumId: string;
  onSelectStadium: (id: string) => void;
  weather: WeatherCondition;
  onSelectWeather: (weather: WeatherCondition) => void;
  lighting: LightingCondition;
  onSelectLighting: (lighting: LightingCondition) => void;
  pitchCondition: PitchCondition;
  onSelectPitchCondition: (pitch: PitchCondition) => void;
  customOvers: number;
  onSelectCustomOvers: (overs: number) => void;
  onStartQuickMatch: () => void;
  onStartCareer: () => void;
  onStartTournament: () => void;
  onPractice: () => void;
  canResume: boolean;
  onResume: () => void;
  onReset: () => void;
}

export function MenuScreen({
  teams,
  battingTeam,
  bowlingTeam,
  onSelectBattingTeam,
  onSelectBowlingTeam,
  selectedFormat,
  onSelectFormat,
  stadiums,
  stadiumId,
  onSelectStadium,
  weather,
  onSelectWeather,
  lighting,
  onSelectLighting,
  pitchCondition,
  onSelectPitchCondition,
  customOvers,
  onSelectCustomOvers,
  onStartQuickMatch,
  onStartCareer,
  onStartTournament,
  onPractice,
  canResume,
  onResume,
  onReset,
}: MenuScreenProps) {
  const batting = teams.find((team) => team.name === battingTeam) ?? teams[0];
  const bowling = teams.find((team) => team.name === bowlingTeam) ?? teams[1];
  const stadium = stadiums.find((ground) => ground.id === stadiumId) ?? stadiums[0];

  return (
    <main className="menu-panel">
      <header className="menu-topbar">
        <div className="brand-lockup">
          <span className="brand-mark">C</span>
          <span>CREASE<span className="brand-light">PLAY</span></span>
        </div>
        <div className="topbar-status"><span className="status-dot" /> LOCAL MATCH ENGINE</div>
        <button className="reset-button" onClick={onReset}>RESET LOCAL SAVE <span>↻</span></button>
      </header>

      <div className="menu-content">
        <section className="menu-intro">
          <div className="hero-kicker"><span className="hero-kicker-line" /> A NEW KIND OF MATCH DAY</div>
          <h1>READ THE<br /><em>GAME.</em></h1>
          <p>Every delivery is a decision. Find your timing, pick your line, and take the game away.</p>
          <div className="hero-stats">
            <div><strong>11</strong><span>PLAYERS A SIDE</span></div>
            <i />
            <div><strong>9</strong><span>SHOT OPTIONS</span></div>
            <i />
            <div><strong>3D</strong><span>LIVE STADIUM</span></div>
          </div>
          <div className="menu-shortcut"><kbd>1—9</kbd> SELECT SHOT <span>·</span> <kbd>SPACE</kbd> PLAY DELIVERY</div>
          <div className="player-likeness-note">FICTIONAL 3D PLAYER FACES · LICENSED REAL-PLAYER LIKENESSES NOT INCLUDED</div>
        </section>

        <section className="launch-card" aria-label="Match setup">
          <div className="launch-card-header">
            <div><span className="card-kicker">MATCH CENTRE</span><h2>Set the stage</h2></div>
              {canResume
                ? <button className="resume-button" onClick={onResume}>RESUME MATCH <span>↗</span></button>
                : <span className="format-badge"><span /> {getFormatLabel(selectedFormat, customOvers)}</span>}
          </div>

          <div className="format-picker" role="group" aria-label="Match format">
            {(['t10', 't20', 'odi', 'test', 'custom'] as const).map((format) => (
              <button
                key={format}
                className={`format-choice${selectedFormat === format ? ' is-selected' : ''}`}
                onClick={() => onSelectFormat(format)}
                aria-pressed={selectedFormat === format}
              >
                <strong>{format.toUpperCase()}</strong>
                <span>{format === 't10' ? '10 overs' : format === 't20' ? '20 overs' : format === 'odi' ? '50 overs' : format === 'test' ? '4 innings' : 'choose'}</span>
              </button>
            ))}
          </div>

          {selectedFormat === 'custom' && (
            <label className="setup-select">
              <span>OVERS PER INNINGS</span>
              <select value={customOvers} onChange={(event) => onSelectCustomOvers(Number(event.target.value))} aria-label="Custom overs per innings">
                {Array.from({ length: 50 }, (_, index) => index + 1).map((overs) => (
                  <option key={overs} value={overs}>{overs} overs</option>
                ))}
              </select>
            </label>
          )}

          <div className="team-picker-grid">
            <label className="team-picker">
              <span>YOUR SIDE <small>TOSS CALL</small></span>
              <div className="team-select-wrap">
                <span className="team-select-mark" style={{ backgroundColor: batting.colors[0] }}>{batting.shortName.slice(0, 1)}</span>
                <select value={battingTeam} onChange={(event) => onSelectBattingTeam(event.target.value)} aria-label="Batting team">
                  {teams.map((team) => <option key={team.name} value={team.name}>{team.name}</option>)}
                </select>
                <span className="select-chevron">⌄</span>
              </div>
            </label>
            <div className="versus-mark">VS</div>
            <label className="team-picker">
              <span>OPPOSITION <small>AI CONTROLLED</small></span>
              <div className="team-select-wrap">
                <span className="team-select-mark" style={{ backgroundColor: bowling.colors[0] }}>{bowling.shortName.slice(0, 1)}</span>
                <select value={bowlingTeam} onChange={(event) => onSelectBowlingTeam(event.target.value)} aria-label="Bowling team">
                  {teams.map((team) => <option key={team.name} value={team.name}>{team.name}</option>)}
                </select>
                <span className="select-chevron">⌄</span>
              </div>
            </label>
          </div>

          <div className="environment-picker">
            <label className="setup-select">
              <span>STADIUM · {stadium.location.toUpperCase()}</span>
              <select value={stadiumId} onChange={(event) => onSelectStadium(event.target.value)} aria-label="Stadium">
                {stadiums.map((ground) => <option key={ground.id} value={ground.id}>{ground.name}</option>)}
              </select>
            </label>
            <label className="setup-select">
              <span>WEATHER</span>
              <select value={weather} onChange={(event) => onSelectWeather(event.target.value as WeatherCondition)} aria-label="Weather">
                <option value="sunny">Sunny</option>
                <option value="cloudy">Cloudy · swing assist</option>
                <option value="windy">Windy · moving air</option>
              </select>
            </label>
            <label className="setup-select">
              <span>LIGHT</span>
              <select value={lighting} onChange={(event) => onSelectLighting(event.target.value as LightingCondition)} aria-label="Match lighting">
                <option value="day">Day</option>
                <option value="night">Night · floodlights</option>
              </select>
            </label>
            <label className="setup-select">
              <span>PITCH</span>
              <select value={pitchCondition} onChange={(event) => onSelectPitchCondition(event.target.value as PitchCondition)} aria-label="Pitch condition">
                <option value="balanced">Balanced</option>
                <option value="green">Green · seam assist</option>
                <option value="dry">Dry · spin assist</option>
              </select>
            </label>
          </div>

          <div className="menu-grid">
            <button className="mode-card featured-mode" onClick={onStartQuickMatch}>
              <span className="mode-icon">✳</span><span className="mode-copy"><strong>Quick match</strong><small>Jump straight into the action</small></span><span className="mode-arrow">↗</span>
            </button>
            <button className="mode-card" onClick={onPractice}>
              <span className="mode-icon">⌁</span><span className="mode-copy"><strong>Practice nets</strong><small>Work on your shot selection</small></span><span className="mode-arrow">↗</span>
            </button>
            <button className="mode-card" onClick={onStartCareer}>
              <span className="mode-icon">↗</span><span className="mode-copy"><strong>Career</strong><small>Start your player journey</small></span><span className="mode-arrow">↗</span>
            </button>
            <button className="mode-card" onClick={onStartTournament}>
              <span className="mode-icon">♜</span><span className="mode-copy"><strong>Tournament</strong><small>Take on the knockout stage</small></span><span className="mode-arrow">↗</span>
            </button>
          </div>
          <div className="launch-card-foot"><span>●</span> PLAYABLE OFFLINE <span className="foot-divider">/</span> PROGRESS SAVED ON THIS DEVICE</div>
        </section>

        <aside className="fixture-card">
          <div className="fixture-head"><span>FEATURED FIXTURE</span><span className="fixture-live">● READY</span></div>
          <div className="fixture-venue"><span>{stadium.name.toUpperCase()}</span><span>{stadium.location.toUpperCase()}</span></div>
          <div className="fixture-teams">
            <div className="fixture-team"><span className="fixture-crest" style={{ backgroundColor: batting.colors[0] }}>{batting.shortName.slice(0, 1)}</span><strong>{batting.shortName}</strong></div>
            <span className="fixture-vs">VS</span>
            <div className="fixture-team"><span className="fixture-crest" style={{ backgroundColor: bowling.colors[0] }}>{bowling.shortName.slice(0, 1)}</span><strong>{bowling.shortName}</strong></div>
          </div>
          <div className="fixture-pitch"><div className="pitch-stumps" /><div className="pitch-ball" /><div className="pitch-stumps" /></div>
          <div className="fixture-footer"><span>{lighting.toUpperCase()}</span><span>{weather.toUpperCase()}</span><span>3D VIEW</span></div>
        </aside>
      </div>
      <footer className="menu-footer"><span>CREASEPLAY <span className="footer-muted">· AN INTERACTIVE CRICKET PROTOTYPE</span></span><span>BUILD YOUR INNINGS, ONE BALL AT A TIME</span></footer>
    </main>
  );
}
