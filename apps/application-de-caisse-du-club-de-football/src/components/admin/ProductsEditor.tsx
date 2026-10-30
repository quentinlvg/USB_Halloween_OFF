import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { Input } from '@project/components/ui/input';
import { Button } from '@project/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@project/components/ui/select';
import { useConfig } from '../../lib/ConfigContext';
import { Product, uid } from '../../lib/config';
import ProductImage from './ProductImage';

export default function ProductsEditor() {
  const { config, update } = useConfig();
  const patch = (id: string, v: Partial<Product>) =>
    update((c) => ({ ...c, products: c.products.map((p) => (p.id === id ? { ...p, ...v } : p)) }));
  const remove = (id: string) => update((c) => ({ ...c, products: c.products.filter((p) => p.id !== id) }));
  const move = (id: string, dir: -1 | 1) =>
    update((c) => {
      const list = [...c.products];
      const i = list.findIndex((p) => p.id === id);
      let j = i + dir;
      while (j >= 0 && j < list.length && list[j].categoryId !== list[i].categoryId) j += dir;
      if (j < 0 || j >= list.length) return c;
      [list[i], list[j]] = [list[j], list[i]];
      return { ...c, products: list };
    });
  const add = (categoryId: string) =>
    update((c) => ({ ...c, products: [...c.products, { id: uid(), name: 'Nouveau produit', price: 200, emoji: '🍹', categoryId }] }));

  return (
    <div className="space-y-4">
      {config.categories.map((cat) => (
        <div key={cat.id} className="rounded-2xl border bg-card p-3">
          <h3 className="mb-2 font-semibold">{cat.emoji} {cat.name}</h3>
          <div className="space-y-2">
            {config.products.filter((p) => p.categoryId === cat.id).map((p) => (
              <div key={p.id} className="flex flex-wrap items-center gap-1.5 rounded-xl bg-muted p-2">
                <ProductImage url={p.imageUrl ?? ''} emoji={p.emoji} productName={p.name} onChange={(url) => patch(p.id, { imageUrl: url })} />
                <Input value={p.emoji} onChange={(e) => patch(p.id, { emoji: e.target.value })} className="w-12 text-center text-lg" aria-label="Icône" />
                <Input value={p.name} onChange={(e) => patch(p.id, { name: e.target.value })} className="min-w-[8rem] flex-1" aria-label="Nom" />
                <div className="flex items-center gap-1">
                  <Input type="number" step="0.1" min="0" value={p.price / 100} onChange={(e) => patch(p.id, { price: Math.max(0, Math.round(parseFloat(e.target.value || '0') * 100)) })} className="w-20 text-right" aria-label="Prix" />
                  <span className="text-sm">€</span>
                </div>
                <Select value={p.categoryId} onValueChange={(v) => patch(p.id, { categoryId: v })}>
                  <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                  <SelectContent>{config.categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.emoji} {c.name}</SelectItem>)}</SelectContent>
                </Select>
                <Button size="icon" variant="ghost" onClick={() => move(p.id, -1)} aria-label="Monter"><ArrowUp className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => move(p.id, 1)} aria-label="Descendre"><ArrowDown className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" className="text-destructive" onClick={() => remove(p.id)} aria-label="Supprimer"><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="mt-2" onClick={() => add(cat.id)}><Plus className="mr-1 h-4 w-4" />Ajouter un produit</Button>
        </div>
      ))}
    </div>
  );
}
