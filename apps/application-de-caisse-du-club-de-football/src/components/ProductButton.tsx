import { Minus, Plus } from 'lucide-react';
import { Product, euro } from '../lib/config';

type Props = { product: Product; qty: number; onAdd: () => void; onRemove: () => void };

export default function ProductButton({ product, qty, onAdd, onRemove }: Props) {
  const active = qty > 0;
  return (
    <div className={`flex h-[58px] min-w-0 items-stretch overflow-hidden rounded-2xl shadow-sm ring-1 backdrop-blur-sm transition-all ${active ? 'bg-primary/15 ring-2 ring-primary' : 'bg-card/90 ring-border'}`}>
      {active && (
        <button onClick={onRemove} aria-label={`Retirer ${product.name}`}
          className="flex w-7 shrink-0 items-center justify-center bg-muted/70 active:bg-muted">
          <Minus className="h-4 w-4" strokeWidth={2.75} />
        </button>
      )}
      <button onClick={onAdd} className="flex min-w-0 flex-1 items-center gap-1.5 pl-1.5 pr-1 text-left active:opacity-70">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-xl leading-none">
          {product.imageUrl ? <img src={product.imageUrl} alt="" loading="lazy" className="h-full w-full object-cover" /> : product.emoji}
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="line-clamp-2 text-[12px] font-medium leading-[1.15] sm:text-sm">{product.name}</span>
          <span className="mt-0.5 flex items-center gap-1.5">
            <span className="tabular text-[13px] font-semibold text-primary sm:text-sm">{euro(product.price)}</span>
            {active && <span className="tabular rounded-full bg-primary px-1.5 text-[11px] font-bold leading-[18px] text-primary-foreground">×{qty}</span>}
          </span>
        </span>
      </button>
      <button onClick={onAdd} aria-label={`Ajouter ${product.name}`}
        className="flex w-7 shrink-0 items-center justify-center bg-primary text-primary-foreground active:opacity-80">
        <Plus className="h-4 w-4" strokeWidth={2.75} />
      </button>
    </div>
  );
}
