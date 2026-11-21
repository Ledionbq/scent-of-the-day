/* Scent of the Day – Sammlung & Duftprofile
 * verified: true  = Noten wurden (teilweise) online bestätigt
 * verified: false = Noten aus Erinnerung/Platzhalter – bitte in der App korrigieren
 * temp = ideale Temperatur-Spanne in °C
 * intensity = 1 (leise) bis 5 (Beast Mode)
 */

const OCCASIONS = [
  { id: 'uni', label: 'Uni' },
  { id: 'ausgehen', label: 'Ausgehen' },
  { id: 'date', label: 'Date' },
  { id: 'familie', label: 'Familie' },
  { id: 'chillen', label: 'Chillen' },
];

const FAMILIES = [
  'Gourmand & Boozy',
  'Amber & Oud',
  'Fruchtig & Süß',
  'Aromatisch & Honig',
  'Würzig & Holzig',
  'Blumig',
  'Frisch & Zitrus',
];

const TAG_OPTIONS = [
  { id: 'süß', label: 'süß' },
  { id: 'boozy', label: 'boozy' },
  { id: 'oud', label: 'Oud' },
  { id: 'amber', label: 'Amber' },
  { id: 'frucht', label: 'fruchtig' },
  { id: 'vanille', label: 'Vanille' },
  { id: 'rauch', label: 'rauchig ⚠︎' },
  { id: 'weihrauch', label: 'Weihrauch ⚠︎' },
];

const LIKED_TAGS = ['süß', 'boozy', 'oud', 'amber', 'frucht', 'vanille'];

const DEFAULT_SCENTS = [
  {
    id: 'layton', brand: 'Parfums de Marly', name: 'Layton', family: 'Würzig & Holzig',
    intensity: 4, temp: [5, 22], occasions: ['date', 'familie', 'chillen'], tags: ['süß', 'vanille'],
    notes: { top: ['Apfel', 'Lavendel', 'Bergamotte'], heart: ['Jasmin', 'Rosengeranie', 'Veilchen'], base: ['Vanille', 'Amber', 'Guajakholz', 'karamellisierte Kaffeebohne', 'Patchouli', 'rosa Pfeffer'] },
    color: '#3a2415', favorite: false, spray: false, verified: true,
  },
  {
    id: 'althair', brand: 'Parfums de Marly', name: 'Althaïr', family: 'Würzig & Holzig',
    intensity: 3, temp: [0, 18], occasions: ['date', 'chillen', 'familie', 'uni'], tags: ['vanille'],
    notes: { top: ['Orangenblüte', 'Zimt', 'Bergamotte'], heart: ['Bourbon-Vanille', 'Elemiharz'], base: ['Praline', 'Ambrox', 'Guajakholz', 'Moschus'] },
    color: '#2a2216', favorite: false, spray: false, verified: true,
  },
  {
    id: 'hibiscus', brand: 'Maison Crivelli', name: 'Hibiscus Mahajad', family: 'Fruchtig & Süß',
    intensity: 3, temp: [12, 28], occasions: ['uni', 'ausgehen', 'chillen', 'familie'], tags: ['frucht', 'süß'],
    notes: { top: ['Hibiskus', 'Beeren'], heart: ['Rose'], base: ['Moschus'] },
    color: '#4a0f22', favorite: true, spray: false, verified: false,
  },
  {
    id: 'kaya', brand: "Parfums d'Elmar", name: 'Kaya', family: 'Gourmand & Boozy',
    intensity: 4, temp: [8, 22], occasions: ['ausgehen', 'date', 'chillen'], tags: ['süß', 'boozy', 'frucht', 'vanille'],
    notes: { top: ['Apfel', 'Bergamotte', 'Erdbeere'], heart: ['Jasmin', 'weiße Blüten'], base: ['Amber', 'Ambrox', 'Patchouli', 'Rum', 'Tonka', 'Vanille'] },
    color: '#5a1830', favorite: true, spray: true, verified: true,
  },
  {
    id: 'elixir', brand: "Parfums d'Elmar", name: "Elixir d'Amour", family: 'Amber & Oud',
    intensity: 4, temp: [-5, 15], occasions: ['date', 'ausgehen', 'familie'], tags: ['oud', 'amber', 'süß', 'frucht'],
    notes: { top: ['rosa Pfeffer', 'Safran', 'Bergamotte', 'Feigenblatt'], heart: ['Himbeere', 'bulgarische Rose', 'Guajakholz', 'Wasserjasmin', 'Maiglöckchen'], base: ['Oud', 'Karamell', 'Amber', 'Amyris', 'Moschus', 'Patchouli', 'Zistrose', 'Vanille'] },
    color: '#3d1a14', favorite: false, spray: false, verified: true,
  },
  {
    id: 'oud01', brand: 'Swiss Arabian', name: 'Oud 01', family: 'Amber & Oud',
    intensity: 4, temp: [-5, 15], occasions: ['ausgehen', 'date', 'familie'], tags: ['oud', 'amber'],
    notes: { top: ['Gewürze'], heart: ['Rose'], base: ['Oud', 'Amber'] },
    color: '#3a2810', favorite: false, spray: false, verified: false,
  },
  {
    id: 'shaghaf', brand: 'Swiss Arabian', name: 'Shaghaf Oud Azraq', family: 'Amber & Oud',
    intensity: 5, temp: [-5, 12], occasions: ['ausgehen', 'date'], tags: ['oud', 'amber', 'süß', 'vanille'],
    notes: { top: ['Honig', 'Oud'], heart: ['Zimt', 'Amber', 'Bourbon-Vanille'], base: ['Leder', 'Patchouli'] },
    color: '#3b2208', favorite: false, spray: false, verified: true,
  },
  {
    id: 'khaltat', brand: 'Attar Collection', name: 'Khaltat Night', family: 'Gourmand & Boozy',
    intensity: 4, temp: [-3, 14], occasions: ['ausgehen', 'date', 'familie'], tags: ['süß', 'boozy', 'frucht'],
    notes: { top: ['Kirsche', 'roter Apfel'], heart: ['Jasmin', 'Vanille'], base: ['Zimt', 'Amber', 'Klee', 'Moschus', 'Patchouli'] },
    color: '#3c1520', favorite: false, spray: false, verified: true,
  },
  {
    id: 'khamrah', brand: 'Lattafa', name: 'Khamrah', family: 'Gourmand & Boozy',
    intensity: 4, temp: [-5, 15], occasions: ['ausgehen', 'date', 'chillen'], tags: ['süß', 'boozy', 'vanille'],
    notes: { top: ['Gewürze'], heart: ['Tonka', 'Zimt', 'Eiche'], base: ['Vanille', 'Praline', 'Sandelholz'] },
    color: '#4a2410', favorite: false, spray: false, verified: true,
  },
  {
    id: 'lostcherry', brand: 'Tom Ford', name: 'Lost Cherry', family: 'Fruchtig & Süß',
    intensity: 4, temp: [-5, 18], occasions: ['date', 'ausgehen', 'chillen'], tags: ['süß', 'frucht', 'vanille', 'boozy'],
    notes: { top: ['Schwarzkirsche', 'Kirsch-Likör', 'Bittermandel'], heart: ['Sauerkirschsirup', 'Jasmin-Sambac', 'türkische Rose'], base: ['geröstete Tonkabohne', 'Perubalsam', 'Sandelholz', 'Vetiver', 'Zeder'] },
    color: '#4e0b18', favorite: false, spray: false, verified: true,
  },
  {
    id: 'cafe', brand: 'Montale', name: 'Intense Café', family: 'Gourmand & Boozy',
    intensity: 4, temp: [-5, 12], occasions: ['ausgehen', 'date', 'chillen'], tags: ['süß', 'boozy', 'vanille'],
    notes: { top: ['blumige Noten'], heart: ['Rose', 'Kaffee'], base: ['Vanille', 'Amber', 'weißer Moschus'] },
    color: '#2e1c12', favorite: false, spray: false, verified: true,
  },
  {
    id: 'tonka', brand: 'Montale', name: 'Arabians Tonka', family: 'Gourmand & Boozy',
    intensity: 4, temp: [0, 15], occasions: ['date', 'chillen', 'familie'], tags: ['süß', 'vanille', 'amber'],
    notes: { top: ['Tonka'], heart: ['Vanille'], base: ['Amber', 'Cumarin'] },
    color: '#3a2a1a', favorite: false, spray: false, verified: false,
  },
  {
    id: 'oudDream', brand: 'Montale', name: 'Oud Dream', family: 'Amber & Oud',
    intensity: 4, temp: [-2, 14], occasions: ['ausgehen', 'date'], tags: ['oud', 'amber'],
    notes: { top: ['Honig', 'Kardamom', 'Leder', 'Safran', 'Lavendel', 'Muskat', 'Zimt'], heart: ['Rose', 'Patchouli', 'Oud', 'Tuberose'], base: ['Zedernholz', 'Ambra', 'Labdanum', 'Sandelholz', 'Vanille'] },
    color: '#352010', favorite: false, spray: false, verified: true,
  },
  {
    id: 'maracuja', brand: '', name: 'Oud Maracuja (Dupe)', family: 'Fruchtig & Süß',
    intensity: 3, temp: [10, 26], occasions: ['ausgehen', 'chillen', 'uni'], tags: ['frucht', 'oud', 'süß'],
    notes: { top: ['Maracuja'], heart: ['Beeren'], base: ['Oud', 'Vanille'] },
    color: '#4a2a0c', favorite: false, spray: false, verified: false,
  },
  {
    id: 'elusa', brand: '', name: 'Elusa 432', family: 'Frisch & Zitrus',
    intensity: 3, temp: [14, 28], occasions: ['uni', 'chillen', 'familie'], tags: ['frisch'],
    notes: { top: [], heart: [], base: [] },
    color: '#0f3a3a', favorite: false, spray: false, verified: false,
  },
  {
    id: 'blondeAmber', brand: 'Clive Christian', name: 'Blonde Amber', family: 'Amber & Oud',
    intensity: 3, temp: [0, 16], occasions: ['date', 'familie', 'chillen'], tags: ['amber', 'vanille'],
    notes: { top: [], heart: [], base: ['Amber'] },
    color: '#4a3010', favorite: false, spray: false, verified: false,
  },
  {
    id: 'orangeFlamingo', brand: 'Marc-Gebauer', name: 'Orange Flamingo', family: 'Frisch & Zitrus',
    intensity: 3, temp: [16, 30], occasions: ['uni', 'familie', 'chillen'], tags: ['frucht', 'frisch'],
    notes: { top: ['Orange'], heart: [], base: [] },
    color: '#5a2a00', favorite: false, spray: false, verified: false,
  },
  {
    id: 'naxos', brand: 'Xerjoff', name: 'Naxos', family: 'Aromatisch & Honig',
    intensity: 4, temp: [0, 16], occasions: ['date', 'ausgehen', 'chillen', 'familie'], tags: ['süß', 'vanille', 'weihrauch'],
    notes: { top: ['Lavendel', 'Bergamotte', 'omanischer Weihrauch', 'Zitrone'], heart: ['Honig', 'Jasmin-Sambac', 'Kaschmir', 'Zimt'], base: ['Tabak', 'Tonkabohne', 'Vanille'] },
    color: '#3e2a10', favorite: false, spray: false, verified: true,
  },
  {
    id: 'ombre', brand: 'Louis Vuitton', name: 'Ombre Nomade', family: 'Amber & Oud',
    intensity: 4, temp: [-5, 12], occasions: ['ausgehen', 'date'], tags: ['oud', 'weihrauch'],
    notes: { top: ['Safran'], heart: ['Oud'], base: ['Weihrauch', 'Zeder', 'Labdanum'] },
    color: '#2a1a0c', favorite: false, spray: false, verified: false,
  },
  {
    id: 'paragon', brand: 'Initio', name: 'Paragon', family: 'Würzig & Holzig',
    intensity: 3, temp: [5, 20], occasions: ['uni', 'chillen', 'familie'], tags: [],
    notes: { top: [], heart: [], base: [] },
    color: '#1f2a3a', favorite: false, spray: false, verified: false,
  },
  {
    id: 'blueTalisman', brand: 'Ex Nihilo', name: 'Blue Talisman Extrait', family: 'Frisch & Zitrus',
    intensity: 4, temp: [12, 28], occasions: ['ausgehen', 'date'], tags: ['frisch'],
    notes: { top: [], heart: [], base: [] },
    color: '#0d2a4a', favorite: false, spray: false, verified: false,
  },
  {
    id: 'grisCharnel', brand: 'BDK', name: 'Gris Charnel', family: 'Würzig & Holzig',
    intensity: 4, temp: [5, 20], occasions: ['date', 'ausgehen', 'chillen'], tags: [],
    notes: { top: ['Feige', 'Kardamom', 'schwarzer Tee'], heart: ['Bourbon-Vetiver', 'Iris Absolue'], base: ['indisches Sandelholz', 'Tonkabohne', 'Absolue'] },
    color: '#2a2a2a', favorite: false, spray: false, verified: true,
  },
  {
    id: 'stallion', brand: 'Maison Crivelli', name: 'Oud Stallion', family: 'Amber & Oud',
    intensity: 5, temp: [-5, 12], occasions: ['ausgehen', 'date'], tags: ['oud', 'amber', 'süß'],
    notes: { top: ['Muskatnuss', 'Kardamom', 'Safran'], heart: ['Osmanthus', 'Jasmin', 'türkische Rose'], base: ['Leder', 'Oud', 'Tonka', 'Patchouli', 'Zeder'] },
    color: '#3a1f0a', favorite: false, spray: false, verified: true,
  },
  {
    id: 'pacificChill', brand: 'Louis Vuitton', name: 'Pacific Chill', family: 'Frisch & Zitrus',
    intensity: 3, temp: [14, 28], occasions: ['uni', 'chillen', 'familie'], tags: ['frisch'],
    notes: { top: [], heart: [], base: [] },
    color: '#0f3a46', favorite: false, spray: false, verified: false,
  },
  {
    id: 'stronger', brand: 'Giorgio Armani', name: 'Emporio Armani Stronger With You Amber', family: 'Amber & Oud',
    intensity: 4, temp: [-5, 15], occasions: ['date', 'ausgehen'], tags: ['amber', 'süß', 'vanille'],
    notes: { top: [], heart: [], base: [] },
    color: '#3a2412', favorite: false, spray: false, verified: false,
  },
  {
    id: 'velvetTonka', brand: 'BDK Parfums', name: 'Velvet Tonka', family: 'Gourmand & Boozy',
    intensity: 4, temp: [0, 15], occasions: ['date', 'chillen'], tags: ['süß', 'vanille'],
    notes: { top: [], heart: [], base: ['Tonka'] },
    color: '#3a2a1c', favorite: false, spray: false, verified: false,
  },
  {
    id: 'tobaccoVanille', brand: 'Tom Ford', name: 'Tobacco Vanille', family: 'Gourmand & Boozy',
    intensity: 4, temp: [-5, 15], occasions: ['ausgehen', 'date', 'chillen'], tags: ['süß', 'vanille'],
    notes: { top: [], heart: [], base: ['Vanille', 'Tabak'] },
    color: '#3a2010', favorite: false, spray: false, verified: false,
  },
  {
    id: 'jeanLoweNoir', brand: 'Maison Alhambra', name: 'Jean Lowe Noir (Dupe Ombre Nomade)', family: 'Amber & Oud',
    intensity: 4, temp: [-5, 12], occasions: ['ausgehen', 'date'], tags: ['oud'],
    notes: { top: [], heart: [], base: [] },
    color: '#2a1a0c', favorite: false, spray: false, verified: false,
  },
];
