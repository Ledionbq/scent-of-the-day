/* Scent of the Day – Wetter + Auswahllogik */

const FALLBACK_LOCATION = { lat: 47.999, lon: 7.8421, label: 'Freiburg im Breisgau' };

function dayKey(d = new Date()) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function shiftDay(key, n) {
  const [y, m, d] = key.split('-').map(Number);
  return dayKey(new Date(y, m - 1, d + n));
}

function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function weatherLabel(code) {
  if (code === 0) return { text: 'Klar', icon: '☀️' };
  if (code <= 2) return { text: 'Leicht bewölkt', icon: '🌤️' };
  if (code === 3) return { text: 'Bewölkt', icon: '☁️' };
  if (code === 45 || code === 48) return { text: 'Nebel', icon: '🌫️' };
  if (code >= 51 && code <= 57) return { text: 'Nieselregen', icon: '🌦️' };
  if (code >= 61 && code <= 67) return { text: 'Regen', icon: '🌧️' };
  if (code >= 71 && code <= 77) return { text: 'Schnee', icon: '❄️' };
  if (code >= 80 && code <= 82) return { text: 'Schauer', icon: '🌦️' };
  if (code >= 95) return { text: 'Gewitter', icon: '⛈️' };
  return { text: 'Wechselhaft', icon: '⛅' };
}

async function fetchWeather(lat, lon) {
  const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon +
    '&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,is_day&timezone=auto';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Wetter nicht erreichbar');
  const j = await res.json();
  const c = j.current;
  return {
    temp: c.temperature_2m,
    humidity: c.relative_humidity_2m,
    precip: c.precipitation,
    code: c.weather_code,
    isDay: c.is_day === 1,
  };
}

function getPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error('Kein Standort'));
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude, lon: p.coords.longitude, label: 'Dein Standort' }),
      reject,
      { timeout: 6000, maximumAge: 15 * 60 * 1000 }
    );
  });
}

/* Bewertung eines Duftes für den gegebenen Kontext */
function scoreScent(s, ctx) {
  let sc = 50;
  const why = [];
  const t = ctx.temp;
  const [a, b] = s.temp;

  if (t >= a && t <= b) {
    sc += 25;
    why.push(`${Math.round(t)} °C liegt in seiner Wohlfühl-Spanne`);
  } else {
    const d = Math.min(Math.abs(t - a), Math.abs(t - b));
    sc -= Math.min(40, d * 3);
  }
  if (t > 24 && s.intensity > 2) sc -= (s.intensity - 2) * 5;
  if (t < 6 && s.intensity >= 4) sc += 5;

  if (ctx.precip > 0 && s.intensity >= 5) sc -= 4;
  if (ctx.humidity > 75 && s.intensity >= 5) sc -= 5;
  if (ctx.precip > 0) why.push('Regen: dezenter Duft ist angenehmer');

  if (ctx.hour >= 18 && s.intensity >= 4) { sc += 6; why.push('Abend: darf kräftiger sein'); }
  if (ctx.hour < 11 && s.intensity <= 3) sc += 4;
  if (ctx.hour < 11 && s.intensity >= 5) sc -= 6;

  if (ctx.occasion === 'uni') {
    if (s.intensity >= 4) sc -= (s.intensity - 3) * 12;
    else sc += 6;
  } else if (s.occasions.includes(ctx.occasion)) {
    sc += 15;
    why.push(`passt zu ${ctx.occasionLabel}`);
  } else {
    sc -= 10;
  }
  if ((ctx.occasion === 'ausgehen' || ctx.occasion === 'date') && s.intensity >= 4) sc += 8;
  if (ctx.occasion === 'familie' && s.intensity >= 5) sc -= 10;
  if (ctx.occasion === 'chillen' && s.intensity <= 3) sc += 3;

  // Geschmack
  if (s.tags.includes('rauch')) sc -= 60;
  if (s.tags.includes('weihrauch')) sc -= 60;
  const liked = s.tags.filter((x) => LIKED_TAGS.includes(x)).length;
  sc += Math.min(12, liked * 4);

  if (s.favorite) { sc += 8; }

  // Keine Wiederholung in den letzten 5 Tagen
  if (ctx.recent.has(s.id)) sc -= 35;

  // Tagesabhängige Variation (stabil über den Tag)
  sc += hashStr(ctx.day + ctx.occasion + s.id) % 7;

  return { score: sc, why };
}

function rankScents(scents, ctx) {
  return scents
    .map((s) => {
      const r = scoreScent(s, ctx);
      return { scent: s, score: r.score, why: r.why };
    })
    .sort((x, y) => y.score - x.score);
}

function buildReason(entry, ctx) {
  const parts = [];
  if (entry.why.length) parts.push(entry.why[0].charAt(0).toUpperCase() + entry.why[0].slice(1));
  if (entry.why.length > 1) parts.push(entry.why[1]);
  if (ctx.recent.has(entry.scent.id)) parts.push('(war in den letzten Tagen schon dran)');
  if (!parts.length) parts.push('Solide Wahl für heute');
  return parts.join(' · ');
}
