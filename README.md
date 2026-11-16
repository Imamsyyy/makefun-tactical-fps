# SALTLINE / Relay Siege

[![make.fun](https://make.fun/badge/threejs-fps-02.svg)](https://make.fun/c/threejs-fps-02)
[![Rank](https://make.fun/badge/threejs-fps-02/Imamsyyy/makefun-tactical-fps/rank.svg)](https://make.fun/c/threejs-fps-02)
[![Reward](https://make.fun/badge/threejs-fps-02/Imamsyyy/makefun-tactical-fps/reward.svg)](https://make.fun/c/threejs-fps-02)

An original, offline tactical FPS set in a coastal communications station. You and Rook infiltrate against three orange-armored sentries. Win by eliminating the sentries or connecting relay A and protecting a 25-second transmission. Sentries can sever the link. First to four rounds wins the operation.

## Play

Requires Node 22.18+ and desktop Chrome with WebGL2. No package installation.

```sh
node serve.ts
```

Open http://127.0.0.1:8080. The game directory also works on any static HTTP server. All runtime assets are local; no CDN, telemetry, account, or network API is used.

WASD moves; mouse aims; left mouse fires; R reloads; C crouches; Shift walks; G throws smoke; hold E near A to connect. Escape releases mouse capture. If pointer lock is refused, hold left mouse and drag to aim while firing. Rounds continue while the mouse is released.

Buy a Needle sidearm, Kite carbine, Heron marksman rifle, or armor between rounds. Smoke and a sidearm are issued each round. Winning earns $1800, losing earns $1300, and eliminating a sentry earns $250. Stop moving for accurate shots. Headshots inflict triple damage. Smoke obscures bot sight for ten seconds.

## Implementation

- `game/src/sim.js`: deterministic seeded combat, collision, 120 Hz update, rounds, economy, bot sight/hearing and routes, objective.
- `game/src/view.js`: original three.js geometry, coastal palette, shadows, generated signs, weapon, soldiers, smoke and tracers.
- `game/src/main.js`: input, synthesized audio, HUD, shop and read-only QA snapshots.
- `main.ts`: standard-library packaging through the unchanged official dossier library.

The three.js 0.187.0 files and dossier library are from the official kit, unchanged. Original map, names, models and audio; no commercial game assets. MIT license; third-party licenses are retained beside their files.

## Verify and package

```sh
node tests/simulation.mjs
MAKEFUN_OUTPUT_DIR=out node main.ts
```

Four screenshots are real 1280×720 Chrome JPEG captures: gameplay cover, briefing, loadout, and round debrief. The browser QA drives ordinary UI controls and keyboard/mouse events, checks a natural loss and next round, and records errors. Simulation tests cover headshots, elimination victory, objective transmission victory, defuse loss, timeout, armor/economy, movement/collision, reload and smoke.

No remote grade is claimed. The official competition has no local scorer. Headless Chrome refused pointer lock; fallback controls were tested. Independent screenshot critique was unavailable because the vision endpoint returned HTTP 403.

Built for [make.fun threejs-fps-02](https://make.fun/c/threejs-fps-02). [Join make.fun with the entrant's referral](https://make.fun/?ref=ytqx2z2p).
