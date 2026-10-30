import { Input } from '@project/components/ui/input';
import { Label } from '@project/components/ui/label';
import { Button } from '@project/components/ui/button';
import { Slider } from '@project/components/ui/slider';
import { useConfig } from '../../lib/ConfigContext';
import { ImageField } from './ThemeEditor';

const LAYOUTS = [
  { id: 'list', icon: '▤', label: 'Liste', desc: 'Boutons larges avec + et −' },
  { id: 'tiles', icon: '▦', label: 'Tuiles', desc: 'Rectangles compacts, − / + sur les côtés' },
  { id: 'compact', icon: '●', label: 'Compact', desc: 'Pastilles rondes ramassées' },
  { id: 'strip', icon: '☰', label: 'Signal', desc: 'Rangées modernes, stepper capsule' },
] as const;

export default function BuvetteEditor() {
  const { config, update } = useConfig();
  const t = config.theme;
  return (
    <div className="space-y-6">
      <section className="space-y-3 rounded-2xl border bg-card p-4">
        <h3 className="font-bold">Identité de la buvette</h3>
        <div><Label>Nom de la buvette</Label>
          <Input value={t.clubName} onChange={(e) => update((c) => ({ ...c, theme: { ...c.theme, clubName: e.target.value } }))} className="mt-1" /></div>
        <ImageField label="Logo (sert aussi de bouton « Nouveau client »)" value={t.logoUrl} defaultPath="/images/logo.webp"
          onChange={(url) => update((c) => ({ ...c, theme: { ...c.theme, logoUrl: url } }))} />
      </section>
      <section className="space-y-2 rounded-2xl border bg-card p-4">
        <h3 className="font-bold">Mise en page de la caisse</h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {LAYOUTS.map((l) => {
            const on = (t.layout ?? 'list') === l.id;
            return (
              <button key={l.id} onClick={() => update((c) => ({ ...c, theme: { ...c.theme, layout: l.id } }))}
                className={`rounded-xl border p-2 text-left transition ${on ? 'border-primary bg-primary/10 ring-1 ring-primary' : 'bg-background'}`}>
                <div className="text-xl">{l.icon}</div>
                <div className="text-sm font-semibold">{l.label}</div>
                <div className="text-[11px] leading-tight text-muted-foreground">{l.desc}</div>
              </button>
            );
          })}
        </div>
      </section>
      <section className="space-y-2 rounded-2xl border bg-card p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold">Taille des boissons à l'écran</h3>
          <span className="tabular text-sm text-muted-foreground">{Math.round((t.zoom ?? 1) * 100)} %</span>
        </div>
        <p className="text-sm text-muted-foreground">Plus petit = plus de boissons visibles sans défiler (et 3 par ligne si la place le permet). S'applique à tous les serveurs.</p>
        <Slider min={60} max={140} step={5} value={[Math.round((t.zoom ?? 1) * 100)]}
          onValueChange={([v]) => update((c) => ({ ...c, theme: { ...c.theme, zoom: v / 100 } }))} />
      </section>
    </div>
  );
}
