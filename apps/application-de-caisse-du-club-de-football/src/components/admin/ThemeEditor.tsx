import { ImagePlus, X } from 'lucide-react';
import { useState } from 'react';
import { Label } from '@project/components/ui/label';
import { Button } from '@project/components/ui/button';
import { Input } from '@project/components/ui/input';
import { Slider } from '@project/components/ui/slider';
import { useConfig } from '../../lib/ConfigContext';
import { EFFECTS, FONTS, PRESETS, ThemeSettings, getPreset, hslToHex, themeEffect, themeFont } from '../../lib/config';

const COLOR_FIELDS = [
  ['background', 'Fond'], ['card', 'Cartes'], ['foreground', 'Texte'], ['primary', 'Bouton principal / total'], ['accent', 'Monnaie à rendre'],
] as const;

export function ImageField({ label, value, onChange, defaultPath }: { label: string; value: string; onChange: (url: string) => void; defaultPath?: string }) {
  const [urlInput, setUrlInput] = useState(value);
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border bg-muted">
        {value ? <img src={value} alt="" className="h-full w-full object-cover" /> : <ImagePlus className="h-6 w-6 text-muted-foreground" />}
      </div>
      <div className="flex-1">
        <Label>{label}</Label>
        <div className="mt-1 flex gap-2">
          <Input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="/images/..."
            className="flex-1"
          />
          <Button size="sm" onClick={() => onChange(urlInput)}>Appliquer</Button>
          {defaultPath && <Button size="sm" variant="outline" onClick={() => { setUrlInput(defaultPath); }}>Suggérer</Button>}
          {value && <Button size="sm" variant="ghost" onClick={() => { onChange(''); setUrlInput(''); }}><X className="mr-1 h-4 w-4" />Retirer</Button>}
        </div>
      </div>
    </div>
  );
}

function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border bg-card p-4">
      <h3 className="mb-3 flex items-center gap-2 font-semibold">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">{n}</span>{title}
      </h3>
      {children}
    </section>
  );
}

const choice = (on: boolean) => `rounded-xl border-2 p-3 text-center transition ${on ? 'border-primary bg-primary/10' : 'border-border'}`;

export default function ThemeEditor() {
  const { config, update } = useConfig();
  const t = config.theme;
  const set = (v: Partial<ThemeSettings>) => update((c) => ({ ...c, theme: { ...c.theme, ...v } }));
  const effect = themeEffect(t);
  const font = themeFont(t);

  return (
    <div className="space-y-4">
      <Section n={1} title="Image de fond">
        <ImageField label="Image affichée derrière toute la caisse" value={t.bgImageUrl} defaultPath="/images/background.webp" onChange={(url) => set({ bgImageUrl: url })} />
        {t.bgImageUrl && (
          <div className="mt-3"><Label>Visibilité de l'image</Label><Slider className="mt-2" min={5} max={80} value={[Math.round(t.bgImageOpacity * 100)]} onValueChange={([v]) => set({ bgImageOpacity: v / 100 })} /></div>
        )}
      </Section>

      <Section n={2} title="Effet sur le fond">
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {EFFECTS.map((e) => (
            <button key={e.id} onClick={() => set({ effect: e.id })} className={choice(effect === e.id)}>
              <div className="text-2xl">{e.emoji}</div><div className="text-sm font-medium">{e.name}</div>
            </button>
          ))}
        </div>
        {effect !== 'none' && (
          <div className="mt-4">
            <div className="flex justify-between"><Label>Visibilité de l'effet</Label><span className="text-sm text-muted-foreground">{Math.round((t.effectOpacity ?? 1) * 100)} %</span></div>
            <Slider className="mt-2" min={10} max={100} step={5} value={[Math.round((t.effectOpacity ?? 1) * 100)]} onValueChange={([v]) => set({ effectOpacity: v / 100 })} />
          </div>
        )}
      </Section>

      <Section n={3} title="Police des titres">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {FONTS.map((f) => (
            <button key={f.id} onClick={() => set({ font: f.id })} className={choice(font.id === f.id)}>
              <div className="truncate text-xl" style={{ fontFamily: f.css }}>{t.clubName || 'Buvette'}</div>
              <div className="text-xs text-muted-foreground">{f.name}</div>
            </button>
          ))}
        </div>
      </Section>

      <Section n={4} title="Couleurs">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {PRESETS.map((p) => (
            <button key={p.id} onClick={() => set({ preset: p.id, overrides: {} })}
              className={`rounded-xl border-2 p-3 text-left transition ${t.preset === p.id ? 'border-primary ring-2 ring-primary/40' : 'border-border'}`}
              style={{ background: `hsl(${p.vars.background})`, color: `hsl(${p.vars.foreground})` }}>
              <div className="font-semibold">{p.emoji} {p.name}</div>
              <div className="mt-2 flex gap-1">
                {['primary', 'accent', 'card', 'foreground'].map((k) => <span key={k} className="h-4 w-4 rounded-full border border-black/10" style={{ background: `hsl(${p.vars[k]})` }} />)}
              </div>
            </button>
          ))}
        </div>
        <div className="mb-2 mt-4 flex items-center justify-between">
          <span className="text-sm font-medium">Ajuster les couleurs</span>
          <Button size="sm" variant="ghost" onClick={() => set({ overrides: {} })}>Revenir aux couleurs du thème</Button>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {COLOR_FIELDS.map(([k, label]) => (
            <label key={k} className="flex items-center justify-between rounded-xl border p-2">
              <span className="text-sm font-medium">{label}<span className="ml-1 text-xs font-normal text-muted-foreground">{t.overrides[k] ? 'modifiée' : 'du thème'}</span></span>
              <input type="color" value={t.overrides[k] ?? hslToHex(getPreset(t.preset).vars[k])} onChange={(e) => set({ overrides: { ...t.overrides, [k]: e.target.value } })} className="h-9 w-12 cursor-pointer rounded border bg-transparent" />
            </label>
          ))}
        </div>
      </Section>
    </div>
  );
}
