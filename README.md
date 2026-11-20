# ECHO SHIFT

**Play now:** https://www.popdo.xyz/

A free, offline-first 5 × 5 puzzle game. The bright mote follows your current input; the cyan echo repeats the same direction **exactly two turns later**, from its own location. Get both to their matching exits.

## Game modes

- **Learn:** six short lessons, resuming at the next uncompleted lesson.
- **Journey:** 30 levels with selectable unlocked stages and saved personal bests.
- **Daily Shift:** a reproducible puzzle based on the device's local date.
- **Flow:** continuously cycle levels and chase your longest run.

## Controls

- Desktop: arrow keys or WASD; Z undo; R restart.
- Mobile: swipe the board or use the visible directional pad.
- Undo and restart are always available before completion.
- Settings: sound, haptics and motion.
- Local progress and scores save to this browser; no login or analytics.

## Gameplay contract

For each player input at turn `t`:
1. The player attempts to move immediately.
2. The echo attempts the input from `t-2`, or remains stationary for the first two turns.
3. Both movement attempts obey board limits and walls independently.
4. Even a blocked input advances the queue.
5. Completion requires the player and echo simultaneously on their designated exits.

## Run locally

Serve the repository as static files with a local HTTP server, e.g. `python3 -m http.server 8000`. Open http://localhost:8000/. No build or external API keys are necessary.

## Deployment and SEO

- Production: `www.popdo.xyz` (canonical).
- Hosting: Vercel, project `echo-shift`, team `kankar`, GitHub `main`.
- `robots.txt`, `sitemap.xml`, metadata, Open Graph, PNG social art and VideoGame JSON-LD are present.
- See [SEO.md](SEO.md) for Google/Bing Search Console submission and further launch steps.
- See [PLAN.md](PLAN.md) and [AGENTS.md](AGENTS.md) for product scope and engineering rules.

## Known next-level quality work

The game is playable today, but puzzle difficulty still needs hands-on tuning and testing across physical mobile devices and screen readers. PWA/offline support should be verified per browser. There is no backend, account, leaderboard, or analytics.
