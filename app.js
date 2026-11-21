/* Scent of the Day – UI */

const STORE = { collection: 'sotd_v1_collection', log: 'sotd_v1_log', occasion: 'sotd_v1_occasion', removed: 'sotd_v1_removed' };

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}
function saveJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* privater Modus: ignorieren */ }
}

const clone = (x) => JSON.parse(JSON.stringify(x));

/* Sammlung laden: Standard-Düfte kommen immer aus der aktuellen data.js,
 * außer du hast sie selbst bearbeitet (edited) oder entfernt (removed).
 * Eigene Düfte bleiben erhalten. */
function loadCollection() {
  const stored = loadJSON(STORE.collection, null);
  const removed = new Set(loadJSON(STORE.removed, []));
  const byId = new Map((stored || []).map((s) => [s.id, s]));
  const out = [];
  DEFAULT_SCENTS.forEach((d) => {
    if (removed.has(d.id)) return;
    const own = byId.get(d.id);
    out.push(own && own.edited ? own : clone(d));
    byId.delete(d.id);
  });
  byId.forEach((s) => { if (!RETIRED_IDS.includes(s.id)) out.push(s); });
  return out;
}

const state = {
  view: 'heute',
  scents: loadCollection(),
  removed: loadJSON(STORE.removed, []),
  log: loadJSON(STORE.log, {}),
  occasion: loadJSON(STORE.occasion, 'ausgehen'),
  weather: null,
  location: FALLBACK_LOCATION,
  calMonth: new Date(),
  calSel: null,
  statsFilter: 'alle',
};

const $ = (sel) => document.querySelector(sel);
const app = () => $('#app');

function persist() {
  saveJSON(STORE.collection, state.scents);
  saveJSON(STORE.log, state.log);
  saveJSON(STORE.occasion, state.occasion);
  saveJSON(STORE.removed, state.removed);
}

function findScent(id) { return state.scents.find((s) => s.id === id); }
function displayName(s) { return (s.brand ? s.brand + ' ' : '') + s.name; }
function esc(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function occLabel(id) { return (OCCASIONS.find((o) => o.id === id) || { label: id }).label; }
function intensityDots(n) { return '●'.repeat(n) + '○'.repeat(5 - n); }

function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove('show'), 2200);
  if (navigator.vibrate) navigator.vibrate(8);
}

/* Tint = Farbe des Hero-Duftes */
function setTint(color) {
  document.documentElement.style.setProperty('--tint', color || '#2a0d14');
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', color || '#000000');
}

/* Kontext für die Auswahl */
function buildContext(occasion) {
  const today = dayKey();
  const recent = new Set();
  for (let i = 1; i <= 5; i++) {
    const id = state.log[shiftDay(today, -i)];
    if (id) recent.add(id);
  }
  const w = state.weather || { temp: 15, humidity: 50, precip: 0, code: 2, isDay: true };
  return {
    day: today,
    occasion,
    occasionLabel: occLabel(occasion),
    temp: w.temp,
    humidity: w.humidity,
    precip: w.precip,
    hour: new Date().getHours(),
    recent,
  };
}

function recommendation() {
  const ctx = buildContext(state.occasion);
  const ranked = rankScents(state.scents, ctx);
  const hero = ranked[0];
  const alts = ranked.slice(1, 3);
  return { ctx, hero, alts };
}

/* ---------- HEUTE ---------- */
function renderHeute() {
  const { ctx, hero, alts } = recommendation();
  const s = hero ? hero.scent : null;
  const worn = state.log[ctx.day];
  const wl = weatherLabel(state.weather ? state.weather.code : 2);
  const w = state.weather;

  const occButtons = OCCASIONS.map((o) =>
    `<button class="${o.id === state.occasion ? 'on' : ''}" data-occ="${o.id}">${o.label}</button>`).join('');

  const kayaHint = [s, ...alts.map((a) => a.scent)].some((x) => x && x.spray)
    ? `<div class="banner glass fade-in"><span class="emoji">💨</span><span>Kaya hält bei dir kaum – <b>nachsprühen</b> nach etwa 3 Stunden.</span></div>` : '';

  const heroHtml = s ? `
    <section class="glass hero" style="--tint:${s.color}">
      <div class="eyebrow">Duft des Tages · ${esc(ctx.occasionLabel)}</div>
      <div class="name">${esc(s.name)}</div>
      <div class="brand">${esc(s.brand || '')}</div>
      <p class="reason">${esc(hero.why.length ? buildReason(hero, ctx) : buildReason(hero, ctx))}</p>
      <div class="chips">
        <span class="chip">${esc(s.family)}</span>
        <span class="chip">${intensityDots(s.intensity)}</span>
        <span class="chip">ideal ${s.temp[0]}–${s.temp[1]} °C</span>
        ${s.favorite ? '<span class="chip fav">★ Favorit</span>' : ''}
        ${s.spray ? '<span class="chip warn">hält kaum</span>' : ''}
        ${!s.verified ? '<span class="chip">Noten unbestätigt</span>' : ''}
      </div>
      <div class="notes">
        ${s.notes.top.length ? `<div class="row"><b>Kopf</b><span>${esc(s.notes.top.join(', '))}</span></div>` : ''}
        ${s.notes.heart.length ? `<div class="row"><b>${s.notes.top.length || s.notes.base.length ? 'Herz' : 'Noten'}</b><span>${esc(s.notes.heart.join(', '))}</span></div>` : ''}
        ${s.notes.base.length ? `<div class="row"><b>Basis</b><span>${esc(s.notes.base.join(', '))}</span></div>` : ''}
      </div>
      <button class="btn ${worn === s.id ? 'done' : 'primary'}" data-wear="${s.id}">
        ${worn === s.id ? '✓ Heute getragen' : 'Heute getragen'}
      </button>
    </section>` : `<section class="glass hero"><h3>Keine Düfte in der Sammlung</h3><p class="muted" style="margin-top:8px">Füge in „Sammlung“ deine Düfte hinzu.</p></section>`;

  const altHtml = alts.map((a) => `
    <div class="glass alt" data-open="${a.scent.id}">
      <div class="eyebrow" style="font-size:11px">Alternative</div>
      <div class="name">${esc(displayName(a.scent))}</div>
      <div class="why">${esc(a.scent.family)} · ${intensityDots(a.scent.intensity)}</div>
      <button class="btn" data-wear="${a.scent.id}">${worn === a.scent.id ? '✓ getragen' : 'Heute tragen'}</button>
    </div>`).join('');

  const weatherHtml = w ? `
    <section class="glass weather">
      <div class="icon">${wl.icon}</div>
      <div>
        <div class="temp">${Math.round(w.temp)} °C</div>
        <div class="muted small">${wl.text}</div>
        <div class="loc">${esc(state.location.label)}</div>
      </div>
      <div class="meta">Feuchte ${Math.round(w.humidity)} %<br>Regen ${w.precip > 0 ? w.precip.toFixed(1) + ' mm' : 'keiner'}</div>
    </section>` : `<section class="glass weather"><div class="muted small">Wetter lädt … (${esc(state.location.label)})</div></section>`;

  app().innerHTML = `
    <div class="enter">
      <div class="eyebrow">${formatDate(new Date())}</div>
      <h1>Scent of the Day</h1>
      <div class="segmented glass" role="tablist">${occButtons}</div>
      ${heroHtml}
      ${weatherHtml}
      ${kayaHint}
      <div class="grid-2">${altHtml}</div>
    </div>`;
  setTint(s ? s.color : null);
}

function formatDate(d) {
  return d.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' });
}

/* ---------- TAGEBUCH ---------- */
function renderTagebuch() {
  const m = state.calMonth;
  const y = m.getFullYear(), mo = m.getMonth();
  const first = new Date(y, mo, 1);
  const startOffset = (first.getDay() + 6) % 7; // Montag = 0
  const days = new Date(y, mo + 1, 0).getDate();
  const today = dayKey();

  let cells = '';
  for (let i = 0; i < startOffset; i++) cells += '<div class="cal-day empty"></div>';
  for (let d = 1; d <= days; d++) {
    const key = dayKey(new Date(y, mo, d));
    const id = state.log[key];
    const sc = id ? findScent(id) : null;
    cells += `<button class="cal-day ${key === today ? 'today' : ''} ${state.calSel === key ? 'sel' : ''}" data-day="${key}">
      ${d}${sc ? '<span class="dot"></span>' : ''}</button>`;
  }

  const dow = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((x) => `<div class="cal-dow">${x}</div>`).join('');
  const monthName = m.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });

  let detail = '';
  if (state.calSel) {
    const cur = state.log[state.calSel];
    const opts = state.scents.slice().sort((a, b) => displayName(a).localeCompare(displayName(b)))
      .map((s) => `<option value="${s.id}" ${cur === s.id ? 'selected' : ''}>${esc(displayName(s))}</option>`).join('');
    detail = `
      <section class="glass" style="border-radius:var(--radius-l);padding:18px;margin-top:14px">
        <div class="eyebrow">${new Date(state.calSel + 'T12:00').toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
        <div class="field" style="margin-top:10px">
          <label>Getragener Duft</label>
          <select id="daySelect"><option value="">— nichts eingetragen —</option>${opts}</select>
        </div>
        <p class="small muted" style="margin-top:10px">Änderungen werden sofort gespeichert.</p>
      </section>`;
  }

  const entries = Object.entries(state.log).filter(([k]) => k.startsWith(`${y}-${String(mo + 1).padStart(2, '0')}`)).length;

  app().innerHTML = `
    <div class="enter">
      <div class="eyebrow">Tragetagebuch</div>
      <h1>Kalender</h1>
      <p class="muted small">${entries} Einträge in diesem Monat · Tipp auf einen Tag zum Bearbeiten</p>
      <div class="cal-head">
        <button class="btn ghost" data-cal="-1">‹ Zurück</button>
        <h3>${monthName}</h3>
        <button class="btn ghost" data-cal="1">Weiter ›</button>
      </div>
      <section class="glass cal"><div class="cal-grid">${dow}${cells}</div></section>
      ${detail}
    </div>`;
  setTint(null);
}

/* ---------- SAMMLUNG ---------- */
function renderSammlung() {
  const groups = FAMILIES.map((f) => {
    const items = state.scents.filter((s) => s.family === f);
    if (!items.length) return '';
    return `<h2>${esc(f)}</h2>
      <section class="glass list">${items.map((s) => `
        <div class="row-item" data-edit="${s.id}">
          <span class="sw" style="background:${s.color}"></span>
          <div class="txt">
            <div class="name">${esc(displayName(s))} ${s.favorite ? '<span class="muted">★</span>' : ''}</div>
            <div class="sub">${intensityDots(s.intensity)} · ${s.temp[0]}–${s.temp[1]} °C${s.verified ? '' : ' · Noten prüfen'}</div>
          </div>
          <span class="chev">›</span>
        </div>`).join('')}
      </section>`;
  }).join('');

  const orphan = state.scents.filter((s) => !FAMILIES.includes(s.family));
  const orphanHtml = orphan.length ? `<h2>Sonstige</h2><section class="glass list">${orphan.map((s) => `<div class="row-item" data-edit="${s.id}"><span class="sw" style="background:${s.color}"></span><div class="txt"><div class="name">${esc(displayName(s))}</div></div><span class="chev">›</span></div>`).join('')}</section>` : '';

  app().innerHTML = `
    <div class="enter">
      <div class="eyebrow">${state.scents.length} Düfte</div>
      <h1>Sammlung</h1>
      <div style="margin-top:14px;display:grid;gap:10px">
        <button class="btn primary block" data-add="1">+ Duft hinzufügen</button>
        <button class="btn ghost" data-reset="1" style="justify-self:start">Standard-Sammlung wiederherstellen</button>
      </div>
      ${groups}${orphanHtml}
    </div>`;
  setTint(null);
}

/* ---------- STATISTIK ---------- */
function renderStatistik() {
  const counts = {};
  Object.values(state.log).forEach((id) => { counts[id] = (counts[id] || 0) + 1; });
  const total = Object.keys(state.log).length;
  const today = dayKey();
  const cutoff = shiftDay(today, -30);
  const recentIds = new Set(Object.entries(state.log).filter(([k]) => k >= cutoff).map(([, id]) => id));

  const most = state.scents.filter((s) => counts[s.id]).sort((a, b) => counts[b.id] - counts[a.id]);
  const max = most.length ? counts[most[0].id] : 1;
  const never = state.scents.filter((s) => !counts[s.id]);
  const forgotten = state.scents.filter((s) => counts[s.id] && !recentIds.has(s.id));

  const bars = most.length ? most.slice(0, 10).map((s) => `
    <div class="bar-row">
      <div><b>${esc(displayName(s))}</b></div><div class="muted">${counts[s.id]}×</div>
      <div class="bar-track"><div class="bar-fill" style="width:${Math.round((counts[s.id] / max) * 100)}%"></div></div>
    </div>`).join('') : '<p class="muted" style="padding:16px">Noch keine Einträge. Tippe heute auf „Heute getragen“.</p>';

  const neverHtml = never.length ? never.map((s) => `<div class="row-item"><span class="sw" style="background:${s.color}"></span><div class="txt"><div class="name">${esc(displayName(s))}</div><div class="sub">${esc(s.family)}</div></div></div>`).join('') : '<p class="muted" style="padding:16px">Alle Düfte wurden schon getragen. 🎉</p>';

  app().innerHTML = `
    <div class="enter">
      <div class="eyebrow">Auswertung</div>
      <h1>Statistik</h1>
      <div class="stats">
        <div class="glass stat"><div class="big">${total}</div><div class="lbl">Tage erfasst</div></div>
        <div class="glass stat"><div class="big">${state.scents.length - never.length}</div><div class="lbl">getragene Düfte</div></div>
        <div class="glass stat"><div class="big">${never.length}</div><div class="lbl">nie getragen</div></div>
      </div>
      <h2>Am meisten getragen</h2>
      <section class="glass list bars">${bars}</section>
      <h2>Nie getragen</h2>
      <section class="glass list">${neverHtml}</section>
      <h2>Vergessene Flakons</h2>
      <p class="muted small" style="margin:-4px 4px 10px">Seit über 30 Tagen nicht getragen.</p>
      <section class="glass list">${forgotten.length ? forgotten.map((s) => `<div class="row-item"><span class="sw" style="background:${s.color}"></span><div class="txt"><div class="name">${esc(displayName(s))}</div><div class="sub">zuletzt vor ${daysSince(s.id)} Tagen</div></div></div>`).join('') : '<p class="muted" style="padding:16px">Nichts vergessen. Gut so.</p>'}</section>
    </div>`;
  setTint(null);
}

function daysSince(id) {
  const keys = Object.keys(state.log).filter((k) => state.log[k] === id).sort();
  if (!keys.length) return '–';
  const last = new Date(keys[keys.length - 1] + 'T12:00');
  return Math.floor((Date.now() - last.getTime()) / 86400000);
}

/* ---------- SHEETS ---------- */
function openSheet(html) {
  const wrap = $('#sheetWrap');
  $('#sheet').innerHTML = `<div class="grab"></div>${html}`;
  wrap.classList.add('open');
}
function closeSheet() { $('#sheetWrap').classList.remove('open'); }

function openScentSheet(id) {
  const s = findScent(id);
  if (!s) return;
  openSheet(`
    <h3>${esc(displayName(s))}</h3>
    <p class="muted small">${esc(s.family)} · ${intensityDots(s.intensity)} · ${s.temp[0]}–${s.temp[1]} °C</p>
    <p style="margin-top:12px;line-height:1.5">Anlässe: ${s.occasions.map(occLabel).join(', ') || '–'}</p>
    <p class="small muted" style="margin-top:8px">Noten: ${esc([...s.notes.top, ...s.notes.heart, ...s.notes.base].join(', ') || 'noch nicht eingetragen')}</p>
    <div style="display:grid;gap:10px;margin-top:20px">
      <button class="btn primary block" data-wear="${s.id}">Heute getragen</button>
      <button class="btn block" data-editform="${s.id}">Bearbeiten</button>
      <button class="btn danger block" data-remove="${s.id}">Aus Sammlung entfernen</button>
      <button class="btn ghost" data-close="1">Schließen</button>
    </div>`);
}

function scentFormHtml(s) {
  const isNew = !s;
  const v = s || { brand: '', name: '', family: FAMILIES[0], intensity: 3, temp: [5, 20], occasions: ['chillen'], tags: [], notes: { top: [], heart: [], base: [] }, favorite: false, spray: false, verified: false };
  return `
    <h3>${isNew ? 'Duft hinzufügen' : 'Duft bearbeiten'}</h3>
    <div class="field"><label>Marke</label><input type="text" id="f_brand" value="${esc(v.brand)}" placeholder="z. B. Parfums de Marly"></div>
    <div class="field"><label>Name</label><input type="text" id="f_name" value="${esc(v.name)}" placeholder="z. B. Layton"></div>
    <div class="field"><label>Duftfamilie</label>
      <select id="f_family">${FAMILIES.map((f) => `<option ${f === v.family ? 'selected' : ''}>${esc(f)}</option>`).join('')}</select></div>
    <div class="field"><label>Intensität (1 leise – 5 Beast Mode)</label>
      <select id="f_int">${[1, 2, 3, 4, 5].map((n) => `<option value="${n}" ${n === v.intensity ? 'selected' : ''}>${n} ${intensityDots(n)}</option>`).join('')}</select></div>
    <div class="two">
      <div class="field"><label>Ideal ab (°C)</label><input type="number" id="f_tmin" value="${v.temp[0]}"></div>
      <div class="field"><label>bis (°C)</label><input type="number" id="f_tmax" value="${v.temp[1]}"></div>
    </div>
    <div class="field"><span class="lbl">Passende Anlässe</span>
      <div class="checks">${OCCASIONS.map((o) => `<label><input type="checkbox" name="f_occ" value="${o.id}" ${v.occasions.includes(o.id) ? 'checked' : ''}>${o.label}</label>`).join('')}</div></div>
    <div class="field"><span class="lbl">Eigenschaften</span>
      <div class="checks">${TAG_OPTIONS.map((t) => `<label><input type="checkbox" name="f_tag" value="${t.id}" ${v.tags.includes(t.id) ? 'checked' : ''}>${t.label}</label>`).join('')}
        <label><input type="checkbox" id="f_fav" ${v.favorite ? 'checked' : ''}>★ Favorit</label>
        <label><input type="checkbox" id="f_spray" ${v.spray ? 'checked' : ''}>hält kaum (nachsprühen)</label>
      </div></div>
    <div class="field"><label>Noten Kopf (kommagetrennt)</label><input type="text" id="f_top" value="${esc(v.notes.top.join(', '))}"></div>
    <div class="field"><label>Noten Herz</label><input type="text" id="f_heart" value="${esc(v.notes.heart.join(', '))}"></div>
    <div class="field"><label>Noten Basis</label><input type="text" id="f_base" value="${esc(v.notes.base.join(', '))}"></div>
    <div style="display:grid;gap:10px;margin-top:22px">
      <button class="btn primary block" data-save="${isNew ? 'new' : v.id}">Speichern</button>
      <button class="btn ghost" data-close="1">Abbrechen</button>
    </div>`;
}

function readForm() {
  const val = (id) => $('#' + id).value.trim();
  const list = (id) => val(id).split(',').map((x) => x.trim()).filter(Boolean);
  const checked = (name) => [...document.querySelectorAll(`input[name="${name}"]:checked`)].map((i) => i.value);
  return {
    brand: val('f_brand'),
    name: val('f_name'),
    family: $('#f_family').value,
    intensity: Number($('#f_int').value),
    temp: [Number(val('f_tmin')), Number(val('f_tmax'))],
    occasions: checked('f_occ'),
    tags: checked('f_tag'),
    favorite: $('#f_fav').checked,
    spray: $('#f_spray').checked,
    notes: { top: list('f_top'), heart: list('f_heart'), base: list('f_base') },
  };
}

function colorForFamily(f) {
  const map = {
    'Gourmand & Boozy': '#4a1c24', 'Amber & Oud': '#3a2410', 'Fruchtig & Süß': '#4a0f22',
    'Aromatisch & Honig': '#3e2a10', 'Würzig & Holzig': '#2e2418', 'Blumig': '#3a1830', 'Frisch & Zitrus': '#0f3a3a',
  };
  return map[f] || '#2a0d14';
}

/* ---------- AKTIONEN ---------- */
function wear(id, dayOverride) {
  const key = dayOverride || dayKey();
  state.log[key] = id;
  persist();
  const s = findScent(id);
  toast(`✓ ${s ? s.name : 'Duft'} eingetragen`);
  render();
}

function render() {
  document.querySelectorAll('.tabbar button').forEach((b) => b.classList.toggle('on', b.dataset.view === state.view));
  if (state.view === 'heute') renderHeute();
  else if (state.view === 'tagebuch') renderTagebuch();
  else if (state.view === 'sammlung') renderSammlung();
  else if (state.view === 'statistik') renderStatistik();
}

function switchView(v) {
  state.view = v;
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* Event-Delegation */
document.addEventListener('click', (e) => {
  const t = e.target;
  const tab = t.closest('.tabbar button');
  if (tab) return switchView(tab.dataset.view);

  const occ = t.closest('[data-occ]');
  if (occ) { state.occasion = occ.dataset.occ; persist(); return render(); }

  const wearBtn = t.closest('[data-wear]');
  if (wearBtn) {
    const id = wearBtn.dataset.wear;
    closeSheet();
    return wear(id);
  }
  const openBtn = t.closest('[data-open]');
  if (openBtn) return openScentSheet(openBtn.dataset.open);

  const calBtn = t.closest('[data-cal]');
  if (calBtn) {
    const d = new Date(state.calMonth);
    d.setMonth(d.getMonth() + Number(calBtn.dataset.cal));
    state.calMonth = d;
    return render();
  }
  const dayBtn = t.closest('[data-day]');
  if (dayBtn) { state.calSel = state.calSel === dayBtn.dataset.day ? null : dayBtn.dataset.day; return render(); }

  if (t.closest('[data-add]')) {
    return openSheet(scentFormHtml(null));
  }
  const editRow = t.closest('[data-edit]');
  if (editRow) return openScentSheet(editRow.dataset.edit);

  const editForm = t.closest('[data-editform]');
  if (editForm) return openSheet(scentFormHtml(findScent(editForm.dataset.editform)));

  const save = t.closest('[data-save]');
  if (save) {
    const data = readForm();
    if (!data.name) return toast('Bitte einen Namen eingeben');
    if (!(data.temp[0] <= data.temp[1])) return toast('Temperatur-Spanne prüfen');
    if (save.dataset.save === 'new') {
      data.id = 'custom_' + Date.now().toString(36);
      data.color = colorForFamily(data.family);
      data.tags = data.tags.slice();
      data.verified = false;
      state.scents.push(data);
    } else {
      const s = findScent(save.dataset.save);
      Object.assign(s, data, { edited: true });
    }
    persist(); closeSheet(); toast('Gespeichert'); return render();
  }

  const rem = t.closest('[data-remove]');
  if (rem) {
    const s = findScent(rem.dataset.remove);
    if (confirm(`„${displayName(s)}“ aus der Sammlung entfernen? Einträge im Tagebuch bleiben erhalten.`)) {
      state.scents = state.scents.filter((x) => x.id !== s.id);
      if (DEFAULT_SCENTS.some((d) => d.id === s.id) && !state.removed.includes(s.id)) state.removed.push(s.id);
      persist(); closeSheet(); toast('Entfernt'); render();
    }
    return;
  }

  const reset = t.closest('[data-reset]');
  if (reset) {
    if (confirm('Standard-Sammlung wiederherstellen? Eigene Änderungen werden überschrieben (Tagebuch bleibt).')) {
      const own = state.scents.filter((x) => !DEFAULT_SCENTS.some((d) => d.id === x.id));
      state.scents = clone(DEFAULT_SCENTS).concat(own);
      state.removed = [];
      persist(); toast('Standard wiederhergestellt'); render();
    }
    return;
  }

  if (t.closest('[data-close]') || t.id === 'sheetWrap') closeSheet();
});

document.addEventListener('change', (e) => {
  if (e.target.id === 'daySelect' && state.calSel) {
    const v = e.target.value;
    if (v) state.log[state.calSel] = v; else delete state.log[state.calSel];
    persist(); toast('Tagebuch aktualisiert'); render();
  }
});

/* Haptik-Gefühl: kurzer Druck-Effekt auf Buttons */
document.addEventListener('pointerdown', (e) => {
  if (e.target.closest('.btn, .alt, .row-item')) {
    if (navigator.vibrate) navigator.vibrate(5);
  }
}, { passive: true });

/* Wetter laden */
async function loadWeather() {
  try {
    let loc = FALLBACK_LOCATION;
    try { loc = await getPosition(); } catch (e) { loc = FALLBACK_LOCATION; }
    state.location = loc;
    state.weather = await fetchWeather(loc.lat, loc.lon);
  } catch (e) {
    try { state.weather = await fetchWeather(FALLBACK_LOCATION.lat, FALLBACK_LOCATION.lon); state.location = FALLBACK_LOCATION; }
    catch (err) { state.weather = null; }
  }
  if (state.view === 'heute') render();
}

/* Start */
render();
loadWeather();
setInterval(() => { if (state.view === 'heute') renderHeute(); }, 15 * 60 * 1000);

if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
