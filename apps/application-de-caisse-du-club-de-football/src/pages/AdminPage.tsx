import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@project/components/ui/tabs';
import { useConfig } from '../lib/ConfigContext';
import BuvetteEditor from '../components/admin/BuvetteEditor';
import ProductsEditor from '../components/admin/ProductsEditor';
import CategoriesEditor from '../components/admin/CategoriesEditor';
import ThemeEditor from '../components/admin/ThemeEditor';

export default function AdminPage() {
  const { setAdminMode } = useConfig();
  useEffect(() => { setAdminMode(true); return () => setAdminMode(false); }, [setAdminMode]);

  return (
    <div className="mx-auto min-h-[100dvh] max-w-3xl bg-background px-4 py-4">
      <header className="mb-4 flex items-center gap-3">
        <Link to="/" className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary" aria-label="Retour à la caisse"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="flex-1 text-2xl font-semibold">Administration</h1>
      </header>
      <Tabs defaultValue="buvette">
        <TabsList className="mb-4 grid w-full grid-cols-4">
          <TabsTrigger value="buvette">Buvette</TabsTrigger>
          <TabsTrigger value="produits">Produits</TabsTrigger>
          <TabsTrigger value="categories">Catégories</TabsTrigger>
          <TabsTrigger value="theme">Thème</TabsTrigger>
        </TabsList>
        <TabsContent value="buvette"><BuvetteEditor /></TabsContent>
        <TabsContent value="produits"><ProductsEditor /></TabsContent>
        <TabsContent value="categories"><CategoriesEditor /></TabsContent>
        <TabsContent value="theme"><ThemeEditor /></TabsContent>
      </Tabs>
    </div>
  );
}
