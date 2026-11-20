// Leonida Trophy Guide — GTA VI (PS5): an offline checklist and guide.
// The trophy list and guides come from app/data/trophies.json. Progress is a set
// of earned trophy names kept in localStorage, so it survives reloads and works
// with the network off; export/import moves that set between browsers.
const STORE_KEY = 'gta6-trophy-guide-01-v1';

const cardsEl = document.getElementById('cards');
const emptyEl = document.getElementById('empty');
const resultCountEl = document.getElementById('result-count');
const searchEl = document.getElementById('search');
const kindEl = document.getElementById('kind');
const gradeEl = document.getElementById('grade');
const missableOnlyEl = document.getElementById('missable-only');
const earnedOnlyEl = document.getElementById('earned-only');
const spoilerEl = document.getElementById('spoiler');

const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;
const sourceByName = new Map((doc.sources || []).map((s) => [s.name, s.url || null]));

let earned = new Set();
try {
  earned = new Set(JSON.parse(localStorage.getItem(STORE_KEY) ?? '[]'));
} catch {
  earned = new Set();
}
// Drop any stored name that is not one of the 55, so a stale file cannot lie.
earned = new Set([...earned].filter((name) => trophies.some((t) => t.name === name)));

function save() {
  localStorage.setItem(STORE_KEY, JSON.stringify([...earned].sort()));
}

function gradeLabel(grade) {
  return grade.charAt(0).toUpperCase() + grade.slice(1);
}

function kindLabel(kind) {
  return { story: 'Story', stranger: 'Stranger & character', activity: 'Activity', collectible: 'Collectible', robbery: 'Robbery', combat: 'Combat', exploration: 'Exploration', money: 'Money', other: 'Other' }[kind] || kind;
}

function renderProgress() {
  const total = trophies.length;
  const done = earned.size;
  const pct = Math.round((done / total) * 100);
  document.getElementById('progress-text').textContent = `${done} of ${total} earned`;
  document.getElementById('progress-pct').textContent = `${pct}%`;
  document.getElementById('progress-fill').style.width = `${pct}%`;
  const counts = {};
  for (const t of trophies) {
    counts[t.grade] = counts[t.grade] || { done: 0, total: 0 };
    counts[t.grade].total += 1;
    if (earned.has(t.name)) counts[t.grade].done += 1;
  }
  const order = ['platinum', 'gold', 'silver', 'bronze'];
  document.getElementById('grade-counts').replaceChildren(
    ...order.map((g) => {
      const s = document.createElement('span');
      s.textContent = `${gradeLabel(g)} ${counts[g].done}/${counts[g].total}`;
      return s;
    }),
  );
}

function renderRoadmap() {
  const stagesEl = document.getElementById('stages');
  stagesEl.replaceChildren();
  for (const stage of doc.roadmap || []) {
    const mine = trophies.filter((t) => t.stage === stage.stage);
    const done = mine.filter((t) => earned.has(t.name)).length;
    const box = document.createElement('div');
    box.className = 'stage';
    const h = document.createElement('h3');
    h.textContent = stage.title;
    const p = document.createElement('p');
    p.textContent = stage.text;
    const prog = document.createElement('p');
    prog.className = 'stage-progress';
    prog.textContent = `${done} of ${mine.length} trophies in this stage`;
    const ul = document.createElement('ul');
    for (const t of mine) {
      const li = document.createElement('li');
      li.textContent = `${t.name} — ${gradeLabel(t.grade)}${t.missable ? ' (possibly missable)' : ''}`;
      if (earned.has(t.name)) li.className = 'done';
      ul.append(li);
    }
    box.append(h, p, prog, ul);
    stagesEl.append(box);
  }
}

function sourceList(t) {
  const ul = document.createElement('ul');
  ul.className = 'sources';
  for (const name of t.sources || []) {
    const li = document.createElement('li');
    const url = sourceByName.get(name);
    if (url) {
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = name;
      li.append(a);
    } else {
      li.textContent = name;
    }
    ul.append(li);
  }
  return ul;
}

function trophyCard(t) {
  const isEarned = earned.has(t.name);
  const locked = spoilerEl.checked && t.hidden && !isEarned;
  const card = document.createElement('article');
  card.className = 'card' + (isEarned ? ' earned' : '') + (t.missable ? ' missable-card' : '');
  card.dataset.name = t.name;

  const top = document.createElement('div');
  top.className = 'card-top';
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = isEarned;
  box.setAttribute('aria-label', `Mark ${t.name} as earned`);
  box.addEventListener('change', () => {
    if (box.checked) earned.add(t.name);
    else earned.delete(t.name);
    save();
    render();
  });
  const name = document.createElement('h3');
  name.className = 'card-name';
  name.textContent = locked ? 'Hidden trophy' : t.name;
  top.append(box, name);
  card.append(top);

  if (locked) {
    const p = document.createElement('p');
    p.className = 'locked-note';
    p.textContent = 'Hidden on PlayStation until earned. Tick the box when it pops to reveal its name, description and guide — that is the spoiler setting at work.';
    card.append(p);
    return card;
  }

  const desc = document.createElement('p');
  desc.className = 'card-desc';
  desc.textContent = t.description;
  card.append(desc);

  const chips = document.createElement('div');
  chips.className = 'chips';
  const gradeChip = document.createElement('span');
  gradeChip.className = `chip grade-${t.grade}`;
  gradeChip.textContent = gradeLabel(t.grade);
  chips.append(gradeChip);
  const kindChip = document.createElement('span');
  kindChip.className = 'chip';
  kindChip.textContent = kindLabel(t.kind);
  chips.append(kindChip);
  if (t.hidden) {
    const hiddenChip = document.createElement('span');
    hiddenChip.className = 'chip hidden-chip';
    hiddenChip.textContent = 'Hidden on PS5';
    chips.append(hiddenChip);
  }
  if (t.missable) {
    const missChip = document.createElement('span');
    missChip.className = 'chip missable';
    missChip.textContent = 'Possibly missable';
    chips.append(missChip);
  }
  if (t.target) {
    const targetChip = document.createElement('span');
    targetChip.className = 'chip';
    targetChip.textContent = t.target_note ? `${t.target} — ${t.target_note}` : `Target: ${t.target}`;
    chips.append(targetChip);
  }
  card.append(chips);

  const details = document.createElement('details');
  const summary = document.createElement('summary');
  summary.textContent = 'Guide';
  const guide = document.createElement('p');
  guide.className = 'guide-text';
  guide.textContent = t.guide;
  details.append(summary, guide, sourceList(t));
  card.append(details);
  return card;
}

function visible(t) {
  const q = searchEl.value.trim().toLowerCase();
  if (q) {
    const hay = `${t.name} ${t.description} ${t.guide} ${t.kind} ${t.grade}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }
  if (kindEl.value !== 'all' && t.kind !== kindEl.value) return false;
  if (gradeEl.value !== 'all' && t.grade !== gradeEl.value) return false;
  if (missableOnlyEl.checked && !t.missable) return false;
  if (earnedOnlyEl.checked && !earned.has(t.name)) return false;
  return true;
}

function render() {
  renderProgress();
  renderRoadmap();
  const shown = trophies.filter(visible);
  cardsEl.replaceChildren(...shown.map(trophyCard));
  emptyEl.hidden = shown.length > 0;
  resultCountEl.textContent = `${shown.length} of ${trophies.length} trophies shown`;
}

function setAllGuides(open) {
  for (const d of cardsEl.querySelectorAll('details')) d.open = open;
}

document.getElementById('expand-all').addEventListener('click', () => setAllGuides(true));
document.getElementById('collapse-all').addEventListener('click', () => setAllGuides(false));
for (const el of [searchEl, kindEl, gradeEl, missableOnlyEl, earnedOnlyEl, spoilerEl]) {
  el.addEventListener('input', render);
  el.addEventListener('change', render);
}

document.getElementById('export').addEventListener('click', () => {
  const payload = { game: doc.game, platform: doc.platform, exported_at: new Date().toISOString(), earned: [...earned].sort() };
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
});

document.getElementById('import').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const names = Array.isArray(data) ? data : data.earned;
    if (!Array.isArray(names)) throw new Error('no earned list');
    const known = new Set(trophies.map((t) => t.name));
    const good = names.filter((n) => known.has(n));
    earned = new Set(good);
    save();
    render();
    alert(`Imported ${good.length} earned trophies${names.length - good.length ? ` (${names.length - good.length} unknown names ignored)` : ''}.`);
  } catch {
    alert('That file is not a trophy-progress export from this guide.');
  }
  e.target.value = '';
});

document.getElementById('reset').addEventListener('click', () => {
  if (!confirm('Clear all earned trophies? This cannot be undone.')) return;
  earned = new Set();
  save();
  render();
});

const sourceListEl = document.getElementById('source-list');
for (const s of doc.sources || []) {
  const li = document.createElement('li');
  if (s.url) {
    const a = document.createElement('a');
    a.href = s.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = s.name;
    li.append(a);
  } else {
    li.textContent = s.name;
  }
  sourceListEl.append(li);
}

render();
