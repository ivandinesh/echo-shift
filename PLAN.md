# ECHO SHIFT — Product & Delivery Plan

**Concept:** A minimalist solo puzzle game where your previous moves return as a delayed echo.

**Tagline:** *Your last move comes back.*

## 1. Product goal

Build a small, polished game that is easy to understand, satisfying to replay, and installable as a web app on mobile and desktop. The full single-player experience must work offline after the first visit. No account, matchmaking, or server connection is needed to play.

The design target is a compact puzzle game with a strong core mechanic, fast onboarding, tactile feedback, and a replay loop that encourages “one more satisfying puzzle” without streak pressure, artificial urgency, or punitive retention mechanics.

## 2. Core game

### Board and pieces

- Compact grid, starting at 5 × 5.
- The player controls a bright mote.
- A second ghost-like mote is the delayed echo.
- Each level has a matching exit for each mote.
- Walls block movement.
- Optional collectible sparks can add side objectives later.

### Rule

The player chooses one direction per turn.

1. The bright mote moves immediately.
2. The echo repeats the direction chosen **two turns earlier** from its own position.
3. A move into a wall leaves that mote in place.
4. The level is complete when both motes reach their matching exits.

The puzzle is solved by planning a sequence that works for both pieces at once.

### Turn sequence example

1. Player swipes or presses an arrow key.
2. Bright mote performs the new move.
3. Echo performs the input from two turns ago.
4. UI previews the next delayed move.
5. Player plans the next input.

### Controls

- Touch swipe.
- Arrow keys.
- WASD.
- Visible directional controls for accessibility.
- Undo.
- Restart.
- Pause where useful.

### Feedback

- Brief movement animation.
- Clear distinction between bright mote and ghost mote.
- Faint preview for the echo's next move.
- Optional haptics on supported mobile devices.
- Sound toggle.
- Motion / reduced-motion setting.
- Strong completion feedback.

## 3. Modes and replay loop

### Learn

Six short tutorial levels:

1. Basic movement.
2. Introduce two-turn delay.
3. Walls.
4. Separate exits.
5. Planning around blocked echo movement.
6. Full mechanic with a small challenge.

The player should understand the mechanic by doing rather than reading a long explanation.

### Daily Shift

- One puzzle derived from the local date.
- Deterministic and generated locally.
- Same date produces the same puzzle.
- No backend required.
- Shareable text result.
- Missing a day has no penalty.

### Flow mode

- Endless stream of solvable levels.
- Difficulty grows gradually.
- Initial MVP can use a curated pool instead of procedural generation.
- Procedural generation should only ship once a solver verifies solvability and reasonable pacing.

### Personal bests

Track locally:

- Total levels solved.
- Fewest moves per level.
- Best Daily Shift results.
- Flow streak / run best.
- Cosmetic palette unlocks.

A streak is a record, not a punishment mechanic.

## 4. MVP scope

### Include

- Responsive 5 × 5 game board.
- Exact two-turn delayed echo rule.
- Tutorial set.
- At least 30 curated levels.
- Daily Shift.
- Replayable Flow mode.
- Undo.
- Restart.
- Pause where needed.
- Keyboard input.
- Touch input.
- Visible directional controls.
- Local progress save.
- Settings.
- Shareable text result.
- PWA manifest.
- App icons at required sizes.
- Standalone launch mode.
- Offline cache.

### Defer

- Accounts.
- Cloud sync.
- Multiplayer.
- Global leaderboards.
- Advertising.
- Push notifications.
- Paid random rewards.
- Procedural generation without solver validation.

## 5. Technical architecture

### Client

Use TypeScript with a lightweight web build tool. A good default is Vite with vanilla TypeScript or a small UI layer if component complexity later justifies it.

Avoid framework overhead until the game needs it.

### Rendering

Prefer semantic HTML/CSS for the grid unless Canvas becomes clearly beneficial. The visible controls and game state must remain accessible to keyboard and assistive technology.

### Game engine

Keep gameplay deterministic and independent from rendering.

Core modules should include:

- `GameState`
- `LevelDefinition`
- `MoveDirection`
- delayed input queue
- collision resolver
- turn reducer
- win-state evaluator
- undo history
- move counter

Rules must be unit-testable without a browser.

### State model

A turn should be representable as a pure transformation:

`nextState = applyTurn(currentState, playerDirection)`

The state should include at minimum:

- Player position.
- Echo position.
- Delayed input queue.
- Turn number.
- Move count.
- Completion state.
- History needed for undo.

### Level format

Keep level definitions separate from rendering.

Example fields:

- id
- width
- height
- walls
- playerStart
- echoStart
- playerExit
- echoExit
- optional moveLimit
- optional sparks
- tutorial metadata
- verified solution metadata

### Persistence

Use local storage for the first implementation unless data structure complexity makes IndexedDB worthwhile.

Persist:

- tutorial progress
- level completion
- best move counts
- daily results
- settings
- palette unlocks

No personal data is required.

### Offline

Use a service worker to cache:

- app shell
- JS/CSS bundles
- icons
- bundled level definitions

The full game must remain playable after first successful load.

### Installability

Provide:

- HTTPS hosting.
- Web app manifest.
- App name and short name.
- 192 px icon.
- 512 px icon.
- start URL.
- standalone display mode.
- theme colors.

### Hosting

Static Vercel hosting is sufficient for the MVP.

No runtime backend should be required for gameplay.

## 6. Project phases

### Phase 0 — Launch page

Status: started.

Deliverables:

- Distinct launch identity.
- Live teaser board.
- Responsive layout.
- CTA hooks for future game entry and launch notification flow.
- Initial PWA shell.

Completion check:

- Production page loads successfully on Vercel.
- Main assets return 200.
- Mobile layout remains legible.

### Phase 1 — Rules prototype

Implement:

- Grid engine.
- Player movement.
- Echo movement with exact two-turn delay.
- Walls.
- Matching exits.
- Undo.
- Restart.
- Completion state.

Tests:

- Echo performs no movement before delayed input exists.
- Echo uses exactly the input from two turns earlier.
- Wall collision leaves the affected mote in place.
- Undo restores positions, queue, counters, and completion state.
- Restart restores original level state.

Playtest with 10 hand-authored levels.

### Phase 2 — Tutorial and curated puzzle set

Build:

- Six tutorial levels.
- At least 30 curated levels total.
- Difficulty ramp.
- Verified solutions.
- Optional move limits.

Add a lightweight solver or validation tool for authored levels.

Completion check:

- New players understand the rule without a long explanation.
- Every shipped level has at least one verified solution.

### Phase 3 — Game feel

Add:

- Movement animation.
- Echo preview.
- Sound effects.
- Haptics where supported.
- Reduced-motion behavior.
- Palette system.
- Results screens.
- Local records.

Completion check:

- Touch and keyboard both feel clear.
- Mute works.
- Reduced motion works.
- State feedback is unambiguous.

### Phase 4 — Daily Shift and Flow mode

Daily Shift:

- Deterministic date seed.
- Local puzzle selection or generation.
- Share result text.

Flow:

- Start with curated puzzle sequencing.
- Add optional difficulty selector.
- Only enable procedural generation after solver-backed validation exists.

### Phase 5 — PWA and offline hardening

Add / validate:

- Final manifest.
- Final app icons.
- Service worker update strategy.
- Offline app shell.
- Cached level data.
- Local persistence migration strategy.

Completion check:

- Install from supported browsers.
- Launch standalone.
- Reload offline.
- Complete a level offline after first load.

### Phase 6 — Release QA

Test:

- small mobile screens
- large phones
- tablets
- desktop
- keyboard-only use
- touch-only use
- reload
- offline reload
- save persistence
- service worker update
- undo edge cases
- restart edge cases
- completion edge cases
- reduced motion
- mute
- PWA install behavior

## 7. Acceptance criteria

- A new player can complete the first tutorial level in under one minute.
- The echo always repeats the correct input after exactly two turns.
- Undo restores the delayed queue correctly.
- Restart restores the delayed queue correctly.
- Every shipped level has a verified solution.
- Completion state is obvious.
- Touch is supported.
- Keyboard is supported.
- Visible controls are supported.
- Saved progress survives reload.
- Saved progress remains available offline.
- App remains playable offline after first load.
- App can be installed where browser/platform PWA support allows it.
- No account is required.
- No external game API is required.
- No network call is required during normal play.

## 8. Quality metrics

Measure product quality through short play sessions.

Useful signals:

- Tutorial completion.
- Level completion.
- Restarts per level.
- Undo usage.
- Voluntary replay.
- Daily Shift completion.
- Flow depth.
- Abandoned levels.

Analytics, if added, must be optional and anonymous.

The product goal is not retention pressure. It is clarity, satisfaction, and replay desire.

## 9. UX principles

- Explain by interaction, not paragraphs.
- Keep the board visually dominant.
- Make delayed movement readable before it happens.
- Do not punish missed days.
- Avoid dark patterns.
- Avoid forced notifications.
- Avoid paid random rewards.
- Keep restarts fast.
- Keep transitions brief.
- Prefer readable game state over decorative animation.

## 10. Visual direction

Launch identity can stay playful, internet-native, and high-energy, but the actual puzzle board should remain readable.

Current launch tone:

- dark base
- bright neon accent
- ghost / echo glow
- monospace system language
- playful Gen-Z copy
- compact UI labels

For gameplay, reduce visual noise around the board so planning remains easy.

## 11. Suggested repository structure

```text
/
├─ index.html
├─ PLAN.md
├─ AGENTS.md
├─ README.md
├─ public/
│  ├─ icons/
│  └─ manifest.webmanifest
├─ src/
│  ├─ game/
│  │  ├─ types.ts
│  │  ├─ reducer.ts
│  │  ├─ rules.ts
│  │  ├─ solver.ts
│  │  └─ rules.test.ts
│  ├─ levels/
│  │  ├─ tutorial.ts
│  │  └─ curated.ts
│  ├─ persistence/
│  │  └─ storage.ts
│  ├─ pwa/
│  │  └─ registerServiceWorker.ts
│  ├─ ui/
│  └─ main.ts
└─ tests/
```

The exact structure can evolve, but game rules must remain separable from DOM rendering.

## 12. First implementation slice after launch page

Build a single playable tutorial level before adding more marketing work.

Required slice:

1. Replace teaser board with a real 5 × 5 state-driven board.
2. Implement `applyTurn` as a pure function.
3. Store the last two player directions in the delay queue.
4. Move the echo using the oldest queued direction.
5. Implement wall collision.
6. Implement player and echo exits.
7. Add restart.
8. Add undo.
9. Add keyboard controls.
10. Add touch swipe.
11. Add visible directional buttons.
12. Add unit tests for delayed timing.
13. Ship one tutorial level to production.

Only after this slice feels correct should the team scale level content.

## 13. Research references

- MDN PWA installability guidance: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable
- MDN offline/background operation guidance: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Offline_and_background_operation
- Google game session design guidance: https://developers.google.com/assistant/games/guide/players

These references support the PWA and short-session choices. The delayed-echo mechanic and game structure are original design proposals for ECHO SHIFT.
