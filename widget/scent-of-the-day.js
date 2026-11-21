// Scent of the Day – Scriptable-Widget
// Zeigt den Duft des Tages + Wetter. Im selben Design wie die Web-App.
// Optionaler Widget-Parameter: uni | ausgehen | date | familie | chillen
// (Standard: ausgehen)  – siehe README für die Einrichtung.

const SCENTS = [{"id":"layton","brand":"Parfums de Marly","name":"Layton","family":"Würzig & Holzig","intensity":4,"temp":[5,22],"occasions":["date","familie","chillen"],"tags":["süß","vanille"],"notes":{"top":["Apfel","Lavendel","Bergamotte"],"heart":["Jasmin","Rosengeranie","Veilchen"],"base":["Vanille","Amber","Guajakholz","karamellisierte Kaffeebohne","Patchouli","rosa Pfeffer"]},"color":"#3a2415","favorite":false,"spray":false,"verified":true},{"id":"althair","brand":"Parfums de Marly","name":"Althaïr","family":"Würzig & Holzig","intensity":3,"temp":[0,18],"occasions":["date","chillen","familie","uni"],"tags":["vanille"],"notes":{"top":["Orangenblüte","Zimt","Bergamotte"],"heart":["Bourbon-Vanille","Elemiharz"],"base":["Praline","Ambrox","Guajakholz","Moschus"]},"color":"#2a2216","favorite":false,"spray":false,"verified":true},{"id":"hibiscus","brand":"Maison Crivelli","name":"Hibiscus Mahajad","family":"Fruchtig & Süß","intensity":3,"temp":[12,28],"occasions":["uni","ausgehen","chillen","familie"],"tags":["frucht","süß","vanille"],"notes":{"top":[],"heart":["Hibiskus","Damaszener-Rose","Schwarze Johannisbeere","Vanille","Hibiskustee","Leder","Vanilleorchidee","Ambrettesamen","Granatapfel","Grüne Minze","Zimt"],"base":[]},"color":"#4a0f22","favorite":true,"spray":false,"verified":true},{"id":"kaya","brand":"Parfums d'Elmar","name":"Kaya","family":"Gourmand & Boozy","intensity":4,"temp":[8,22],"occasions":["ausgehen","date","chillen"],"tags":["süß","boozy","frucht","vanille"],"notes":{"top":["Erdbeere","Apfel","Himbeere","kalabrische Bergamotte"],"heart":["weiße Blüten","Jasmin-Sambac"],"base":["Tonkabohne","Vanille","Ambrox Super","Rum","Amber","holzige Noten","indonesisches Patchouli"]},"color":"#5a1830","favorite":true,"spray":true,"verified":true},{"id":"elixir","brand":"Parfums d'Elmar","name":"Elixir d'Amour","family":"Amber & Oud","intensity":4,"temp":[-5,15],"occasions":["date","ausgehen","familie"],"tags":["oud","amber","süß","frucht"],"notes":{"top":["rosa Pfeffer","Safran","Bergamotte","Feigenblatt"],"heart":["Himbeere","bulgarische Rose","Guajakholz","Wasserjasmin","Maiglöckchen"],"base":["Oud","Karamell","Amber","Amyris","Moschus","Patchouli","Zistrose","Vanille"]},"color":"#3d1a14","favorite":false,"spray":false,"verified":true},{"id":"oud01","brand":"Swiss Arabian","name":"Oud 01","family":"Amber & Oud","intensity":4,"temp":[-5,15],"occasions":["ausgehen","date","familie"],"tags":["oud","amber","frucht","süß"],"notes":{"top":["Himbeere","Kreuzkümmel","Veilchenblatt"],"heart":["Kardamom","türkische Rose","Maiglöckchen"],"base":["Amber","Leder","Oud"]},"color":"#3a2810","favorite":false,"spray":false,"verified":true},{"id":"shaghaf","brand":"Swiss Arabian","name":"Shaghaf Oud Azraq","family":"Amber & Oud","intensity":5,"temp":[-5,12],"occasions":["ausgehen","date"],"tags":["oud","amber","süß","vanille"],"notes":{"top":["Honig","Oud"],"heart":["Zimt","Amber","Bourbon-Vanille"],"base":["Leder","Patchouli"]},"color":"#3b2208","favorite":false,"spray":false,"verified":true},{"id":"khaltat","brand":"Attar Collection","name":"Khaltat Night","family":"Gourmand & Boozy","intensity":4,"temp":[-3,14],"occasions":["ausgehen","date","familie"],"tags":["süß","boozy","frucht"],"notes":{"top":["Kirsche","roter Apfel"],"heart":["Jasmin","Vanille"],"base":["Zimt","Amber","Klee","Moschus","Patchouli"]},"color":"#3c1520","favorite":false,"spray":false,"verified":true},{"id":"khamrah","brand":"Lattafa","name":"Khamrah","family":"Gourmand & Boozy","intensity":4,"temp":[-5,15],"occasions":["ausgehen","date","chillen"],"tags":["süß","boozy","vanille"],"notes":{"top":["Zimt","Muskat","Bergamotte"],"heart":["Dattel","Praline","Mahonial","Tuberose"],"base":["geröstete Tonkabohne","Vanille","Amberholz","Akigalawood","Myrrhe","Siam-Benzoe"]},"color":"#4a2410","favorite":false,"spray":false,"verified":true},{"id":"lostcherry","brand":"Tom Ford","name":"Lost Cherry","family":"Fruchtig & Süß","intensity":4,"temp":[-5,18],"occasions":["date","ausgehen","chillen"],"tags":["süß","frucht","vanille","boozy"],"notes":{"top":["Schwarzkirsche","Kirsch-Likör","Bittermandel"],"heart":["Sauerkirschsirup","Jasmin-Sambac","türkische Rose"],"base":["geröstete Tonkabohne","Perubalsam","Sandelholz","Vetiver","Zeder"]},"color":"#4e0b18","favorite":false,"spray":false,"verified":true},{"id":"cafe","brand":"Montale","name":"Intense Café","family":"Gourmand & Boozy","intensity":4,"temp":[-5,12],"occasions":["ausgehen","date","chillen"],"tags":["süß","boozy","vanille"],"notes":{"top":["blumige Noten"],"heart":["Rose","Kaffee"],"base":["Vanille","Amber","weißer Moschus"]},"color":"#2e1c12","favorite":false,"spray":false,"verified":true},{"id":"tonka","brand":"Montale","name":"Arabians Tonka","family":"Amber & Oud","intensity":5,"temp":[0,15],"occasions":["ausgehen","date"],"tags":["süß","oud","amber"],"notes":{"top":["Safran","Bergamotte"],"heart":["nepalesisches Oud","bulgarische Rose","Leder"],"base":["Tonkabohne","Rohrzucker","Amber","weißer Moschus","Eichenmoos"]},"color":"#3a2a1a","favorite":false,"spray":false,"verified":true},{"id":"oudDream","brand":"Montale","name":"Oud Dream","family":"Amber & Oud","intensity":4,"temp":[-2,14],"occasions":["ausgehen","date"],"tags":["oud","amber"],"notes":{"top":["Honig","Kardamom","Leder","Safran","Lavendel","Muskat","Zimt"],"heart":["Rose","Patchouli","Oud","Tuberose"],"base":["Zedernholz","Ambra","Labdanum","Sandelholz","Vanille"]},"color":"#352010","favorite":false,"spray":false,"verified":true},{"id":"maracuja","brand":"","name":"Oud Maracuja (Dupe)","family":"Fruchtig & Süß","intensity":3,"temp":[10,26],"occasions":["ausgehen","chillen","uni"],"tags":["frucht","oud","süß"],"notes":{"top":["Maracuja"],"heart":["Beeren"],"base":["Oud","Vanille"]},"color":"#4a2a0c","favorite":false,"spray":false,"verified":false},{"id":"elusa","brand":"","name":"Elusa 432","family":"Frisch & Zitrus","intensity":3,"temp":[14,28],"occasions":["uni","chillen","familie"],"tags":["frisch"],"notes":{"top":[],"heart":[],"base":[]},"color":"#0f3a3a","favorite":false,"spray":false,"verified":false},{"id":"blondeAmber","brand":"Clive Christian","name":"Blonde Amber","family":"Amber & Oud","intensity":3,"temp":[0,16],"occasions":["date","familie","chillen"],"tags":["amber","süß","frucht"],"notes":{"top":[],"heart":["Amber","getrocknete Früchte","heller Tabak","Tonkabohne","Tuberose","Bitterorange","Jasmin"],"base":[]},"color":"#4a3010","favorite":false,"spray":false,"verified":true},{"id":"orangeFlamingo","brand":"Marc-Gebauer","name":"Orange Flamingo","family":"Frisch & Zitrus","intensity":3,"temp":[16,30],"occasions":["uni","familie","chillen"],"tags":["frucht","frisch"],"notes":{"top":["Orangenblüte","Orange","Bergamotte"],"heart":["Maiglöckchen","Jasmin","Rose","Gewürznelke","Zedernholz"],"base":["Moschus","holzige Noten"]},"color":"#5a2a00","favorite":false,"spray":false,"verified":true},{"id":"naxos","brand":"Xerjoff","name":"Naxos","family":"Aromatisch & Honig","intensity":4,"temp":[0,16],"occasions":["date","ausgehen","chillen","familie"],"tags":["süß","vanille","weihrauch"],"notes":{"top":["Lavendel","Bergamotte","omanischer Weihrauch","Zitrone"],"heart":["Honig","Jasmin-Sambac","Kaschmir","Zimt"],"base":["Tabak","Tonkabohne","Vanille"]},"color":"#3e2a10","favorite":false,"spray":false,"verified":true},{"id":"ombre","brand":"Louis Vuitton","name":"Ombre Nomade","family":"Amber & Oud","intensity":4,"temp":[-5,12],"occasions":["ausgehen","date"],"tags":["oud","frucht","weihrauch","rauch"],"notes":{"top":[],"heart":["Oud","Himbeere","Benzoe","Räucherwerk"],"base":[]},"color":"#2a1a0c","favorite":false,"spray":false,"verified":true},{"id":"paragon","brand":"Initio","name":"Paragon","family":"Würzig & Holzig","intensity":4,"temp":[0,18],"occasions":["date","ausgehen","chillen"],"tags":["oud","süß"],"notes":{"top":[],"heart":["Weißer Salbei","Lavendel","Palo Santo","Sandelholz","Bergamotte","schwarzer Pfeffer","Oud"],"base":[]},"color":"#1f2a3a","favorite":false,"spray":false,"verified":true},{"id":"blueTalisman","brand":"Ex Nihilo","name":"Blue Talisman Extrait","family":"Fruchtig & Süß","intensity":4,"temp":[10,28],"occasions":["ausgehen","date","chillen"],"tags":["frucht","süß","vanille"],"notes":{"top":["Birne","Bergamotte"],"heart":["Orangenblüte","Jasmin-Sambac"],"base":["Ambrofix","Moschus","Vanille","Amberholz","Sandelholz"]},"color":"#0d2a4a","favorite":false,"spray":false,"verified":true},{"id":"grisCharnel","brand":"BDK","name":"Gris Charnel","family":"Würzig & Holzig","intensity":4,"temp":[5,20],"occasions":["date","ausgehen","chillen"],"tags":[],"notes":{"top":["Feige","Kardamom","schwarzer Tee"],"heart":["Bourbon-Vetiver","Iris Absolue"],"base":["indisches Sandelholz","Tonkabohne","Absolue"]},"color":"#2a2a2a","favorite":false,"spray":false,"verified":true},{"id":"stallion","brand":"Maison Crivelli","name":"Oud Stallion","family":"Amber & Oud","intensity":5,"temp":[-5,12],"occasions":["ausgehen","date"],"tags":["oud","süß"],"notes":{"top":[],"heart":["Leder","Oud","Safran","türkische Rose","Atlaszeder","geröstete Tonkabohne","Kardamom","Muskat","Patchouli"],"base":[]},"color":"#3a1f0a","favorite":false,"spray":false,"verified":true},{"id":"pacificChill","brand":"Louis Vuitton","name":"Pacific Chill","family":"Frisch & Zitrus","intensity":3,"temp":[14,28],"occasions":["uni","chillen","familie"],"tags":["frisch"],"notes":{"top":[],"heart":[],"base":[]},"color":"#0f3a46","favorite":false,"spray":false,"verified":false},{"id":"stronger","brand":"Giorgio Armani","name":"Emporio Armani Stronger With You Amber","family":"Amber & Oud","intensity":4,"temp":[-5,15],"occasions":["date","ausgehen"],"tags":["amber","süß","vanille"],"notes":{"top":["provenzalischer Lavendel"],"heart":["Amber"],"base":["Bourbon-Vanille"]},"color":"#3a2412","favorite":false,"spray":false,"verified":true},{"id":"velvetTonka","brand":"BDK Parfums","name":"Velvet Tonka","family":"Gourmand & Boozy","intensity":4,"temp":[0,15],"occasions":["date","chillen"],"tags":["süß","vanille"],"notes":{"top":["Mandel","Orangenblüte"],"heart":["Balkan-Tabak","Rose"],"base":["Tonkabohne","Bourbon-Vanille","Amberholz","Amyris"]},"color":"#3a2a1c","favorite":false,"spray":false,"verified":true},{"id":"tobaccoVanille","brand":"Tom Ford","name":"Tobacco Vanille","family":"Gourmand & Boozy","intensity":4,"temp":[-5,15],"occasions":["ausgehen","date","chillen"],"tags":["süß","vanille","rauch"],"notes":{"top":[],"heart":["Vanille","Tabak","getrocknete Früchte","Harze","Ingwer","Kakao","Tonkabohne"],"base":[]},"color":"#3a2010","favorite":false,"spray":false,"verified":true},{"id":"jeanLoweNoir","brand":"Maison Alhambra","name":"Jean Lowe Noir (Dupe Ombre Nomade)","family":"Amber & Oud","intensity":4,"temp":[-5,12],"occasions":["ausgehen","date"],"tags":["oud"],"notes":{"top":[],"heart":[],"base":[]},"color":"#2a1a0c","favorite":false,"spray":false,"verified":false},{"id":"imagination","brand":"Louis Vuitton","name":"Imagination","family":"Frisch & Zitrus","intensity":3,"temp":[14,30],"occasions":["uni","familie","chillen"],"tags":["frisch"],"notes":{"top":[],"heart":["chinesischer schwarzer Tee","kalabrische Bergamotte","Ambrox","nigerianischer Ingwer","Ceylon-Zimt","sizilianische Zeder","tunesisches Neroli"],"base":[]},"color":"#16384a","favorite":false,"spray":false,"verified":true},{"id":"cactusGarden","brand":"Louis Vuitton","name":"Cactus Garden","family":"Frisch & Zitrus","intensity":3,"temp":[18,32],"occasions":["uni","familie","chillen"],"tags":["frisch","weihrauch"],"notes":{"top":[],"heart":["Zitronengras","kalabrische Bergamotte","Mate","Rosengeranie","Weihrauch"],"base":[]},"color":"#1d3a24","favorite":false,"spray":false,"verified":true}];
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
