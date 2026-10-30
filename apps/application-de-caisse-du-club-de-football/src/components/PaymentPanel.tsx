import { useRef, useState } from 'react';
import { Check, RotateCcw } from 'lucide-react';
import { euro, parseEuro } from '../lib/config';

type Props = { total: number; received: string; setReceived: (s: string) => void; onReset: () => void };

const BILLS = [5, 10, 20, 50];

export default function PaymentPanel({ total, received, setReceived, onReset }: Props) {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const rec = parseEuro(received);
  const change = rec - total;
  const box = 'flex flex-col items-center justify-center rounded-2xl px-2 py-2 text-center shadow-md';
  const label = 'text-[10px] font-medium uppercase tracking-[0.2em] opacity-75';
  const addBill = (b: number) => setReceived(String((rec + b * 100) / 100).replace('.', ','));

  return (
    <div className="space-y-2">
      {editing && (
      <div className="grid grid-cols-[repeat(4,1fr)_auto] gap-1.5">
        {BILLS.map((b) => (
          <button key={b} onMouseDown={(e) => e.preventDefault()} onClick={() => addBill(b)} className="tabular h-11 rounded-xl border-2 border-primary/40 bg-card text-lg font-semibold active:scale-95 active:bg-primary active:text-primary-foreground">
            +{b} €
          </button>
        ))}
        <button onMouseDown={(e) => e.preventDefault()} onClick={() => inputRef.current?.blur()} aria-label="Valider" className="flex h-11 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground active:scale-95">
          <Check className="h-5 w-5" strokeWidth={3} />
        </button>
      </div>
      )}
      <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-1.5">
        <div className={`${box} bg-primary text-primary-foreground`}>
          <div className={label}>Total</div>
          <div className="tabular text-2xl font-semibold leading-tight sm:text-4xl">{euro(total)}</div>
        </div>
        <label className={`${box} cursor-text border-2 border-primary/50 bg-card focus-within:border-primary`}>
          <span className={label}>Reçu</span>
          <span className="flex items-baseline justify-center">
            <input
              inputMode="decimal"
              value={received}
              onChange={(e) => setReceived(e.target.value.replace(/[^0-9.,]/g, ''))}
              ref={inputRef}
              onFocus={(e) => { e.target.select(); setEditing(true); }}
              onBlur={() => setEditing(false)}
              placeholder="0"
              className="tabular w-full min-w-0 bg-transparent text-center text-2xl font-semibold leading-tight outline-none placeholder:text-muted-foreground/50 sm:text-4xl"
            />
            <span className="text-base font-medium">€</span>
          </span>
        </label>
        <div className={`${box} ${!rec ? 'bg-muted text-muted-foreground' : change >= 0 ? 'bg-accent text-accent-foreground' : 'bg-destructive text-destructive-foreground'}`}>
          <div className={label}>{rec && change < 0 ? 'Il manque' : 'À rendre'}</div>
          <div className="tabular text-2xl font-semibold leading-tight sm:text-4xl">{rec ? euro(Math.abs(change)) : '—'}</div>
        </div>
        <button onClick={onReset} aria-label="Réinitialiser l'écran" className="flex w-12 flex-col items-center justify-center gap-0.5 rounded-2xl bg-foreground text-background shadow-md active:scale-95">
          <RotateCcw className="h-5 w-5" strokeWidth={2.5} />
          <span className="text-[9px] font-semibold uppercase">Reset</span>
        </button>
      </div>
    </div>
  );
}
