// Scent of the Day – Scriptable-Widget
// Zeigt den Duft des Tages + Wetter. Im selben Design wie die Web-App.
// Optionaler Widget-Parameter: uni | ausgehen | date | familie | chillen
// (Standard: ausgehen)  – siehe README für die Einrichtung.

const SCENTS = [{"id":"layton","brand":"Parfums de Marly","name":"Layton","family":"Würzig & Holzig","intensity":4,"temp":[5,22],"occasions":["date","familie","chillen"],"tags":["süß","vanille"],"notes":{"top":["Apfel","Bergamotte","Kardamom"],"heart":["Lavendel","Veilchen","Geranie"],"base":["Patchouli","Vanille","Guaiac","Praline"]},"color":"#3a2415","favorite":false,"spray":false,"verified":true},{"id":"althair","brand":"Parfums de Marly","name":"Althaïr","family":"Würzig & Holzig","intensity":3,"temp":[0,18],"occasions":["date","chillen","familie","uni"],"tags":["vanille"],"notes":{"top":["Bergamotte","Zitrus"],"heart":["Madagaskar-Bourbon-Vanille"],"base":["Holz","Amber"]},"color":"#2a2216","favorite":false,"spray":false,"verified":false},{"id":"hibiscus","brand":"","name":"Hibiscus Mahajad","family":"Fruchtig & Süß","intensity":3,"temp":[12,28],"occasions":["uni","ausgehen","chillen","familie"],"tags":["frucht","süß"],"notes":{"top":["Hibiskus","Beeren"],"heart":["Rose"],"base":["Moschus"]},"color":"#4a0f22","favorite":true,"spray":false,"verified":false},{"id":"kaya","brand":"Parfums d'Elmar","name":"Kaya","family":"Gourmand & Boozy","intensity":4,"temp":[8,22],"occasions":["ausgehen","date","chillen"],"tags":["süß","boozy","frucht","vanille"],"notes":{"top":["Apfel","Bergamotte","Erdbeere"],"heart":["Jasmin","weiße Blüten"],"base":["Amber","Ambrox","Patchouli","Rum","Tonka","Vanille"]},"color":"#5a1830","favorite":true,"spray":true,"verified":true},{"id":"elixir","brand":"Parfums d'Elmar","name":"Elixir d'Amour","family":"Amber & Oud","intensity":4,"temp":[-5,15],"occasions":["date","ausgehen","familie"],"tags":["oud","amber","süß","frucht"],"notes":{"top":["Bergamotte","Feigenblatt","rosa Pfeffer","Safran"],"heart":["Guaiac","Jasmin","Maiglöckchen","Himbeere","Rose"],"base":["Agarholz","Amber","Labdanum","Moschus","Patchouli","Vanille","Karamell"]},"color":"#3d1a14","favorite":false,"spray":false,"verified":true},{"id":"oud01","brand":"Swiss Arabian","name":"Oud 01","family":"Amber & Oud","intensity":4,"temp":[-5,15],"occasions":["ausgehen","date","familie"],"tags":["oud","amber"],"notes":{"top":["Gewürze"],"heart":["Rose"],"base":["Oud","Amber"]},"color":"#3a2810","favorite":false,"spray":false,"verified":false},{"id":"shaghaf","brand":"Swiss Arabian","name":"Shaghaf Oud Azraq","family":"Amber & Oud","intensity":5,"temp":[-5,12],"occasions":["ausgehen","date"],"tags":["oud","amber","süß","vanille"],"notes":{"top":["Honig"],"heart":["Agarholz","Zimt","Amber"],"base":["Madagaskar-Vanille","Leder","Patchouli"]},"color":"#3b2208","favorite":false,"spray":false,"verified":true},{"id":"khaltat","brand":"Attar Collection","name":"Khaltat Night","family":"Gourmand & Boozy","intensity":4,"temp":[-3,14],"occasions":["ausgehen","date","familie"],"tags":["süß","boozy","frucht"],"notes":{"top":["Gewürze","Früchte"],"heart":["Harze"],"base":["Gourmand-Akkord","Vanille"]},"color":"#3c1520","favorite":false,"spray":false,"verified":false},{"id":"khamrah","brand":"Lattafa","name":"Khamrah","family":"Gourmand & Boozy","intensity":4,"temp":[-5,15],"occasions":["ausgehen","date","chillen"],"tags":["süß","boozy","vanille"],"notes":{"top":["Gewürze"],"heart":["Tonka","Zimt","Eiche"],"base":["Vanille","Praline","Sandelholz"]},"color":"#4a2410","favorite":false,"spray":false,"verified":true},{"id":"lostcherry","brand":"Tom Ford","name":"Lost Cherry","family":"Fruchtig & Süß","intensity":4,"temp":[-5,18],"occasions":["date","ausgehen","chillen"],"tags":["süß","frucht","vanille","boozy"],"notes":{"top":["Kirsche","Mandel"],"heart":["Kirschlikör"],"base":["Tonka","Vanille","Holz"]},"color":"#4e0b18","favorite":false,"spray":false,"verified":false},{"id":"cafe","brand":"Montale","name":"Intense Café","family":"Gourmand & Boozy","intensity":4,"temp":[-5,12],"occasions":["ausgehen","date","chillen"],"tags":["süß","boozy","vanille"],"notes":{"top":["Kaffee","Kardamom"],"heart":["Rum"],"base":["Vanille"]},"color":"#2e1c12","favorite":false,"spray":false,"verified":false},{"id":"tonka","brand":"Montale","name":"Arabians Tonka","family":"Gourmand & Boozy","intensity":4,"temp":[0,15],"occasions":["date","chillen","familie"],"tags":["süß","vanille","amber"],"notes":{"top":["Tonka"],"heart":["Vanille"],"base":["Amber","Cumarin"]},"color":"#3a2a1a","favorite":false,"spray":false,"verified":false},{"id":"oudDream","brand":"Montale","name":"Oud Dream","family":"Amber & Oud","intensity":4,"temp":[-2,14],"occasions":["ausgehen","date"],"tags":["oud","amber"],"notes":{"top":["Gewürze"],"heart":["Rose"],"base":["Oud","Sandelholz","Amber"]},"color":"#352010","favorite":false,"spray":false,"verified":false},{"id":"maracuja","brand":"","name":"Oud Maracuja (Dupe)","family":"Fruchtig & Süß","intensity":3,"temp":[10,26],"occasions":["ausgehen","chillen","uni"],"tags":["frucht","oud","süß"],"notes":{"top":["Maracuja"],"heart":["Beeren"],"base":["Oud","Vanille"]},"color":"#4a2a0c","favorite":false,"spray":false,"verified":false},{"id":"elusa","brand":"","name":"Elusa 432","family":"Frisch & Zitrus","intensity":3,"temp":[14,28],"occasions":["uni","chillen","familie"],"tags":["frisch"],"notes":{"top":[],"heart":[],"base":[]},"color":"#0f3a3a","favorite":false,"spray":false,"verified":false},{"id":"blondeAmber","brand":"","name":"Blonde Amber","family":"Amber & Oud","intensity":3,"temp":[0,16],"occasions":["date","familie","chillen"],"tags":["amber","vanille"],"notes":{"top":[],"heart":[],"base":["Amber"]},"color":"#4a3010","favorite":false,"spray":false,"verified":false},{"id":"orangeFlamingo","brand":"","name":"Orange Flamingo","family":"Frisch & Zitrus","intensity":3,"temp":[16,30],"occasions":["uni","familie","chillen"],"tags":["frucht","frisch"],"notes":{"top":["Orange"],"heart":[],"base":[]},"color":"#5a2a00","favorite":false,"spray":false,"verified":false},{"id":"naxos","brand":"Xerjoff","name":"Naxos","family":"Aromatisch & Honig","intensity":4,"temp":[0,16],"occasions":["date","ausgehen","chillen","familie"],"tags":["süß","vanille"],"notes":{"top":["Bergamotte","Zimt"],"heart":["Lavendel","Tabak"],"base":["Honig","Vanille"]},"color":"#3e2a10","favorite":false,"spray":false,"verified":false},{"id":"ombre","brand":"Louis Vuitton","name":"Ombre Nomade","family":"Amber & Oud","intensity":4,"temp":[-5,12],"occasions":["ausgehen","date"],"tags":["oud","weihrauch"],"notes":{"top":["Safran"],"heart":["Oud"],"base":["Weihrauch","Zeder","Labdanum"]},"color":"#2a1a0c","favorite":false,"spray":false,"verified":false},{"id":"paragon","brand":"","name":"Paragon","family":"Würzig & Holzig","intensity":3,"temp":[5,20],"occasions":["uni","chillen","familie"],"tags":[],"notes":{"top":[],"heart":[],"base":[]},"color":"#1f2a3a","favorite":false,"spray":false,"verified":false},{"id":"blueTalisman","brand":"Ex Nihilo","name":"Blue Talisman Extrait","family":"Frisch & Zitrus","intensity":4,"temp":[12,28],"occasions":["ausgehen","date"],"tags":["frisch"],"notes":{"top":[],"heart":[],"base":[]},"color":"#0d2a4a","favorite":false,"spray":false,"verified":false},{"id":"grisCharnel","brand":"BDK","name":"Gris Charnel","family":"Würzig & Holzig","intensity":4,"temp":[5,20],"occasions":["date","ausgehen","chillen"],"tags":["rauch"],"notes":{"top":[],"heart":[],"base":[]},"color":"#2a2a2a","favorite":false,"spray":false,"verified":false},{"id":"stallion","brand":"Maison Crivelli","name":"Oud Stallion","family":"Amber & Oud","intensity":5,"temp":[-5,12],"occasions":["ausgehen","date"],"tags":["oud","amber","süß"],"notes":{"top":["Muskatnuss","Kardamom","Safran"],"heart":["Osmanthus","Jasmin","türkische Rose"],"base":["Leder","Oud","Tonka","Patchouli","Zeder"]},"color":"#3a1f0a","favorite":false,"spray":false,"verified":true}]
;
const FALLBACK = { lat: 47.999, lon: 7.8421, label: 'Freiburg' };
const LIKED = ['süß', 'boozy', 'oud', 'amber', 'frucht', 'vanille'];
const OCCASIONS = ['uni', 'ausgehen', 'date', 'familie', 'chillen'];
const OCC_LABEL = { uni: 'Uni', ausgehen: 'Ausgehen', date: 'Date', familie: 'Familie', chillen: 'Chillen' };

const param = (args.widgetParameter || '').trim().toLowerCase();
const occasion = OCCASIONS.includes(param) ? param : 'ausgehen';

function dayKey(d = new Date()) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function hashStr(s) {
  let h = 2166136261;
  for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

async function getLocation() {
  try {
    Location.setAccuracyToThreeKilometers();
    const l = await Location.current();
    return { lat: l.latitude, lon: l.longitude, label: 'Dein Standort' };
  } catch (e) {
    return FALLBACK;
  }
}

async function getWeather(loc) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}` +
    '&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,is_day&timezone=auto';
  const j = await new Request(url).loadJSON();
  const c = j.current;
  return { temp: c.temperature_2m, humidity: c.relative_humidity_2m, precip: c.precipitation, code: c.weather_code };
}

function weatherIcon(code) {
  if (code === 0) return '☀️';
  if (code <= 2) return '🌤️';
  if (code === 3) return '☁️';
  if (code === 45 || code === 48) return '🌫️';
  if (code >= 51 && code <= 67) return '🌧️';
  if (code >= 71 && code <= 77) return '❄️';
  if (code >= 80 && code <= 82) return '🌦️';
  if (code >= 95) return '⛈️';
  return '⛅';
}

// Gleiche Logik wie in der Web-App (engine.js), ohne Tagebuch-Sperre
function scoreScent(s, ctx) {
  let sc = 50;
  const t = ctx.temp;
  const [a, b] = s.temp;
  if (t >= a && t <= b) sc += 25;
  else sc -= Math.min(40, Math.min(Math.abs(t - a), Math.abs(t - b)) * 3);
  if (t > 24 && s.intensity > 2) sc -= (s.intensity - 2) * 5;
  if (t < 6 && s.intensity >= 4) sc += 5;
  if (ctx.precip > 0 && s.intensity >= 5) sc -= 4;
  if (ctx.humidity > 75 && s.intensity >= 5) sc -= 5;
  if (ctx.hour >= 18 && s.intensity >= 4) sc += 6;
  if (ctx.hour < 11 && s.intensity <= 3) sc += 4;
  if (ctx.hour < 11 && s.intensity >= 5) sc -= 6;
  if (ctx.occasion === 'uni') {
    if (s.intensity >= 4) sc -= (s.intensity - 3) * 12; else sc += 6;
  } else if (s.occasions.includes(ctx.occasion)) sc += 15;
  else sc -= 10;
  if ((ctx.occasion === 'ausgehen' || ctx.occasion === 'date') && s.intensity >= 4) sc += 8;
  if (ctx.occasion === 'familie' && s.intensity >= 5) sc -= 10;
  if (s.tags.includes('rauch')) sc -= 60;
  if (s.tags.includes('weihrauch')) sc -= 60;
  sc += Math.min(12, s.tags.filter((x) => LIKED.includes(x)).length * 4);
  if (s.favorite) sc += 8;
  sc += hashStr(ctx.day + ctx.occasion + s.id) % 7;
  return sc;
}

function displayName(s) { return (s.brand ? s.brand + ' ' : '') + s.name; }
function dots(n) { return '●'.repeat(n) + '○'.repeat(5 - n); }

async function build() {
  const loc = await getLocation();
  let w = null;
  try { w = await getWeather(loc); } catch (e) { w = null; }
  const ctx = {
    day: dayKey(), occasion,
    temp: w ? w.temp : 15, humidity: w ? w.humidity : 50, precip: w ? w.precip : 0,
    hour: new Date().getHours(),
  };
  const ranked = SCENTS.map((s) => ({ s, sc: scoreScent(s, ctx) })).sort((x, y) => y.sc - x.sc);
  const hero = ranked[0].s;
  const alt = ranked[1].s;

  const widget = new ListWidget();
  const tint = new Color(hero.color, 1);
  const g = new LinearGradient();
  g.colors = [tint, new Color('#000000', 1)];
  g.locations = [0, 0.85];
  g.startPoint = new Point(0.5, 0);
  g.endPoint = new Point(0.5, 1);
  widget.backgroundGradient = g;
  widget.setPadding(16, 16, 14, 16);
  widget.refreshAfterDate = new Date(Date.now() + 60 * 60 * 1000);

  const white = Color.white();
  const muted = new Color('#ebebf5', 0.65);
  const gold = new Color('#ffd27a');
  const family = config.widgetFamily || 'medium';

  // Kopfzeile
  const head = widget.addStack();
  head.centerAlignContent();
  const h1 = head.addText('SCENT OF THE DAY');
  h1.font = Font.semiboldSystemFont(10);
  h1.textColor = muted;
  head.addSpacer();
  const wx = head.addText(w ? `${weatherIcon(w.code)} ${Math.round(w.temp)}°` : '–');
  wx.font = Font.semiboldSystemFont(13);
  wx.textColor = white;

  widget.addSpacer(6);

  const name = widget.addText(displayName(hero));
  name.font = Font.boldSystemFont(family === 'small' ? 18 : 24);
  name.textColor = white;
  name.minimumScaleFactor = 0.6;
  name.lineLimit = 2;

  const sub = widget.addText(`${hero.family} · ${dots(hero.intensity)}`);
  sub.font = Font.systemFont(11);
  sub.textColor = muted;
  sub.lineLimit = 1;

  if (family !== 'small') {
    widget.addSpacer(6);
    const notes = [...hero.notes.top, ...hero.notes.heart, ...hero.notes.base].slice(0, 6).join(' · ');
    const n = widget.addText(notes || 'Noten noch nicht eingetragen');
    n.font = Font.systemFont(11);
    n.textColor = muted;
    n.lineLimit = 2;
  }

  widget.addSpacer();

  const foot = widget.addStack();
  foot.centerAlignContent();
  const occ = foot.addText(OCC_LABEL[occasion]);
  occ.font = Font.semiboldSystemFont(11);
  occ.textColor = gold;
  foot.addSpacer();
  if (family !== 'small') {
    const a = foot.addText('Alt: ' + displayName(alt));
    a.font = Font.systemFont(10);
    a.textColor = muted;
    a.lineLimit = 1;
  }
  if (hero.spray) {
    widget.addSpacer(4);
    const k = widget.addText('💨 Kaya: nachsprühen');
    k.font = Font.systemFont(10);
    k.textColor = gold;
  }

  return widget;
}

const widget = await build();
if (config.runsInWidget) {
  Script.setWidget(widget);
} else {
  await widget.presentMedium();
}
Script.complete();
