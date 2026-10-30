import { Minus, Plus } from 'lucide-react';
import { Product, euro } from '../lib/config';

type Props = { product: Product; qty: number; onAdd: () => void; onRemove: () => void; round?: boolean };

function Visual({ product, className }: { product: Product; className: string }) {
  return (
    <span className={`flex items-center justify-center overflow-hidden bg-muted leading-none ${className}`}>
      {product.imageUrl ? <img src={product.imageUrl} alt="" loading="lazy" className="h-full w-full object-cover" /> : product.emoji}
    </span>
  );
}

function Badges({ qty, name, onRemove }: { qty: number; name: string; onRemove: () => void }) {
  if (!qty) return null;
  return (
    <>
      <span className="tabular absolute -right-1 -top-1 z-10 min-w-[22px] rounded-full bg-primary px-1.5 text-center text-xs font-bold leading-[22px] text-primary-foreground shadow">{qty}</span>
      <button onClick={(e) => { e.stopPropagation(); onRemove(); }} aria-label={`Retirer ${name}`}
        className="absolute -left-1 -top-1 z-10 flex h-[26px] w-[26px] items-center justify-center rounded-full bg-foreground text-background shadow active:scale-90">
        <Minus className="h-4 w-4" strokeWidth={3} />
      </button>
    </>
  );
}

/** Tuile rectangulaire, pastille ronde (compact), ou les deux. */
export default function ProductTile({ product, qty, onAdd, onRemove, round }: Props) {
  const active = qty > 0;
  if (round) {
    return (
      <div className="relative flex w-[72px] flex-col items-center">
        <Badges qty={qty} name={product.name} onRemove={onRemove} />
        <button onClick={onAdd} className="flex flex-col items-center active:scale-95">
          <Visual product={product} className={`h-14 w-14 rounded-full text-2xl shadow-sm ring-2 transition ${active ? 'ring-primary' : 'ring-border'}`} />
          <span className="mt-1 line-clamp-1 w-full text-center text-[11px] font-medium leading-tight">{product.name}</span>
          <span className="tabular text-[11px] font-semibold text-primary">{euro(product.price)}</span>
        </button>
      </div>
    );
  }

  // Tuile rectangulaire basse : − / contenu / + sur les côtés
  return (
    <div className={`flex min-h-[52px] items-stretch overflow-hidden rounded-md shadow-sm ring-1 transition ${active ? 'bg-primary/15 ring-primary' : 'bg-card/90 ring-border'}`}>
      <button
        type="button"
        onClick={onRemove}
        disabled={!active}
        aria-label={`Retirer ${product.name}`}
        className={`flex w-6 shrink-0 items-center justify-center transition active:scale-95 ${active ? 'text-foreground/70 hover:bg-muted/80' : 'pointer-events-none text-transparent'}`}
      >
        <Minus className="h-3.5 w-3.5" strokeWidth={2.5} />
      </button>
      <button type="button" onClick={onAdd} className="flex min-w-0 flex-1 flex-col items-center justify-center px-0.5 py-1 active:opacity-80">
        <Visual product={product} className="h-7 w-full max-w-[2.75rem] rounded text-sm" />
        <span className="mt-0.5 line-clamp-1 w-full text-center text-[10px] font-medium leading-tight">{product.name}</span>
        <span className="tabular text-[10px] font-semibold leading-tight text-primary">
          {euro(product.price)}
          {active ? <span className="ml-0.5 text-foreground/70">×{qty}</span> : null}
        </span>
      </button>
      <button
        type="button"
        onClick={onAdd}
        aria-label={`Ajouter ${product.name}`}
        className={`flex w-6 shrink-0 items-center justify-center transition active:scale-95 ${active ? 'bg-primary/20 text-primary' : 'text-muted-foreground/50 hover:bg-muted/50 hover:text-foreground'}`}
      >
        <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
      </button>
    </div>
  );
}
