# AGENTS.md — ECHO SHIFT Implementation Guide

This file defines the working rules for coding agents contributing to ECHO SHIFT.

## Mission

Build ECHO SHIFT as a tiny, polished, deterministic puzzle game whose defining rule is simple and never ambiguous:

> The player moves now. The echo repeats the player's input from exactly two turns earlier.

The game must remain understandable, testable, offline-capable, and fun without requiring accounts, a backend, or retention pressure.

## Product priorities

When tradeoffs appear, prioritize in this order:

1. Correct delayed-echo timing.
2. Clear readable game state.
3. Fast input and restart loop.
4. Accessibility.
5. Offline reliability.
6. Small bundle / simple architecture.
7. Visual polish.
8. Additional modes and cosmetics.

Never sacrifice rule correctness for animation or styling.

## Core mechanic contract

For every player turn:

1. Accept exactly one direction: up, right, down, or left.
2. Move the bright/player mote immediately from its current position.
3. Read the direction chosen exactly two player turns earlier.
4. If such a direction exists, apply it to the echo from the echo's current position.
5. A blocked move leaves the affected mote in place but still counts as the input for delay purposes.
6. Append the current player direction to the delay queue.
7. Evaluate completion after movement resolves.

The delay is based on **player inputs**, not successful movement.

Wall collisions do not remove, skip, or rewrite queued inputs.

## Determinism

The game engine must be deterministic.

Given the same:

- level definition
- initial state
- ordered input sequence

the resulting state must always be identical.

Do not put randomness, animation timing, timestamps, DOM reads, or persistence logic inside rule resolution.

## Engine architecture

Gameplay rules must be usable without a browser.

Prefer pure functions such as:

```ts
const nextState = applyTurn(state, direction)
```

Core engine code must not depend on:

- `document`
- `window`
- CSS
- animation callbacks
- storage APIs
- network APIs

Rendering reads state; it does not define rules.

## Recommended state shape

Use explicit data rather than hidden mutable state.

A game state should cover at least:

```ts
interface GameState {
  levelId: string
  player: Position
  echo: Position
  delayedMoves: Direction[]
  turn: number
  moves: number
  completed: boolean
}
```

Undo history may live alongside the active state, but restoring an undo must restore the entire logical state, including the delayed move queue.

## Level definitions

Level data must remain declarative and separate from engine logic.

A level should include at least:

```ts
interface LevelDefinition {
  id: string
  width: number
  height: number
  walls: Position[]
  playerStart: Position
  echoStart: Position
  playerExit: Position
  echoExit: Position
  moveLimit?: number
}
```

Optional later fields may include:

- sparks
- tutorial copy
- palette
- difficulty
- tags
- verified solution
- par move count

Do not encode level-specific exceptions inside the reducer.

## Required tests

Before expanding level content, the engine must have automated tests covering:

### Delay timing

- Turn 1: echo does not execute the new input.
- Turn 2: echo still does not execute turn 2 input.
- Turn 3: echo executes turn 1 input.
- Turn 4: echo executes turn 2 input.
- Long sequences preserve exact ordering.

### Collision behavior

- Player hitting a wall stays in place.
- Echo hitting a wall stays in place.
- A blocked player input still enters the delay queue.
- A blocked echo move does not alter queue timing.

### Undo

Undo must restore:

- player position
- echo position
- delayed queue
- move count
- turn count
- completion state

### Restart

Restart returns the entire logical state to the level's exact initial state.

### Completion

- Player alone on exit does not complete the level.
- Echo alone on exit does not complete the level.
- Both on their matching exits completes the level.
- Matching exits must not be accidentally swapped unless a level explicitly defines shared exits in the future.

## Solver requirements

Do not ship procedural generation before a solver or equivalent verifier exists.

For curated levels, maintain a known valid solution.

A solver should operate on engine state, not DOM state.

Prefer breadth-first search initially because boards are small and optimal move counts are useful.

Solver output should support:

- solvable / unsolvable
- shortest known move sequence
- minimum move count

Generated levels must be rejected when they are:

- unsolvable
- trivially solved
- excessively long for their intended difficulty
- dependent on ambiguous mechanics

## UI requirements

The board is the primary interface.

Always make visually distinct:

- player mote
- echo mote
- player exit
- echo exit
- walls
- echo's next queued direction

The UI must never make the delayed move look like simultaneous follower movement.

Prefer short animations that communicate state changes without slowing input.

## Input requirements

Support all of these for playable builds:

- Arrow keys
- WASD
- Swipe
- Visible directional buttons

Visible controls are not optional because they improve accessibility and discoverability.

Avoid accepting a second turn while an animation is in a state that would make visual and logical state diverge. Either queue the input deliberately or keep animations short enough that turn resolution remains clear.

## Accessibility

Required practices:

- Keyboard-complete gameplay.
- Visible focus states.
- Direction buttons with accessible labels.
- Do not encode game meaning by color alone.
- Respect `prefers-reduced-motion`.
- Provide a motion setting if motion grows beyond minimal transitions.
- Provide mute / sound setting when audio ships.
- Maintain good foreground/background contrast.

If using Canvas later, provide equivalent semantic controls and textual state where needed.

## Persistence

Persist locally only for the MVP.

Store:

- tutorial progress
- completed levels
- personal best moves
- daily result
- settings
- cosmetic unlocks

Do not require:

- login
- email
- device fingerprinting
- external profile services

Use versioned persistence data so future schema changes can migrate safely.

Example:

```ts
{
  version: 1,
  progress: {},
  settings: {}
}
```

## Offline and PWA

Gameplay must not depend on live network access.

The service worker should cache the app shell and bundled level data.

Service worker changes must avoid trapping users on stale versions indefinitely. Prefer a simple versioned cache strategy and clean obsolete caches on activation.

Never cache opaque third-party API dependencies that gameplay requires; ideally gameplay has no such dependency.

## Daily Shift

Daily Shift must remain deterministic and local.

The same local calendar date should map to the same puzzle definition under the same game version.

If generation changes between releases, include a generation/version identifier so old shared results are not misleading.

Avoid relying on a remote daily API.

## Flow mode

Until procedural generation is proven safe, Flow mode should sequence curated, verified levels.

Do not fake procedural generation by serving unchecked random boards.

## Share output

Shareable results should default to text and avoid leaking private device information.

Example shape:

```text
ECHO SHIFT — Daily 2026-10-31
Solved in 14 moves
⬆️➡️⬇️...
Your last move comes back.
```

The exact representation can evolve.

## Styling direction

The current launch page uses a playful dark/neon internet-native tone.

Keep:

- dark base
- bright signal accent
- ghostly echo language
- compact system labels
- sharp typography
- playful copy

But gameplay readability outranks “brain rot” styling. If a visual joke makes the board harder to parse, remove it from the board and keep it in surrounding UI/copy.

## Copy direction

Marketing copy can be playful and Gen-Z-coded.

Core instructions must stay clear.

Good:

- “Your last move comes back.”
- “Move now. Get haunted two turns later.”

Avoid making tutorial instructions so slang-heavy that the mechanic becomes unclear.

## Performance

Target instant-feeling interaction on normal mobile hardware.

Avoid:

- large frameworks without clear need
- heavy animation libraries for simple motion
- unnecessary network calls
- layout thrashing
- oversized images
- blocking startup work

The board is small. Keep the engine and rendering simple.

## Dependency policy

Add a dependency only when it removes meaningful complexity.

Before adding one, ask:

1. Can this be implemented safely in a small amount of TypeScript?
2. Does the dependency materially improve accessibility, correctness, testing, or maintainability?
3. Is the bundle/runtime cost justified?

Prefer platform APIs where reasonable.

## Git / change discipline

Keep commits focused.

Useful commit categories:

- `feat:` gameplay or product capability
- `fix:` bug fix
- `test:` tests
- `docs:` documentation
- `refactor:` behavior-preserving structure change
- `style:` visual-only changes
- `chore:` tooling / maintenance

Do not combine large engine rewrites with unrelated styling changes unless necessary.

## Definition of done for gameplay changes

A gameplay change is not done until:

- rule behavior is deterministic
- relevant tests pass
- keyboard flow works
- touch-visible-control flow is considered
- undo/restart consequences are checked
- offline behavior is not broken
- production build succeeds

## First milestone

The next engineering milestone is **one fully playable tutorial level in production**.

Required work:

1. Introduce TypeScript/build tooling.
2. Create game types.
3. Implement pure `applyTurn`.
4. Implement exact two-turn queue.
5. Implement collision handling.
6. Implement completion state.
7. Add undo.
8. Add restart.
9. Add keyboard input.
10. Add swipe input.
11. Add visible direction controls.
12. Add echo next-move preview.
13. Add tests for rule timing and state restoration.
14. Deploy the first tutorial to Vercel.

Do not build Daily Shift, Flow mode, cosmetics, analytics, or procedural generation before this milestone is stable.

## Reference plan

Read `PLAN.md` before making product-level changes.

When implementation and documentation disagree, prioritize:

1. explicit current user direction
2. core rule contract in this file
3. `PLAN.md`
4. existing code behavior

If a change intentionally alters the core mechanic, update both `PLAN.md` and this file in the same change.
