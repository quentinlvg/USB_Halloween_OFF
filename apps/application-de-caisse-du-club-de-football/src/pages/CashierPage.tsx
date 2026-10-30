import { useMemo, useState } from 'react';
import { Settings, QrCode } from 'lucide-react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@project/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@project/components/ui/dialog';
import { useConfig } from '../lib/ConfigContext';
import ProductButton from '../components/ProductButton';
import ProductTile from '../components/ProductTile';
import ProductStrip from '../components/ProductStrip';
import PaymentPanel from '../components/PaymentPanel';
import Decorations from '../components/Decorations';

function VersionDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const versions = [
    { name: 'USB_Halloween avec base', url: 'https://buvette-halloween.vercel.app/', desc: 'Version avec synchronisation base de données' },
    { name: 'USB_Halloween sans base', url: 'https://usb-halloween-off.onrender.com/', desc: 'Version statique locale' },
  ];

  if (selectedUrl) {
    return (
      <Dialog open={open} onOpenChange={(v) => { if (!v) setSelectedUrl(null); onOpenChange(v); }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center py-4">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(selectedUrl)}`}
              alt="QR Code"
              className="rounded-lg border"
            />
            <p className="mt-3 text-sm text-muted-foreground text-center break-all">{selectedUrl}</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choisir la version</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-4">
          {versions.map((v) => (
            <button
              key={v.url}
              onClick={() => setSelectedUrl(v.url)}
              className="block w-full rounded-xl border-2 border-border p-4 text-left transition-colors hover:border-primary hover:bg-primary/5"
            >
              <div className="font-semibold text-foreground">{v.name}</div>
              <div className="mt-1 text-sm text-muted-foreground">{v.desc}</div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function CashierPage() {
  const { config } = useConfig();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [received, setReceived] = useState('');
  const [confirm, setConfirm] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const zoom = config.theme.zoom ?? 1;
  const layout = config.theme.layout ?? 'list';

  const setQty = (id: string, q: number) => setCounts((c) => ({ ...c, [id]: Math.max(0, q) }));
  const total = useMemo(() => config.products.reduce((s, p) => s + p.price * (counts[p.id] || 0), 0), [config.products, counts]);
  const dirty = total > 0 || !!received;
  const reset = () => { setCounts({}); setReceived(''); setConfirm(false); };

  return (
    <div className="mx-auto flex h-[100dvh] max-w-5xl flex-col">
      <Decorations />
      <header className="flex items-center gap-3 px-3 pb-2 pt-2">
        <button onClick={() => (dirty ? setConfirm(true) : reset())} aria-label="Nouveau client" className="relative shrink-0 active:scale-90">
          {config.theme.logoUrl
            ? <img src={config.theme.logoUrl} alt="Nouveau client" className="h-12 w-12 rounded-full object-cover shadow-md ring-2 ring-primary" />
            : <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-2xl shadow-md">⚽</span>}
        </button>
        <h1 className="font-title min-w-0 flex-1 truncate text-xl font-bold text-primary sm:text-2xl">{config.theme.clubName}</h1>
        <button onClick={() => setShowVersions(true)} className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground" aria-label="Versions">
          <QrCode className="h-5 w-5" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-3 pb-3 pt-1">
        <div className="space-y-3" style={{ zoom }}>
        {config.categories.map((cat) => {
          const prods = config.products.filter((p) => p.categoryId === cat.id);
          if (!prods.length) return null;
          const item = (p: typeof prods[0]) => ({
            product: p, qty: counts[p.id] || 0,
            onAdd: () => setQty(p.id, (counts[p.id] || 0) + 1),
            onRemove: () => setQty(p.id, (counts[p.id] || 0) - 1),
          });
          const title = (
            <h2 className="mb-1.5 flex items-center gap-2 px-0.5 font-title text-[13px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              <span className="text-sm">{cat.emoji}</span>{cat.name}
              <span className="h-px flex-1 bg-border" />
            </h2>
          );
          if (layout === 'tiles') return (
            <section key={cat.id} className="rounded-3xl bg-muted/40 p-2.5 ring-1 ring-border/60 backdrop-blur-sm">
              {title}
              <div className="grid grid-cols-4 gap-x-1.5 gap-y-1.5 sm:grid-cols-5">
                {prods.map((p) => (
                  <ProductTile key={p.id} {...item(p)} />
                ))}
              </div>
            </section>
          );
          if (layout === 'compact') return (
            <section key={cat.id}>
              {title}
              <div className="flex flex-wrap gap-x-1.5 gap-y-2 pt-1">
                {prods.map((p) => <ProductTile key={p.id} {...item(p)} round />)}
              </div>
            </section>
          );
          if (layout === 'strip') return (
            <section key={cat.id}>
              {title}
              <div className="grid grid-cols-2 gap-1 md:grid-cols-3 xl:grid-cols-4">
                {prods.map((p) => <ProductStrip key={p.id} {...item(p)} />)}
              </div>
            </section>
          );
          return (
            <section key={cat.id}>
              {title}
              <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))' }}>
                {prods.map((p) => <ProductButton key={p.id} {...item(p)} />)}
              </div>
            </section>
          );
        })}
        </div>
      </main>

      <footer className="px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur">
        <PaymentPanel total={total} received={received} setReceived={setReceived} onReset={() => (dirty ? setConfirm(true) : reset())} />
      </footer>

      <AlertDialog open={confirm} onOpenChange={setConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Tout effacer et passer au client suivant ?</AlertDialogTitle></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={reset}>Nouveau client</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <VersionDialog open={showVersions} onOpenChange={setShowVersions} />
    </div>
  );
}
