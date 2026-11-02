import { useEffect, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GameScene } from './components/GameScene';
import { MatchHud } from './components/HUD';
import { MenuScreen } from './components/MenuScreen';
import { createInitialMatch, REAL_TEAMS, STADIUMS, simulateBall, type DeliveryType, type LightingCondition, type MatchState, type MatchSetupOptions, type MatchFormat, type MatchMode, type PitchCondition, type ShotType, type WeatherCondition } from './game/matchEngine';
import { saveGame, loadGame, clearSave } from './game/saveSystem';

const DEFAULT_MODE: MatchMode = 'quick';
type GraphicsQuality = 'low' | 'medium' | 'high' | 'ultra' | 'cinematic';
type TossCall = 'heads' | 'tails';
type TossDecision = 'bat' | 'bowl';

export default function App() {
  const [game, setGame] = useState<MatchState>(() => createInitialMatch(DEFAULT_MODE));
  const [menuVisible, setMenuVisible] = useState(true);
  const [pendingStart, setPendingStart] = useState<{ mode: MatchMode; status: string } | null>(null);
  const [tossCall, setTossCall] = useState<TossCall>('heads');
  const [tossResult, setTossResult] = useState<TossCall | null>(null);
  const [tossWinner, setTossWinner] = useState<'you' | 'opposition' | null>(null);
  const [tossDecision, setTossDecision] = useState<TossDecision>('bat');
  const [hasActiveMatch, setHasActiveMatch] = useState(false);
  const [selectedShot, setSelectedShot] = useState<ShotType>('defensive');
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryType>('outswing');
  const [status, setStatus] = useState('Ready for toss');
  const [graphicsMode, setGraphicsMode] = useState<GraphicsQuality>('ultra');
  const [selectedBattingTeam, setSelectedBattingTeam] = useState('India');
  const [selectedBowlingTeam, setSelectedBowlingTeam] = useState('Australia');
  const [selectedFormat, setSelectedFormat] = useState<MatchFormat>('t20');
  const [selectedStadium, setSelectedStadium] = useState(STADIUMS[0].id);
  const [selectedWeather, setSelectedWeather] = useState<WeatherCondition>('sunny');
  const [selectedLighting, setSelectedLighting] = useState<LightingCondition>('night');
  const [selectedPitch, setSelectedPitch] = useState<PitchCondition>('balanced');
  const [customOvers, setCustomOvers] = useState(10);

  const matchSetup: MatchSetupOptions = {
    stadiumId: selectedStadium,
    weather: selectedWeather,
    lighting: selectedLighting,
    pitchCondition: selectedPitch,
    customOvers,
  };

  const startMatch = (mode: MatchMode, customStatus: string) => {
    setPendingStart({ mode, status: customStatus });
    setTossCall('heads');
    setTossResult(null);
    setTossWinner(null);
    setTossDecision('bat');
    setMenuVisible(false);
  };

  const flipToss = () => {
    const result: TossCall = Math.random() < 0.5 ? 'heads' : 'tails';
    const winner = result === tossCall ? 'you' : 'opposition';
    setTossResult(result);
    setTossWinner(winner);
    if (winner === 'opposition') {
      setTossDecision(Math.random() < 0.5 ? 'bat' : 'bowl');
    }
  };

  const confirmToss = () => {
    if (!pendingStart || !tossWinner) return;
    const battingTeam = tossDecision === 'bat' ? selectedBattingTeam : selectedBowlingTeam;
    const bowlingTeam = tossDecision === 'bat' ? selectedBowlingTeam : selectedBattingTeam;
    const tossSummary = tossWinner === 'you'
      ? `${selectedBattingTeam} win the toss and choose to ${tossDecision} first`
      : `${selectedBowlingTeam} win the toss and choose to ${tossDecision} first`;
    const next = createInitialMatch(pendingStart.mode, battingTeam, bowlingTeam, selectedFormat, matchSetup);
    setGame(next);
    setStatus(`${tossSummary}. ${pendingStart.status}`);
    setHasActiveMatch(true);
    setPendingStart(null);
  };

  const handleBattingTeamChange = (teamName: string) => {
    setSelectedBattingTeam(teamName);
    if (teamName === selectedBowlingTeam) {
      const fallback = REAL_TEAMS.find((team) => team.name !== teamName)?.name ?? 'Australia';
      setSelectedBowlingTeam(fallback);
    }
  };

  const handleBowlingTeamChange = (teamName: string) => {
    setSelectedBowlingTeam(teamName);
    if (teamName === selectedBattingTeam) {
      const fallback = REAL_TEAMS.find((team) => team.name !== teamName)?.name ?? 'India';
      setSelectedBattingTeam(fallback);
    }
  };

  useEffect(() => {
    const saved = loadGame();
    if (saved) {
      setGame(saved.match);
      setSelectedShot(saved.match.selectedShot ?? 'defensive');
      setSelectedDelivery(saved.match.deliveryType ?? 'outswing');
      setSelectedFormat(saved.match.format ?? 't20');
      setSelectedStadium(saved.match.stadium.id);
      setSelectedWeather(saved.match.weather);
      setSelectedLighting(saved.match.lighting);
      setSelectedPitch(saved.match.pitchCondition);
      setCustomOvers(saved.match.maxOvers ?? 10);
      setStatus(saved.match.lastCommentary ?? 'Saved match restored');
      setHasActiveMatch(true);
      setMenuVisible(false);
    }
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (menuVisible || pendingStart) return;
      if (key === ' ') {
        event.preventDefault();
        triggerShot(selectedShot);
      }
      const shotKeys: Record<string, ShotType> = {
        '1': 'defensive',
        '2': 'cover',
        '3': 'straight',
        '4': 'pull',
        '5': 'hook',
        '6': 'cut',
        '7': 'sweep',
        '8': 'reverse-sweep',
        '9': 'loft',
      };
      if (shotKeys[key]) setSelectedShot(shotKeys[key]);
      if (key === 's') {
        saveCurrentGame();
      }
      if (key === 'l') {
        const saved = loadGame();
        if (saved) {
          setGame(saved.match);
          setStatus('Loaded saved match');
        }
      }
      if (key === 'm') {
        setMenuVisible((prev) => !prev);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedShot, selectedDelivery, game, menuVisible, pendingStart]);

  const saveCurrentGame = () => {
    saveGame({
      match: game,
      lastSaved: Date.now(),
    });
    setStatus('Game saved locally');
  };

  const triggerShot = (shotType: ShotType) => {
    setGame((current) => {
      const next = simulateBall(current, shotType, 'batting', Math.random, selectedDelivery);
      setStatus(next.lastCommentary);
      return next;
    });
  };

  const nextDelivery = () => {
    if (game.result === 'Innings break') return;
    const next = simulateBall(game, selectedShot, 'bowling', Math.random, selectedDelivery);
    setGame(next);
    setStatus(next.lastCommentary);
  };

  const currentMode = useMemo(() => game.mode, [game]);

  return (
    <div className="app-shell">
      {menuVisible && (
        <MenuScreen
          teams={REAL_TEAMS}
          stadiums={STADIUMS}
          battingTeam={selectedBattingTeam}
          bowlingTeam={selectedBowlingTeam}
          onSelectBattingTeam={handleBattingTeamChange}
          onSelectBowlingTeam={handleBowlingTeamChange}
          selectedFormat={selectedFormat}
          onSelectFormat={setSelectedFormat}
          stadiumId={selectedStadium}
          onSelectStadium={setSelectedStadium}
          weather={selectedWeather}
          onSelectWeather={setSelectedWeather}
          lighting={selectedLighting}
          onSelectLighting={setSelectedLighting}
          pitchCondition={selectedPitch}
          onSelectPitchCondition={setSelectedPitch}
          customOvers={customOvers}
          onSelectCustomOvers={setCustomOvers}
          onStartQuickMatch={() => startMatch(DEFAULT_MODE, `${selectedBattingTeam} vs ${selectedBowlingTeam} quick match started`)}
          onStartCareer={() => startMatch('career', `${selectedBattingTeam} begin their career campaign against ${selectedBowlingTeam}`)}
          onStartTournament={() => startMatch('tournament', `${selectedBattingTeam} enter tournament action vs ${selectedBowlingTeam}`)}
          onPractice={() => startMatch('practice', `Practice session: ${selectedBattingTeam} vs ${selectedBowlingTeam}`)}
          canResume={hasActiveMatch}
          onResume={() => setMenuVisible(false)}
          onReset={() => {
            clearSave();
            setGame(createInitialMatch(DEFAULT_MODE, selectedBattingTeam, selectedBowlingTeam, selectedFormat, matchSetup));
            setStatus('Progress reset');
            setHasActiveMatch(false);
          }}
        />
      )}

      <div className="game-root">
        <Canvas camera={{ position: [0, 17, 38], fov: 50 }} shadows dpr={[1, 2]}>
          <GameScene match={game} selectedShot={selectedShot} quality={graphicsMode} />
          <OrbitControls enablePan={false} enableZoom={false} maxPolarAngle={Math.PI / 2.2} minPolarAngle={Math.PI / 3.4} />
        </Canvas>

        <MatchHud
          match={game}
          selectedShot={selectedShot}
          selectedDelivery={selectedDelivery}
          onSelectShot={setSelectedShot}
          onSelectDelivery={setSelectedDelivery}
          onTriggerShot={triggerShot}
          onNextDelivery={nextDelivery}
          onSave={saveCurrentGame}
          onNextInnings={() => {
            setGame((current) => current.result === 'Innings break' ? { ...current, result: 'In play' } : current);
            setStatus(game.lastCommentary);
          }}
          status={status}
          mode={currentMode}
          quality={graphicsMode}
          onSetQuality={setGraphicsMode}
          onPause={() => setMenuVisible(true)}
        />
      </div>
      {pendingStart && (
        <section className="toss-screen" aria-labelledby="toss-title">
          <div className="toss-card">
            <div className="toss-kicker">MATCH DAY · {selectedFormat.toUpperCase()}</div>
            <h1 id="toss-title">The toss</h1>
            <p className="toss-fixture">{selectedBattingTeam} <span>vs</span> {selectedBowlingTeam}</p>
            {!tossResult ? (
              <>
                <p className="toss-instructions">Choose your call, then flip the coin to decide who bats first.</p>
                <div className="toss-calls" role="group" aria-label="Choose heads or tails">
                  {(['heads', 'tails'] as const).map((call) => (
                    <button key={call} className={tossCall === call ? 'is-selected' : ''} onClick={() => setTossCall(call)}>
                      {call}
                    </button>
                  ))}
                </div>
                <div className="toss-coin" aria-hidden="true">C</div>
                <button className="toss-primary" onClick={flipToss}>FLIP THE COIN</button>
              </>
            ) : (
              <>
                <div className={`toss-coin toss-coin-result ${tossResult}`} aria-label={`The coin landed ${tossResult}`}>
                  {tossResult === 'heads' ? 'H' : 'T'}
                </div>
                <p className="toss-outcome">
                  {tossWinner === 'you' ? `${selectedBattingTeam} win the toss` : `${selectedBowlingTeam} win the toss`}
                  <span>The call was {tossResult}.</span>
                </p>
                {tossWinner === 'you' ? (
                  <>
                    <p className="toss-instructions">Choose to bat or bowl first.</p>
                    <div className="toss-calls" role="group" aria-label="Choose to bat or bowl first">
                      {(['bat', 'bowl'] as const).map((decision) => (
                        <button key={decision} className={tossDecision === decision ? 'is-selected' : ''} onClick={() => setTossDecision(decision)}>
                          {decision} first
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="toss-instructions">The opposition elect to {tossDecision} first.</p>
                )}
                <button className="toss-primary" onClick={confirmToss}>START MATCH</button>
              </>
            )}
            <button className="toss-back" onClick={() => { setPendingStart(null); setMenuVisible(true); }}>BACK TO MATCH CENTRE</button>
          </div>
        </section>
      )}
    </div>
  );
}
