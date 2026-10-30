import { Minus, Plus } from 'lucide-react';
import { Product, euro } from '../lib/config';

type Props = { product: Product; qty: number; onAdd: () => void; onRemove: () => void };

/**
 * Représentation « Signal » — dense, horizontale, 2026 :
 * rangée type Linear / Apple, stepper capsule à droite, peu de chrome.
 */
export default function ProductStrip({ product, qty, onAdd, onRemove }: Props) {
  const active = qty > 0;
  return (
    <div
      className={`group flex h-12 items-center gap-2 rounded-xl border px-2 transition-colors ${
        active
          ? 'border-primary/40 bg-primary/10'
          : 'border-transparent bg-card/50 hover:border-border/80 hover:bg-card/80'
      }`}
    >
      <button
        type="button"
        onClick={onAdd}
        className="flex min-w-0 flex-1 items-center gap-2.5 text-left active:opacity-80"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted/80 text-lg leading-none ring-1 ring-border/40">
          {product.imageUrl
            ? <img src={product.imageUrl} alt="" loading="lazy" className="h-full w-full object-cover" />
            : product.emoji}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-medium leading-tight tracking-tight">{product.name}</span>
          <span className="tabular text-[12px] font-semibold text-primary/90">{euro(product.price)}</span>
        </span>
      </button>

      {/* Stepper capsule : discret au repos, net dès qu'il y a une qté */}
      <div
        className={`flex h-8 shrink-0 items-center overflow-hidden rounded-full border transition-all ${
          active
            ? 'border-primary/30 bg-background/80'
            : 'border-border/50 bg-muted/30'
        }`}
      >
        <button
          type="button"
          onClick={onRemove}
          disabled={!active}
          aria-label={`Retirer ${product.name}`}
          className={`flex h-8 w-8 items-center justify-center transition active:scale-90 ${
            active ? 'text-foreground/80' : 'pointer-events-none text-transparent'
          }`}
        >
          <Minus className="h-3.5 w-3.5" strokeWidth={2.5} />
        </button>
        <span
          className={`tabular min-w-[1.25rem] text-center text-[12px] font-bold tracking-tight ${
            active ? 'text-foreground' : 'text-muted-foreground/40'
          }`}
        >
          {qty}
        </span>
        <button
          type="button"
          onClick={onAdd}
          aria-label={`Ajouter ${product.name}`}
          className="flex h-8 w-8 items-center justify-center text-primary transition active:scale-90"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
