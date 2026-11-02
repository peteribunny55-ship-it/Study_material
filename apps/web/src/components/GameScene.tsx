import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, Shape, type Group } from 'three';
import type { MatchState, ShotType } from '../game/matchEngine';

type GraphicsQuality = 'low' | 'medium' | 'high' | 'ultra' | 'cinematic';

type PlayerPose = 'batting' | 'bowling' | 'fielding';
const DEFAULT_BOUNDARY_X = 22.8;
const DEFAULT_BOUNDARY_Z = 21.4;

const cricketBatBlade = new Shape();
cricketBatBlade.moveTo(-0.075, -0.64);
cricketBatBlade.bezierCurveTo(-0.11, -0.6, -0.12, -0.2, -0.13, 0.13);
cricketBatBlade.bezierCurveTo(-0.14, 0.3, -0.11, 0.41, -0.07, 0.46);
cricketBatBlade.lineTo(0.07, 0.46);
cricketBatBlade.bezierCurveTo(0.11, 0.41, 0.14, 0.3, 0.13, 0.13);
cricketBatBlade.bezierCurveTo(0.12, -0.2, 0.11, -0.6, 0.075, -0.64);
cricketBatBlade.closePath();

interface GameSceneProps {
  match: MatchState;
  selectedShot: ShotType;
  quality: GraphicsQuality;
}

function HumanPlayer({
  position,
  jersey,
  pants,
  skin,
  pose,
  scale = 1,
  batting = false,
  appearanceKey,
  swingKey = '',
  shot = 'defensive',
}: {
  position: [number, number, number];
  jersey: string;
  pants: string;
  skin: string;
  pose: PlayerPose;
  scale?: number;
  batting?: boolean;
  appearanceKey: string;
  swingKey?: string;
  shot?: ShotType;
}) {
  const armRotation = pose === 'bowling' ? -0.9 : pose === 'batting' ? -0.25 : 0.25;
  const leadLeg = pose === 'batting' ? -0.4 : pose === 'bowling' ? 0.5 : 0;
  const hash = Array.from(appearanceKey).reduce((value, character) => (value * 31 + character.charCodeAt(0)) >>> 0, 7);
  const hairColors = ['#171512', '#29211d', '#382a23', '#201b18', '#4b3529'];
  const hairColor = hairColors[hash % hairColors.length];
  const eyeColor = ['#302019', '#3b281c', '#51351f', '#25211d'][Math.floor(hash / 7) % 4];
  const faceScaleX = 0.92 + ((hash >>> 4) % 15) / 100;
  const faceScaleY = 0.94 + ((hash >>> 8) % 13) / 100;
  const eyeSpacing = 0.077 + ((hash >>> 12) % 8) / 1000;
  const hasBeard = (hash % 4) !== 0;
  const complexionShift = ((hash >>> 16) % 9) / 100;
  const complexion = new Color(skin).lerp(new Color((hash & 1) === 0 ? '#efd0b2' : '#694936'), complexionShift);
  const faceColor = complexion.getStyle();
  const faceLight = complexion.clone().lerp(new Color('#f4d0b1'), 0.12).getStyle();
  const faceShadow = complexion.clone().lerp(new Color('#674438'), 0.25).getStyle();

  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 1.58, 0]} castShadow>
        <cylinderGeometry args={[0.105, 0.125, 0.3, 16]} />
        <meshStandardMaterial color={faceShadow} roughness={0.82} />
      </mesh>

      <mesh position={[0, 1.86, 0.015]} scale={[faceScaleX, faceScaleY, 1]} castShadow>
        <sphereGeometry args={[0.245, 32, 24]} />
        <meshStandardMaterial color={faceColor} roughness={0.78} />
      </mesh>

      {[-1, 1].map((side) => (
        <group key={`ear-${side}`} position={[side * 0.225 * faceScaleX, 1.86, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.055, 16, 14]} />
            <meshStandardMaterial color={faceColor} roughness={0.82} />
          </mesh>
          <mesh position={[0, 0, 0.035]}>
            <sphereGeometry args={[0.024, 12, 10]} />
            <meshStandardMaterial color={faceShadow} roughness={0.9} />
          </mesh>
        </group>
      ))}

      <mesh position={[0, 1.99, -0.015]} scale={[faceScaleX * 1.02, 0.84, 0.95]} castShadow>
        <sphereGeometry args={[0.248, 28, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={hairColor} roughness={0.88} />
      </mesh>

      {[-1, 1].map((side) => (
        <group key={`eye-${side}`}>
          <mesh position={[side * eyeSpacing, 1.914, 0.222]}>
            <sphereGeometry args={[0.042, 18, 14]} />
            <meshStandardMaterial color="#eee5d9" roughness={0.4} />
          </mesh>
          <mesh position={[side * eyeSpacing + 0.006, 1.914, 0.253]}>
            <sphereGeometry args={[0.021, 16, 12]} />
            <meshStandardMaterial color={eyeColor} roughness={0.34} />
          </mesh>
          <mesh position={[side * eyeSpacing + 0.009, 1.914, 0.269]}>
            <sphereGeometry args={[0.009, 12, 10]} />
            <meshStandardMaterial color="#141311" roughness={0.3} />
          </mesh>
          <mesh position={[side * eyeSpacing, 1.969, 0.218]} rotation={[0, 0, side * -0.1]}>
            <capsuleGeometry args={[0.018, 0.06, 3, 8]} />
            <meshStandardMaterial color={hairColor} roughness={0.9} />
          </mesh>
        </group>
      ))}

      <mesh position={[0, 1.84, 0.238]} scale={[0.78, 1.12, 0.82]}>
        <sphereGeometry args={[0.052, 16, 14]} />
        <meshStandardMaterial color={faceLight} roughness={0.76} />
      </mesh>
      <mesh position={[0, 1.805, 0.272]} scale={[1, 0.83, 0.75]}>
        <sphereGeometry args={[0.026, 14, 12]} />
        <meshStandardMaterial color={faceColor} roughness={0.74} />
      </mesh>

      <mesh position={[0, 1.742, 0.232]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.012, 0.067, 3, 8]} />
        <meshStandardMaterial color="#623d37" roughness={0.76} />
      </mesh>
      <mesh position={[0, 1.757, 0.23]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.008, 0.052, 3, 8]} />
        <meshStandardMaterial color="#f0c4aa" roughness={0.8} />
      </mesh>

      {hasBeard && (
        <mesh position={[0, 1.675, 0.122]} scale={[0.78, 0.38, 0.58]}>
          <sphereGeometry args={[0.16, 20, 14]} />
          <meshStandardMaterial color={hairColor} roughness={0.98} />
        </mesh>
      )}

      {batting && (
        <group>
          <mesh position={[0, 2.08, 0.005]} scale={[0.272, 0.205, 0.25]} castShadow>
            <sphereGeometry args={[1, 28, 18, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#202b35" roughness={0.42} metalness={0.25} />
          </mesh>
          {[-0.13, -0.065, 0, 0.065, 0.13].map((x) => (
            <mesh key={`helmet-bar-${x}`} position={[x, 1.84, 0.268]} rotation={[0, 0, 0]}>
              <cylinderGeometry args={[0.008, 0.008, 0.19, 8]} />
              <meshStandardMaterial color="#a8b1b5" roughness={0.34} metalness={0.72} />
            </mesh>
          ))}
          {[1.79, 1.84, 1.89].map((y) => (
            <mesh key={`helmet-grill-${y}`} position={[0, y, 0.267]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.008, 0.008, 0.3, 8]} />
              <meshStandardMaterial color="#a8b1b5" roughness={0.34} metalness={0.72} />
            </mesh>
          ))}
        </group>
      )}

      <mesh position={[0, 1.41, 0]} castShadow>
        <capsuleGeometry args={[0.28, 0.9, 8, 20]} />
        <meshStandardMaterial color={jersey} roughness={0.75} />
      </mesh>

      <mesh position={[0, 0.82, 0]} castShadow>
        <capsuleGeometry args={[0.17, 0.62, 8, 18]} />
        <meshStandardMaterial color={pants} roughness={0.82} />
      </mesh>

      <group position={[-0.34, 1.45, 0]} rotation={[0, 0, armRotation]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.08, 0.72, 4, 12]} />
          <meshStandardMaterial color={faceColor} roughness={0.9} />
        </mesh>
      </group>

      <group position={[0.34, 1.45, 0]} rotation={[0, 0, armRotation + 0.9]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.08, 0.72, 4, 12]} />
          <meshStandardMaterial color={faceColor} roughness={0.9} />
        </mesh>
      </group>

      <group position={[-0.15, 0.42, 0]} rotation={[0, 0, leadLeg]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.1, 0.8, 4, 12]} />
          <meshStandardMaterial color={pants} roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.52, 0.14]} castShadow>
          <cylinderGeometry args={[0.1, 0.12, 0.28, 14]} />
          <meshStandardMaterial color="#101827" roughness={0.7} />
        </mesh>
      </group>

      <group position={[0.15, 0.42, 0]} rotation={[0, 0, -leadLeg]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.1, 0.8, 4, 12]} />
          <meshStandardMaterial color={pants} roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.52, 0.14]} castShadow>
          <cylinderGeometry args={[0.1, 0.12, 0.28, 14]} />
          <meshStandardMaterial color="#101827" roughness={0.7} />
        </mesh>
      </group>

      {batting && (
        <CricketBat swingKey={swingKey} shot={shot} />
      )}
    </group>
  );
}

function CricketBat({ swingKey, shot }: { swingKey: string; shot: ShotType }) {
  const batRef = useRef<Group>(null);
  const swing = useRef<{ key: string; start: number | null; active: boolean }>({ key: swingKey, start: null, active: false });

  useEffect(() => {
    if (swing.current.key === swingKey) return;
    swing.current = { key: swingKey, start: null, active: true };
  }, [swingKey]);

  useFrame((state) => {
    const bat = batRef.current;
    if (!bat) return;
    const animation = swing.current;
    if (!animation.active) {
      bat.rotation.z = -0.52;
      return;
    }
    if (animation.start === null) animation.start = state.clock.elapsedTime;
    const progress = (state.clock.elapsedTime - animation.start) / 0.42;
    if (progress >= 1) {
      animation.active = false;
      bat.rotation.z = -0.52;
      return;
    }
    const amplitude = shot === 'defensive' ? 0.48 : shot === 'sweep' || shot === 'reverse-sweep' ? 1.05 : 1.45;
    bat.rotation.z = -0.52 - Math.sin(progress * Math.PI) * amplitude;
  });

  return (
    <group ref={batRef} position={[0.42, 0.64, 0.34]} rotation={[0, 0, -0.52]} castShadow>
      <mesh position={[0, -0.2, 0]} castShadow>
        <extrudeGeometry args={[cricketBatBlade, { depth: 0.065, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.008, bevelThickness: 0.006 }]} />
        <meshStandardMaterial color="#c38a43" roughness={0.72} />
      </mesh>
      <mesh position={[0, -0.2, 0.044]} castShadow>
        <boxGeometry args={[0.085, 0.7, 0.018]} />
        <meshStandardMaterial color="#dfa95d" roughness={0.68} />
      </mesh>
      <mesh position={[0, 0.48, 0]}>
        <cylinderGeometry args={[0.032, 0.043, 0.56, 12]} />
        <meshStandardMaterial color="#9b713f" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.68, 0]}>
        <cylinderGeometry args={[0.038, 0.038, 0.19, 12]} />
        <meshStandardMaterial color="#263d4c" roughness={0.9} />
      </mesh>
      {[-0.22, -0.17, -0.12, -0.07, -0.02].map((y) => (
        <mesh key={y} position={[0, y, 0.046]}>
          <boxGeometry args={[0.09, 0.018, 0.008]} />
          <meshStandardMaterial color="#f0d7a4" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

export function GameScene({ match, quality }: GameSceneProps) {
  const ballRef = useRef<Group>(null);
  const pitcherRef = useRef<Group>(null);
  const batterRef = useRef<Group>(null);
  const bounceRef = useRef({ x: 0, y: 0.2, z: 9.2, vx: 0, vy: 3.4, vz: -12.5, active: false, bounced: false, hit: false });

  const qualityMap: Record<GraphicsQuality, { crowd: number; light: number; shadows: boolean; bloom: number; outline: number }> = {
    low: { crowd: 60, light: 1.2, shadows: true, bloom: 0.3, outline: 0.2 },
    medium: { crowd: 90, light: 1.6, shadows: true, bloom: 0.7, outline: 0.4 },
    high: { crowd: 130, light: 2.1, shadows: true, bloom: 1.1, outline: 0.6 },
    ultra: { crowd: 180, light: 2.5, shadows: true, bloom: 1.5, outline: 0.8 },
    cinematic: { crowd: 240, light: 3.1, shadows: true, bloom: 2.2, outline: 1 },
  };

  const settings = qualityMap[quality];
  const boundaryX = match.stadium.boundaryX || DEFAULT_BOUNDARY_X;
  const boundaryZ = match.stadium.boundaryZ || DEFAULT_BOUNDARY_Z;
  const outerStandRadius = Math.max(boundaryX, boundaryZ);
  const isNight = match.lighting === 'night';

  useEffect(() => {
    if (!match.ballInPlay) {
      bounceRef.current.active = false;
      return;
    }
    bounceRef.current = {
      x: 0,
      y: 0.2,
      z: 9.2,
      vx: match.deliveryType === 'outswing' ? 0.9 : match.deliveryType === 'inswing' ? -0.9 : 0,
      vy: 3.4,
      vz: -12.5,
      active: true,
      bounced: false,
      hit: false,
    };
  }, [match.ballInPlay, match.lastBallRuns, match.score, match.wickets, match.overs, match.ballsInOver, match.deliveryType]);

  useFrame((state, frameDelta) => {
    if (ballRef.current) {
      const b = bounceRef.current;
      if (b.active) {
        const delta = Math.min(frameDelta, 0.04);
        if (match.weather === 'windy') b.vx += 0.45 * delta;
        b.x += b.vx * delta;
        b.z += b.vz * delta;
        b.y += b.vy * delta;
        b.vy -= 9.81 * delta;
        if (b.y <= 0.085 && !b.bounced) {
          b.y = 0.085;
          b.vy = Math.abs(b.vy) * 0.48;
          b.bounced = true;
        }
        if (b.z < -3.4 && !b.hit) {
          b.hit = true;
          if (match.lastBallRuns > 0) {
            const directions: Partial<Record<ShotType, [number, number]>> = {
              cover: [-0.62, -0.78],
              cut: [-0.84, -0.54],
              pull: [0.68, -0.74],
              hook: [0.84, -0.54],
              sweep: [0.94, -0.34],
              'reverse-sweep': [-0.94, -0.34],
            };
            const [directionX, directionZ] = directions[match.selectedShot] ?? [0, -1];
            const speed = match.lastBallRuns === 6 ? 12 : match.lastBallRuns === 4 ? 14 : match.lastBallRuns === 3 ? 7 : match.lastBallRuns === 2 ? 5 : 3.5;
            b.vx = directionX * speed;
            b.vz = directionZ * speed;
            if (match.lastBallRuns === 6) {
              b.vy = 17;
            } else {
              b.y = 0.09;
              b.vy = 0;
              b.bounced = true;
            }
          } else {
            b.vz = -2;
            b.vy = 0.1;
          }
        }
        ballRef.current.position.set(b.x, Math.max(0.085, b.y), b.z);
        ballRef.current.rotation.x += delta * 16;
        ballRef.current.rotation.z += delta * 10;
        if (b.y < 0.085 && b.hit) {
          b.y = 0.085;
          b.vy = 0;
        }
        const boundaryDistance = Math.hypot(b.x / boundaryX, b.z / boundaryZ);
        if (match.lastBallRuns === 4 && boundaryDistance >= 1) b.active = false;
        if (match.lastBallRuns === 6 && boundaryDistance > 1.5) b.active = false;
        if (match.lastBallRuns > 0 && match.lastBallRuns < 4 && b.hit && b.vy === 0 && b.vx ** 2 + b.vz ** 2 < 0.4) b.active = false;
        if (match.lastBallRuns > 0 && match.lastBallRuns < 4 && b.hit) {
          const rollingFriction = Math.pow(0.985, delta * 60);
          b.vx *= rollingFriction;
          b.vz *= rollingFriction;
        }
      }
    }

    if (pitcherRef.current) {
      const t = state.clock.getElapsedTime();
      pitcherRef.current.rotation.y = Math.sin(t * 1.2) * 0.12;
    }

    if (batterRef.current) {
      const t = state.clock.getElapsedTime();
      batterRef.current.rotation.y = Math.sin(t * 0.8) * 0.12;
    }
  });

  const standY = 0.8;

  const cricketField = [
    { key: 'bowler', position: [0, 0, 10] as [number, number, number], jersey: match.bowlingTeam.colors[0], pants: '#111827', skin: '#f0c4a1', pose: 'bowling' as const, scale: 1.35 },
    { key: 'striker', position: [0, 0, -4] as [number, number, number], jersey: match.battingTeam.colors[0], pants: '#0f172a', skin: '#e4b58b', pose: 'batting' as const, scale: 1.42, batting: true },
    { key: 'nonStriker', position: [1.2, 0, -2.2] as [number, number, number], jersey: match.battingTeam.colors[0], pants: '#111827', skin: '#d6a57b', pose: 'fielding' as const, scale: 1.08 },
    { key: 'wicketkeeper', position: [0.8, 0, -8.2] as [number, number, number], jersey: match.bowlingTeam.colors[0], pants: '#0f172a', skin: '#d69b72', pose: 'fielding' as const, scale: 1.12 },
    { key: 'slipLeft', position: [-2.8, 0, -6.6] as [number, number, number], jersey: match.bowlingTeam.colors[0], pants: '#1f2937', skin: '#dca27f', pose: 'fielding' as const, scale: 1.02 },
    { key: 'slipRight', position: [2.8, 0, -6.4] as [number, number, number], jersey: match.bowlingTeam.colors[0], pants: '#1f2937', skin: '#dca27f', pose: 'fielding' as const, scale: 1.02 },
    { key: 'gully', position: [-4.7, 0, -2.8] as [number, number, number], jersey: match.bowlingTeam.colors[0], pants: '#111827', skin: '#e0a57a', pose: 'fielding' as const, scale: 1.02 },
    { key: 'point', position: [4.7, 0, -2.8] as [number, number, number], jersey: match.bowlingTeam.colors[0], pants: '#111827', skin: '#dba77c', pose: 'fielding' as const, scale: 1.02 },
    { key: 'cover', position: [-6.4, 0, 2.5] as [number, number, number], jersey: match.bowlingTeam.colors[0], pants: '#111827', skin: '#dfb081', pose: 'fielding' as const, scale: 1.02 },
    { key: 'midOff', position: [6.2, 0, 2.8] as [number, number, number], jersey: match.bowlingTeam.colors[0], pants: '#111827', skin: '#dca27f', pose: 'fielding' as const, scale: 1.02 },
    { key: 'midOn', position: [0, 0, 5.8] as [number, number, number], jersey: match.bowlingTeam.colors[0], pants: '#111827', skin: '#cf9870', pose: 'fielding' as const, scale: 1.02 },
    { key: 'longOff', position: [10.5, 0, 7.5] as [number, number, number], jersey: match.bowlingTeam.colors[0], pants: '#111827', skin: '#d09d71', pose: 'fielding' as const, scale: 0.96 },
    { key: 'deepSquare', position: [-10.5, 0, 9.5] as [number, number, number], jersey: match.bowlingTeam.colors[0], pants: '#111827', skin: '#d9a277', pose: 'fielding' as const, scale: 0.96 },
  ];

  return (
    <>
      <ambientLight intensity={isNight ? 0.9 : 1.35} color={isNight ? '#d7ebff' : '#fff1d2'} />
      <directionalLight
        position={[12, 16, 8]}
        intensity={isNight ? settings.light : settings.light * 0.72}
        color="#fff4d6"
        castShadow={settings.shadows}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[0, 14, 0]} intensity={isNight ? settings.light * 1.6 : settings.light * 0.55} color="#ffdfa0" distance={50} />
      <pointLight position={[-12, 10, -8]} intensity={settings.light * 1.2} color="#8fc8ff" distance={60} />
      <pointLight position={[12, 10, -8]} intensity={settings.light * 1.2} color="#8fc8ff" distance={60} />

      <group>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[26, 96]} />
          <meshStandardMaterial color="#315b3b" roughness={0.95} metalness={0.02} />
        </mesh>

        <mesh position={[0, 0.045, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <ringGeometry args={[25.3, 25.42, 96]} />
          <meshStandardMaterial color="#e3ddba" roughness={0.9} />
        </mesh>

        <group scale={[boundaryX / DEFAULT_BOUNDARY_X, 1, boundaryZ / DEFAULT_BOUNDARY_Z]}>
          <mesh position={[0, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <ringGeometry args={[19.8, DEFAULT_BOUNDARY_X, 128]} />
            <meshStandardMaterial color="#477a40" roughness={0.98} />
          </mesh>
          <mesh position={[0, 0.14, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
            <torusGeometry args={[DEFAULT_BOUNDARY_X, 0.13, 8, 160]} />
            <meshStandardMaterial color="#f0e5c4" roughness={0.68} />
          </mesh>
          <mesh position={[0, 0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[DEFAULT_BOUNDARY_X, 0.035, 6, 160]} />
            <meshStandardMaterial color="#e1a546" roughness={0.56} />
          </mesh>
        </group>

        {[outerStandRadius + 1.5, outerStandRadius + 5, outerStandRadius + 8.5].map((radius, index) => (
          <group key={`stand-tier-${radius}`}>
            <mesh position={[0, 2.7 + index * 2.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[radius, radius + 3.1, 128]} />
              <meshStandardMaterial color={index === 0 ? '#33444a' : index === 1 ? '#293a43' : '#202f39'} roughness={0.88} />
            </mesh>
            <mesh position={[0, 3.75 + index * 2.25, 0]}>
              <cylinderGeometry args={[radius + 2.8, radius + 2.8, 2.1, 128, 1, true]} />
              <meshStandardMaterial color={index === 0 ? '#43515a' : '#303e47'} roughness={0.86} side={2} />
            </mesh>
            <mesh position={[0, 2.82 + index * 2.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[radius + 0.1, 0.09, 6, 128]} />
              <meshStandardMaterial color={index === 0 ? '#d9d3bb' : '#82908d'} roughness={0.72} />
            </mesh>
          </group>
        ))}

        <mesh position={[0, 10.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[34.2, 34.6, 128]} />
          <meshStandardMaterial color="#202a30" metalness={0.42} roughness={0.62} />
        </mesh>

        <mesh position={[0, 0.055, 0]} receiveShadow>
          <boxGeometry args={[3.2, 0.08, 19]} />
          <meshStandardMaterial
            color={match.pitchCondition === 'green' ? '#77815c' : match.pitchCondition === 'dry' ? '#b79868' : '#ae9365'}
            roughness={0.96}
          />
        </mesh>

        {[-9.15, 9.15].map((z) => (
          <mesh key={`crease-${z}`} position={[0, 0.105, z]}>
            <boxGeometry args={[3.5, 0.025, 0.09]} />
            <meshStandardMaterial color="#f2edda" roughness={0.75} />
          </mesh>
        ))}

        <mesh position={[0, 0.07, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[8.4, 8.48, 96]} />
          <meshStandardMaterial color="#dce4c7" roughness={0.9} />
        </mesh>

        <mesh position={[0, 0.6, -14.4]} castShadow>
          <cylinderGeometry args={[0.6, 0.6, 0.12, 20]} />
          <meshStandardMaterial color="#dfe6ef" metalness={0.2} roughness={0.4} />
        </mesh>

        {Array.from({ length: settings.crowd }).map((_, index) => {
          const angle = (index / settings.crowd) * Math.PI * 2;
          const tier = index % 3;
          const radius = outerStandRadius + 2.4 + tier * 3.5 + (Math.floor(index / 3) % 4) * 0.08;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          const tierY = 3.25 + tier * 2.25;
          return (
            <group key={`crowd-${index}`} position={[x, tierY, z]} rotation={[0, -angle - Math.PI / 2, 0]}>
              <mesh position={[0, 0.25, 0]}>
                <capsuleGeometry args={[0.085, 0.3, 3, 8]} />
                <meshStandardMaterial color={['#dbb45e', '#769ab4', '#a94b4b', '#d2d3cb', '#54785f'][index % 5]} roughness={0.9} />
              </mesh>
              <mesh position={[0, 0.52, 0.015]}>
                <sphereGeometry args={[0.072, 8, 7]} />
                <meshStandardMaterial color={['#e8c9a2', '#b77f5f', '#d7a982', '#9d6d50'][index % 4]} roughness={0.9} />
              </mesh>
            </group>
          );
        })}

        {isNight && [0, 1, 2, 3].map((index) => {
          const angle = Math.PI / 4 + index * Math.PI / 2;
          const x = Math.cos(angle) * 34;
          const z = Math.sin(angle) * 34;
          return (
          <group key={`light-${index}`} position={[x, 0, z]}>
            <mesh position={[0, 7, 0]} castShadow>
              <cylinderGeometry args={[0.14, 0.24, 14, 10]} />
              <meshStandardMaterial color="#69767a" metalness={0.6} roughness={0.52} />
            </mesh>
            <mesh position={[0, 14.2, 0]} castShadow>
              <boxGeometry args={[1.8, 0.48, 0.8]} />
              <meshStandardMaterial color="#fff6d4" emissive="#f9d98c" emissiveIntensity={2.1} />
            </mesh>
            <pointLight position={[0, 13.8, 0]} intensity={settings.light * 5} color="#ffebba" distance={58} />
          </group>
          );
        })}

        <group ref={pitcherRef} position={cricketField[0].position}>
          <HumanPlayer
            appearanceKey={match.bowlerName}
            position={[0, 0, 0]}
            jersey={cricketField[0].jersey}
            pants={cricketField[0].pants}
            skin={cricketField[0].skin}
            pose={cricketField[0].pose}
            scale={cricketField[0].scale}
            batting={cricketField[0].batting}
          />
        </group>

        <group ref={batterRef} position={cricketField[1].position}>
          <HumanPlayer
            appearanceKey={match.playerName}
            position={[0, 0, 0]}
            jersey={cricketField[1].jersey}
            pants={cricketField[1].pants}
            skin={cricketField[1].skin}
            pose={cricketField[1].pose}
            scale={cricketField[1].scale}
            batting={cricketField[1].batting}
            swingKey={match.ballInPlay ? `${match.innings}-${match.overs}-${match.ballsInOver}-${match.score}-${match.wickets}` : 'idle'}
            shot={match.selectedShot}
          />
        </group>

        {cricketField.slice(2).map((player, index) => (
          <HumanPlayer
            key={player.key}
            appearanceKey={`${player.key}-${index}`}
            position={player.position}
            jersey={player.jersey}
            pants={player.pants}
            skin={player.skin}
            pose={player.pose}
            scale={player.scale}
            batting={player.batting}
          />
        ))}

        <HumanPlayer position={[1.3, 0, 6.8]} jersey="#f1eee4" pants="#18202a" skin="#c58d68" pose="fielding" scale={1.04} appearanceKey="bowler-end-umpire" />
        <HumanPlayer position={[-2.8, 0, -2.8]} jersey="#f1eee4" pants="#18202a" skin="#d2a07c" pose="fielding" scale={0.98} appearanceKey="square-leg-umpire" />

        <group ref={ballRef} position={[0, 0.2, 9.2]} castShadow>
          <mesh>
            <sphereGeometry args={[0.085, 28, 22]} />
            <meshStandardMaterial color="#9d202b" roughness={0.42} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.065, 0.005, 6, 32]} />
            <meshStandardMaterial color="#f2d9c0" roughness={0.68} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, Math.PI / 5]}>
            <torusGeometry args={[0.065, 0.004, 6, 32]} />
            <meshStandardMaterial color="#f2d9c0" roughness={0.68} />
          </mesh>
        </group>

        <mesh position={[0, 0.22, -15.2]} castShadow>
          <cylinderGeometry args={[1.2, 1.2, 0.1, 26]} />
          <meshStandardMaterial color="#b4c1d1" metalness={0.32} roughness={0.44} />
        </mesh>

        <mesh position={[0, 1.8, 17]} rotation={[0, Math.PI, 0]}>
          <cylinderGeometry args={[2.4, 2.4, 0.2, 26]} />
          <meshStandardMaterial color="#223d52" emissive="#0a2430" emissiveIntensity={0.5} />
        </mesh>
      </group>

      <fog attach="fog" args={[match.weather === 'cloudy' ? '#35404a' : '#10231d', 25, 76]} />
      <color attach="background" args={[match.weather === 'cloudy' ? '#35404a' : '#10231d']} />
    </>
  );
}
