export type Category = { id: string; name: string; emoji: string; color: string | null };
export type Product = { id: string; name: string; price: number; emoji: string; categoryId: string; imageUrl?: string };
export type ThemeSettings = {
  preset: string;
  clubName: string;
  logoUrl: string;
  bgImageUrl: string;
  bgImageOpacity: number;
  decorations: boolean;
  effect?: Effect;
  effectOpacity?: number;
  zoom?: number;
  layout?: 'list' | 'tiles' | 'compact' | 'strip';
  font?: string;
  overrides: Partial<Record<'background' | 'card' | 'foreground' | 'primary' | 'accent', string>>;
};
export type Effect = 'none' | 'halloween' | 'christmas' | 'fluo' | 'summer';
export const EFFECTS: { id: Effect; name: string; emoji: string }[] = [
  { id: 'none', name: 'Aucun', emoji: '🚫' },
  { id: 'halloween', name: 'Halloween', emoji: '🦇' },
  { id: 'christmas', name: 'Neige', emoji: '❄️' },
  { id: 'fluo', name: 'Lueurs fluo', emoji: '🪩' },
  { id: 'summer', name: 'Soleil', emoji: '🌞' },
];
export const FONTS = [
  { id: 'outfit', name: 'Moderne', css: "'Outfit', sans-serif" },
  { id: 'creepster', name: 'Halloween', css: "'Creepster', cursive" },
  { id: 'christmas', name: 'Noël', css: "'Mountains of Christmas', cursive" },
  { id: 'fluo', name: 'Fluo', css: "'Monoton', cursive" },
  { id: 'summer', name: 'Estival', css: "'Pacifico', cursive" },
  { id: 'sport', name: 'Sport', css: "'Bebas Neue', sans-serif" },
];
const DEFAULT_FONT: Record<string, string> = { halloween: 'creepster' };
export const themeEffect = (t: ThemeSettings): Effect =>
  t.effect ?? (t.decorations ? getPreset(t.preset).decor : 'none');
export const themeFont = (t: ThemeSettings) =>
  FONTS.find((f) => f.id === (t.font ?? DEFAULT_FONT[t.preset] ?? 'outfit')) ?? FONTS[0];

export type AppConfig = { version: number; categories: Category[]; products: Product[]; theme: ThemeSettings };

export const uid = () => Math.random().toString(36).slice(2, 10);

const cat = (id: string, name: string, emoji: string): Category => ({ id, name, emoji, color: null });
const p = (name: string, price: number, emoji: string, categoryId: string): Product => ({ id: uid(), name, price, emoji, categoryId });

export const DEFAULT_CONFIG: AppConfig = {
  version: 1,
  categories: [
    cat('bieres', 'Bières & apéritifs', '🍺'),
    cat('spiritueux', 'Whiskys & spiritueux', '🥃'),
    cat('vins', 'Vins', '🍷'),
    cat('soft', 'Soft', '🥤'),
    cat('snacks', 'Snacks', '🥪'),
  ],
  products: [
    p('Bière rouge', 300, '🍺', 'bieres'),
    p('Bière blonde', 250, '🍻', 'bieres'),
    p('Picon bière', 300, '🍺', 'bieres'),
    p('Ricard', 250, '🥛', 'bieres'),
    p('Whisky Coca', 300, '🥃', 'spiritueux'),
    p('Whisky', 250, '🥃', 'spiritueux'),
    p('Get 27', 250, '🌿', 'spiritueux'),
    p('Baileys', 250, '☕', 'spiritueux'),
    p('Vin blanc', 250, '🥂', 'vins'),
    p('Vin rosé', 250, '🌸', 'vins'),
    p('Pétillant', 250, '🍾', 'vins'),
    p('Coca', 200, '🥤', 'soft'),
    p('Oasis', 200, '🍊', 'soft'),
    p('Perrier', 200, '💧', 'soft'),
    p('Croque-monsieur', 200, '🥪', 'snacks'),
    p('Kit-Kat / Twix / Snickers', 150, '🍫', 'snacks'),
    p('Chips', 100, '🥔', 'snacks'),
  ],
  theme: {
    preset: 'sombre', effect: 'none', font: 'outfit', clubName: 'Buvette du Club', logoUrl: '', bgImageUrl: '', bgImageOpacity: 0.15,
    decorations: true, overrides: {},
  },
};

export type Preset = {
  id: string; name: string; emoji: string; decor: 'none' | 'halloween' | 'christmas' | 'fluo' | 'summer';
  titleFont?: string; dark: boolean; palette: string[]; vars: Record<string, string>;
};

function mk(o: { bg: string; fg: string; card: string; primary: string; primaryFg: string; accent: string; accentFg: string; muted: string; mutedFg: string; border: string }) {
  return {
    background: o.bg, foreground: o.fg, card: o.card, 'card-foreground': o.fg, popover: o.card, 'popover-foreground': o.fg,
    primary: o.primary, 'primary-foreground': o.primaryFg, secondary: o.muted, 'secondary-foreground': o.fg,
    muted: o.muted, 'muted-foreground': o.mutedFg, accent: o.accent, 'accent-foreground': o.accentFg,
    border: o.border, input: o.border, ring: o.primary, destructive: '0 84% 58%', 'destructive-foreground': '0 0% 100%',
  };
}

export const PRESETS: Preset[] = [
  { id: 'sobre', name: 'Sobre vert & blanc', emoji: '🌿', decor: 'none', dark: false,
    palette: ['#15803d', '#0f766e', '#4d7c0f', '#047857', '#166534'],
    vars: mk({ bg: '140 25% 97%', fg: '150 35% 12%', card: '0 0% 100%', primary: '145 63% 30%', primaryFg: '0 0% 100%', accent: '150 55% 40%', accentFg: '0 0% 100%', muted: '140 18% 92%', mutedFg: '150 10% 40%', border: '140 16% 86%' }) },
  { id: 'sombre', name: 'Sombre vert & blanc', emoji: '🌲', decor: 'none', dark: true,
    palette: ['#4ade80', '#2dd4bf', '#a3e635', '#34d399', '#86efac'],
    vars: mk({ bg: '155 30% 7%', fg: '0 0% 97%', card: '155 24% 12%', primary: '142 65% 46%', primaryFg: '155 40% 6%', accent: '0 0% 96%', accentFg: '155 40% 8%', muted: '155 18% 17%', mutedFg: '150 10% 68%', border: '155 16% 22%' }) },
  { id: 'halloween', name: 'Halloween', emoji: '🎃', decor: 'halloween', dark: true, titleFont: "'Creepster', cursive",
    palette: ['#f97316', '#a855f7', '#84cc16', '#facc15', '#ec4899'],
    vars: mk({ bg: '268 50% 6%', fg: '35 100% 94%', card: '268 40% 12%', primary: '26 100% 52%', primaryFg: '268 60% 6%', accent: '95 80% 50%', accentFg: '268 60% 6%', muted: '268 32% 18%', mutedFg: '270 20% 72%', border: '275 40% 26%' }) },
  { id: 'noel', name: 'Noël', emoji: '🎄', decor: 'christmas', dark: true,
    palette: ['#dc2626', '#16a34a', '#eab308', '#f1f5f9', '#0ea5e9'],
    vars: mk({ bg: '155 45% 8%', fg: '40 60% 96%', card: '155 38% 13%', primary: '0 78% 52%', primaryFg: '0 0% 100%', accent: '44 92% 56%', accentFg: '155 45% 8%', muted: '155 28% 18%', mutedFg: '150 15% 70%', border: '155 25% 24%' }) },
  { id: 'fluo', name: 'Soirée fluo', emoji: '🪩', decor: 'fluo', dark: true,
    palette: ['#ff2bd6', '#00f0ff', '#b6ff00', '#ffe600', '#ff6b00'],
    vars: mk({ bg: '245 30% 5%', fg: '0 0% 100%', card: '245 25% 10%', primary: '312 100% 58%', primaryFg: '245 30% 5%', accent: '184 100% 50%', accentFg: '245 30% 5%', muted: '245 20% 15%', mutedFg: '245 12% 70%', border: '260 30% 24%' }) },
  { id: 'ete', name: 'Fête estivale', emoji: '🌞', decor: 'summer', dark: false,
    palette: ['#f97316', '#06b6d4', '#ec4899', '#84cc16', '#eab308'],
    vars: mk({ bg: '42 90% 95%', fg: '20 50% 14%', card: '0 0% 100%', primary: '14 92% 55%', primaryFg: '0 0% 100%', accent: '188 85% 42%', accentFg: '0 0% 100%', muted: '40 60% 88%', mutedFg: '20 20% 40%', border: '38 45% 82%' }) },
];

export const getPreset = (id: string) => PRESETS.find((x) => x.id === id) ?? PRESETS[0];

export function hexToHsl(hex: string) {
  const m = hex.replace('#', '');
  const r = parseInt(m.slice(0, 2), 16) / 255, g = parseInt(m.slice(2, 4), 16) / 255, b = parseInt(m.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h *= 60;
  }
  return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

const contrastFg = (hex: string) => {
  const m = hex.replace('#', '');
  const lum = (0.299 * parseInt(m.slice(0, 2), 16) + 0.587 * parseInt(m.slice(2, 4), 16) + 0.114 * parseInt(m.slice(4, 6), 16)) / 255;
  return lum > 0.6 ? '0 0% 8%' : '0 0% 100%';
};

export function applyTheme(theme: ThemeSettings) {
  const preset = getPreset(theme.preset);
  const vars: Record<string, string> = { ...preset.vars };
  const o = theme.overrides;
  if (o.background) vars.background = hexToHsl(o.background);
  if (o.card) { vars.card = hexToHsl(o.card); vars.popover = vars.card; }
  if (o.foreground) { vars.foreground = hexToHsl(o.foreground); vars['card-foreground'] = vars.foreground; vars['popover-foreground'] = vars.foreground; }
  if (o.primary) { vars.primary = hexToHsl(o.primary); vars['primary-foreground'] = contrastFg(o.primary); vars.ring = vars.primary; }
  if (o.accent) { vars.accent = hexToHsl(o.accent); vars['accent-foreground'] = contrastFg(o.accent); }
  const root = document.documentElement;
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(`--${k}`, v));
  root.style.setProperty('--font-title', themeFont(theme).css);
  root.classList.toggle('dark', preset.dark);
}

// Les couleurs des catégories suivent toujours le thème choisi
export const categoryColor = (_c: Category, index: number, theme: ThemeSettings) =>
  getPreset(theme.preset).palette[index % getPreset(theme.preset).palette.length];

export function hslToHex(triple: string) {
  const [h, s, l] = triple.replace(/%/g, '').split(' ').map(Number);
  const a = (s / 100) * Math.min(l / 100, 1 - l / 100);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const c = l / 100 - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * c).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export const euro = (cents: number) =>
  (cents / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });

export const parseEuro = (s: string) => {
  const n = parseFloat(s.replace(',', '.').replace(/[^0-9.]/g, ''));
  return isNaN(n) ? 0 : Math.round(n * 100);
};

export const migrate = (c: AppConfig): AppConfig => ({
  ...c,
  categories: c.categories.map((x) => (x.name === 'Sans alcool' ? { ...x, name: 'Soft' } : x)),
});

const CACHE = 'caisse:config';
export const loadCached = (): AppConfig | null => {
  try { const s = localStorage.getItem(CACHE); return s ? migrate(JSON.parse(s)) : null; } catch { return null; }
};
export const saveCached = (c: AppConfig) => localStorage.setItem(CACHE, JSON.stringify(c));
