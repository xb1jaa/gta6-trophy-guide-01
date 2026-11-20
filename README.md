# Leonida Trophy Guide — GTA VI (PS5)

[![make.fun](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/xb1jaa/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/xb1jaa/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

An offline guide and tracker for all **55 PlayStation 5 trophies of Grand Theft Auto VI** — 1 platinum, 2 gold, 6 silver, 46 bronze — entered in the [make.fun bounty](https://make.fun/bounty/gta6-trophy-guide-01).

## What it does

- **Every trophy, with its official name, description and grade**, and a guide written in my own words for each one, citing its sources beside it (PowerPyx, Push Square, KeenGamer, EGamers, GTA Spotter, GTA Zone, and the PSNProfiles / Exophase trophy list). Sources are cited, never copied.
- **A checklist that saves in your browser** (localStorage), plus **export and import** of your progress as JSON, so it moves between browsers.
- **Filters by kind** (story, stranger & character, activity, collectible, robbery, combat, exploration, money, other) and by grade, plus search, missable-only and earned-only views.
- **A spoiler setting** (on by default): story trophies stay hidden until earned — tick one off and its name, description and guide are revealed.
- **A roadmap to the platinum** in three stages — story (60–80 hours), the 100% checklist cleanup (about 100 hours), and the final sweep — built from the official descriptions, with per-stage progress.
- **Missable flags**, built from the official descriptions and the cited guides: only one trophy is possibly missable, **Positive Mental Attitude** (the Chapter 1 meditation at Jason's house), and its guide says exactly what to do and when.
- **Works fully offline**: open `app/index.html` in a desktop browser and nothing is fetched from the network. No Rockstar logo or official artwork anywhere — the look is my own.

## Open it

Open `app/index.html` in desktop Chrome (or any desktop browser), or serve `app/` with any static server. No build step, no dependencies.

## Hand it in

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Sources

Every guide cites its sources beside the trophy. The main ones: [PowerPyx — GTA 6 Trophy Guide & Roadmap](https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/), [Push Square — GTA 6 Trophy Guide and Roadmap](https://www.pushsquare.com/guides/gta-6-trophy-guide-and-roadmap), [KeenGamer](https://www.keengamer.com/articles/guides/gta-6-trophy-guide-platinum-roadmap-all-55-trophies/), [EGamers](https://egamers.io/gta-6-trophy-list-all-55-trophies-and-achievements-plus-the-hardest-ones/), [GTA Spotter](https://gtaspotter.com/en/guides/gta-6-trophies-and-achievements/), [GTA Zone](https://gta-zone.com/news/gta-6-trophies-achievements/), and the PSNProfiles / Exophase trophy list.

## License

MIT — see [LICENSE](LICENSE). Unofficial fan guide; Grand Theft Auto and GTA are trademarks of Rockstar Games / Take-Two Interactive.
