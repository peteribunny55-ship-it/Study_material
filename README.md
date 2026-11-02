# Ultra Cricket AI

A production-oriented cricket game project built with React, TypeScript and Three.js. This repository ships a playable browser-based 3D cricket prototype, a modular game engine foundation, a backend scaffold, and a structured roadmap for extending the experience into a full commercial-grade cricket game.

## Quick start

1. Install dependencies:
   npm install
2. Start the browser game:
   npm run dev:web
3. Build for production:
   npm run build:web
4. Run tests:
   npm test

## Public hosting

The browser game can be hosted as a static site with GitHub Pages. The workflow at `.github/workflows/deploy-pages.yml` builds the Vite app and publishes `apps/web/dist` whenever `main` is pushed. In the repository's **Settings → Pages**, set the source to **GitHub Actions**. The project URL for this repository is `https://peteribunny55-ship-it.github.io/Study_material/`.

This static deployment does not require the development computer to stay on. It cannot guarantee uninterrupted availability, and local saves remain separate in each device/browser; cross-device saves require a backend and user accounts.

## Project structure

- apps/web — React + Three.js front-end game client
- apps/server — Node.js backend scaffold with WebSocket and match orchestration
- packages/shared — shared game types and rule logic
- docs — planning and design docs

## Current status

This version focuses on a genuinely playable core: a 3D stadium, pitch, ball physics, bowling/batting flow, scoring system, AI teammate/opponent logic, HUD, game modes, and local save functionality.

Quick matches now enforce a 20-over limit, stop play after a completed result, calculate required run rate from balls remaining, and rotate the two batters after odd runs and completed overs. Saved matches from earlier versions restore the non-striker from the selected team's roster.

The match setup supports T20 (two 20-over innings), ODI (two 50-over innings), and a four-innings Test format without an over limit. Limited-overs matches pause between innings, set the chase target from the first innings, and determine results on a completed chase or innings. Test matches record each innings and set a fourth-innings target. These are local single-player rules; online multiplayer, cloud saves, official competition formats such as DLS, follow-on decisions, and licensed player/stadium assets are not implemented.

The live scorecard tracks each batter's runs, balls, boundaries, and dismissal, plus bowler overs, runs, and wickets. It keeps completed-innings scorecards during the match and rotates bowling after each over. It does not yet model extras, bowling limits, or maiden overs.

New matches begin with an interactive heads-or-tails toss; the winner chooses whether to bat or bowl. The 3D ground includes a marked boundary rope, outfield apron, tiered stands, crowd figures, and floodlights. Scored fours roll toward the rope while sixes launch on a higher arc; shot choice influences the ball's direction. Two neutral-clothed umpire models, a shaped willow bat with visible grip and swing, and a red leather-style ball with seam detailing are also present. These visuals remain a stylized game simulation, not full physical ball/bat collision, a photoreal stadium scan, or broadcast-quality animation.

The match setup now offers T10 and custom 1–50-over innings alongside T20, ODI, and Test; three stadium presets with distinct in-game boundary dimensions; and selectable sunny/cloudy/windy conditions, day/night lighting, and balanced/green/dry pitches. Cloud and pitch choices adjust the delivery modifier, wind pushes the rendered ball, and boundary tests use the chosen ground dimensions. The live HUD identifies the selected preset. Stadium names are presentation presets, not claims of venue-accurate scans or surveyed boundary measurements.

The 3D squad uses procedurally varied fictional faces and an open-grille batter helmet. They are not photographic portraits or likenesses of the real players named in the roster. Recognizable real-player faces require licensed face scans or other authorized assets.

## Visual realism policy

This project intentionally avoids the low-poly, cartoon, toy-like visual direction shown in the prohibited reference. The goal is a more realistic cricket-broadcast aesthetic. Full photorealistic Player and stadium assets require licensed or sourced 3D content and are not implied to be complete by this prototype alone.

## Important note

This remains a browser-based single-player prototype, not a finished AAA or cross-platform release. Motion capture, console/mobile native builds, cloud play, online multiplayer, DLS, rain interruptions, DRS/UltraEdge/Hotspot, full contact physics, licensed player likenesses, and production-authentic venue assets are not implemented.
