# Scent of the Day

Eine kleine Web-App, die dir jeden Morgen den passenden Duft aus **deiner Sammlung** vorschlägt – passend zu Wetter, Tageszeit und Anlass.

- Reines HTML / CSS / JavaScript, keine Accounts, keine API-Keys
- Daten nur im Browser (`localStorage`) – nichts verlässt dein Gerät außer der Wetterabfrage
- PWA: als Vollbild-App auf dem Home-Bildschirm
- Wetter über [Open-Meteo](https://open-meteo.com) (kostenlos, ohne Key), Standort per Browser, Fallback Freiburg im Breisgau

## Dateien

| Datei | Inhalt |
| --- | --- |
| `index.html` | Oberfläche (Heute, Tagebuch, Sammlung, Statistik) |
| `styles.css` | Apple-Design: Liquid-Glass-Karten, Dark Mode, Safe Areas |
| `data.js` | Deine Sammlung + Duftprofile (Noten, Temperatur, Anlässe) |
| `engine.js` | Wetter-Abruf und Auswahllogik |
| `app.js` | Oberfläche und Speichern |
| `manifest.webmanifest`, `sw.js`, `icons/` | PWA: Home-Bildschirm, Offline-Cache, Icons |
| `widget/scent-of-the-day.js` | Scriptable-Widget für den Home-Bildschirm |

## Die Auswahllogik

Jeder Duft bekommt einen Score aus:

1. **Temperatur** – liegt die aktuelle Temperatur in seiner Wohlfühl-Spanne (`temp`)? Bei Hitze werden starke Düfte abgewertet.
2. **Wetter** – Regen und hohe Luftfeuchtigkeit bremsen sehr kräftige Düfte.
3. **Tageszeit** – abends dürfen Düfte kräftiger sein, vormittags eher leise.
4. **Anlass** – Uni: laute Düfte werden stark abgewertet. Ausgehen/Date: Beast Mode erlaubt.
5. **Geschmack** – süß, boozy, Oud, Amber, Frucht und Vanille geben Punkte. Rauchig und Weihrauch werden stark abgewertet.
6. **Favoriten** – Kaya und Hibiscus Mahajad bekommen einen Bonus.
7. **Keine Wiederholung** – Düfte, die in den letzten 5 Tagen getragen wurden, werden abgewertet.
8. **Tagesvariation** – ein kleiner, pro Tag stabiler Zufallswert, damit nicht jeden Tag dieselben Düfte oben stehen.

## Duftprofile anpassen

In der App unter **Sammlung** kannst du Düfte hinzufügen, bearbeiten und entfernen. Alternativ direkt in `data.js` – jeder Eintrag sieht so aus:

```javascript
{
  id: 'layton', brand: 'Parfums de Marly', name: 'Layton', family: 'Würzig & Holzig',
  intensity: 4,               // 1 leise … 5 Beast Mode
  temp: [5, 22],              // Wohlfühl-Spanne in °C
  occasions: ['date', 'familie', 'chillen'],
  tags: ['süß', 'vanille'],   // rauch / weihrauch = abwerten
  notes: { top: [...], heart: [...], base: [...] },
  color: '#3a2415',           // Hintergrundfarbe des Duftes
  favorite: false, spray: false, verified: true
}
```

> **Hinweis zu den Noten:** Bei einigen Düften habe ich die Noten online bestätigen können (Layton, Elixir d'Amour, Kaya, Khamrah, Shaghaf Oud Azraq, Oud Stallion). Bei den anderen stammen die Angaben aus Erinnerung oder sind Platzhalter (z. B. Elusa 432, Blonde Amber, Orange Flamingo, Paragon, Blue Talisman, Gris Charnel). Sie sind mit „Noten prüfen“ markiert. Korrigiere sie in der App unter Sammlung → Duft → Bearbeiten, oder vergleiche sie mit [Parfumo](https://www.parfumo.com) bzw. [Fragrantica](https://www.fragrantica.com).

## Lokal testen

Die Datei `index.html` direkt im Browser öffnen funktioniert für den Großteil der App. Für Service Worker und die PWA-Installation braucht es einen lokalen Webserver, z. B.:

```bash
cd /Users/ledi/Desktop/scent-of-the-day
python3 -m http.server 8000
```

Dann im Browser `http://localhost:8000` öffnen.

## Veröffentlichen auf GitHub Pages

Siehe Abschnitt unten bzw. die Anleitung im Chat. Kurzfassung: Ein öffentliches Repository anlegen, den Inhalt dieses Ordners hochladen und unter *Settings → Pages* die Quelle „main / root“ wählen. Die Seite ist danach unter `https://ledionbq.github.io/scent-of-the-day/` erreichbar.

---

## Auf dem iPhone zum Home-Bildschirm hinzufügen

1. Die Web-App in **Safari** öffnen (nicht Chrome – nur Safari kann Home-Bildschirm-Apps mit Vollbild anlegen).
2. Unten auf das **Teilen-Symbol** tippen (Quadrat mit Pfeil nach oben).
3. Nach unten wischen und **„Zum Home-Bildschirm“** wählen.
4. Namen prüfen („Scent“) und oben rechts auf **„Hinzufügen“** tippen.
5. Das Icon erscheint auf dem Home-Bildschirm. Öffne es von dort – dann läuft die App ohne Safari-Leiste im Vollbild.

Der Standort wird beim ersten Öffnen abgefragt. Wenn du „Nicht erlauben“ wählst, nimmt die App Freiburg.

## Siri-Kurzbefehl anlegen

1. App **Kurzbefehle** öffnen → **+** tippen.
2. **„Aktion hinzufügen“** → nach **„URL öffnen“** suchen (bzw. „Website öffnen“) und einfügen.
3. Die URL eintragen: `https://ledionbq.github.io/scent-of-the-day/` (den Link bekommst du nach der Veröffentlichung).
4. Oben auf den Namen tippen → **„Scent of the Day“** eingeben.
5. Unten auf das **i-Symbol** (bzw. die drei Punkte) tippen → **„Zu Siri hinzufügen“**.
6. Den Satz aufnehmen, z. B. „Duft des Tages“. Ab jetzt reicht: *„Hey Siri, Duft des Tages“*.

## Scriptable-Widget einrichten

Das Widget zeigt den Duft des Tages und das Wetter direkt auf dem Home-Bildschirm.

1. Die App **Scriptable** aus dem App Store installieren (kostenlos).
2. In Scriptable oben rechts auf **+** tippen.
3. Den Inhalt von `widget/scent-of-the-day.js` kopieren und einfügen.
4. Den Namen auf **„Scent of the Day“** ändern und das Skript speichern.
5. Auf dem Home-Bildschirm lange drücken → **+** (oben links) → **Scriptable** suchen → **Widget** (klein oder mittel) wählen → **Hinzufügen**.
6. Das Widget lange drücken → **Widget bearbeiten** → unter **Skript** „Scent of the Day“ wählen.
7. Optional unter **Parameter**: `uni`, `ausgehen`, `date`, `familie` oder `chillen` eintragen – so wählt das Widget für diesen Anlass aus (Standard: `ausgehen`).

Beim ersten Start fragt Scriptable nach dem Standort – bitte erlauben, sonst wird Freiburg verwendet.

**Wichtig:** Das Widget hat eine eigene Kopie der Sammlung (in `widget/scent-of-the-day.js`, Feld `SCENTS`). Änderst du Düfte in der App, musst du sie im Widget-Skript ebenfalls anpassen.
