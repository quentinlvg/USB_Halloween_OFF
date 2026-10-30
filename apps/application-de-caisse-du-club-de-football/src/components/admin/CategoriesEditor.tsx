import { useState } from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { Input } from '@project/components/ui/input';
import { Button } from '@project/components/ui/button';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@project/components/ui/alert-dialog';
import { useConfig } from '../../lib/ConfigContext';
import { Category, uid } from '../../lib/config';

export default function CategoriesEditor() {
  const { config, update } = useConfig();
  const [toDelete, setToDelete] = useState<Category | null>(null);
  const patch = (id: string, v: Partial<Category>) =>
    update((c) => ({ ...c, categories: c.categories.map((x) => (x.id === id ? { ...x, ...v } : x)) }));
  const move = (i: number, dir: -1 | 1) =>
    update((c) => {
      const j = i + dir;
      if (j < 0 || j >= c.categories.length) return c;
      const list = [...c.categories];
      [list[i], list[j]] = [list[j], list[i]];
      return { ...c, categories: list };
    });
  const remove = (id: string) =>
    update((c) => ({ ...c, categories: c.categories.filter((x) => x.id !== id), products: c.products.filter((p) => p.categoryId !== id) }));

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">L'ordre ci-dessous est l'ordre d'affichage sur l'écran de caisse.</p>
      {config.categories.map((cat, i) => {
        return (
          <div key={cat.id} className="flex flex-wrap items-center gap-1.5 rounded-xl border bg-card p-2">
            <Input value={cat.emoji} onChange={(e) => patch(cat.id, { emoji: e.target.value })} className="w-12 text-center text-lg" aria-label="Icône" />
            <Input value={cat.name} onChange={(e) => patch(cat.id, { name: e.target.value })} className="min-w-[8rem] flex-1" aria-label="Nom" />
            <Button size="icon" variant="ghost" onClick={() => move(i, -1)} aria-label="Monter"><ArrowUp className="h-4 w-4" /></Button>
            <Button size="icon" variant="ghost" onClick={() => move(i, 1)} aria-label="Descendre"><ArrowDown className="h-4 w-4" /></Button>
            <Button size="icon" variant="ghost" className="text-destructive" onClick={() => setToDelete(cat)} aria-label="Supprimer"><Trash2 className="h-4 w-4" /></Button>
          </div>
        );
      })}
      <Button variant="outline" onClick={() => update((c) => ({ ...c, categories: [...c.categories, { id: uid(), name: 'Nouvelle catégorie', emoji: '⭐', color: null }] }))}>
        <Plus className="mr-1 h-4 w-4" />Ajouter une catégorie
      </Button>
      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer « {toDelete?.name} » ?</AlertDialogTitle>
            <AlertDialogDescription>Les produits de cette catégorie seront aussi supprimés.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (toDelete) remove(toDelete.id); setToDelete(null); }}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
