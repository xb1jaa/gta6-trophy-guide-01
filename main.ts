// Leonida Trophy Guide — GTA VI (PS5), a make.fun entry for gta6-trophy-guide-01.
// Node 22, standard library only. The guide itself is plain static files in
// app/ (index.html, style.css, app.js and app/data/trophies.json) that a desktop
// browser opens and runs with the network off; nothing is fetched at run time.
// This program hands the entry in: it copies app/ and screenshots/ from beside
// this file into the output directory and writes output/dossier.json with the
// vendored make.fun library, exactly as the scorer rebuilds it. Leave
// vendor/makefun-frontend.ts untouched — the gate compares the two byte for byte.
//
// Run it outside the grader with MAKEFUN_OUTPUT_DIR standing in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const appDir = join(here, 'app');
const shotsDir = join(here, 'screenshots');

// Fail loudly instead of handing in a half-empty entry.
if (!existsSync(join(appDir, 'index.html'))) throw new Error('app/index.html is missing');
if (!existsSync(join(appDir, 'data', 'trophies.json'))) throw new Error('app/data/trophies.json is missing');
const shots = existsSync(shotsDir)
  ? readdirSync(shotsDir).filter((f) => statSync(join(shotsDir, f)).isFile())
  : [];
if (shots.length < 3 || shots.length > 4) throw new Error(`need 3 or 4 screenshots, found ${shots.length}`);

mkdirSync(out, { recursive: true });
cpSync(appDir, join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
cpSync(shotsDir, join(out, 'screenshots'), { recursive: true });

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the
// bytes; the others refuse an entry the scorer would refuse — more than 4
// screenshots or one over 256 KiB; more than 993 files and directories in app/
// or 48 MiB of app files, which count beside /output's own 1000-entry cap.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 50331648 }),
);
