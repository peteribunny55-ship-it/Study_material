# Ultra Cricket AI Development Plan

## Phase 1 — Playable core match

- 3D stadium and pitch foundation
- Single batter and bowler simulation
- Ball physics and trajectory handling
- Scoring, wicket logic and extras
- Simple AI batting and bowling
- HUD and scorecard UI

## Phase 2 — Full cricket systems

- Batting shot library and shot timing
- Bowling variations and delivery types
- Fielding logic and catches
- Official rule enforcement and DRS scaffold
- Match formats and innings logic

## Phase 3 — Presentation, teams and stadiums

- Team kits, players and stadium selection
- Broadcast presentation and match overlays
- Crowd, anthems and audio layers
- Camera systems, replay and environment effects

## Phase 4 — Career, tournament and challenge modes

- Player career progression
- Tournament bracket systems
- Practice and challenge scenarios
- Unlockables and achievements

## Phase 5 — Multiplayer and backend

- Auth and user profiles
- Server-authoritative match state
- WebSocket rooms and matchmaking
- Leaderboards and validation checks

## Phase 6 — Packaging, optimization and QA

- Desktop packaging
- Android responsive support
- Performance tuning, LOD and quality presets
- Final verification and regression testing

## Architecture

- Frontend: React + TypeScript + Three.js + React Three Fiber
- Physics: custom ball and collision logic with a future Rapier upgrade path
- Backend: Node.js + TypeScript + WebSocket server
- Shared rules: TypeScript models and deterministic game-state logic
- Persistence: local save system and server schema for future cloud sync
