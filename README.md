# ECHO SHIFT

> Your last move comes back.

A minimalist solo puzzle game where the player moves immediately and an echo repeats the player's direction from two turns earlier.

## Current state

This repository currently contains the initial launch/teaser page:

- responsive neon 5×5 board preview
- animated delayed-echo loop
- keyboard/touch-forward visual language
- reduced-motion support
- installable-web-app manifest scaffold
- offline app-shell service worker
- hookable CTA elements via `data-hook` attributes

## Launch page hooks

- `data-hook="play-teaser"` — future playable demo entry
- `data-hook="notify"` — future waitlist/email capture

## Run locally

Serve the directory with any static HTTP server. For example:

```bash
npx serve .
```

Service workers require HTTP/HTTPS rather than opening `index.html` directly from disk.

## Next build slice

1. Move game rules into a deterministic TypeScript state machine.
2. Implement the real two-turn delayed input queue.
3. Add undo/restart and keyboard/swipe controls.
4. Ship six tutorial levels and verified solution fixtures.
5. Add 192px/512px production icons and complete PWA installability checks.

## Product principles

- no account required
- offline-first play
- no streak punishment
- no forced notifications
- one-more-puzzle energy
