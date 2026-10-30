import { X } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@project/components/ui/input';
import { Button } from '@project/components/ui/button';

type Props = { url: string; emoji: string; productName: string; onChange: (url: string) => void };

export default function ProductImage({ url, emoji, productName, onChange }: Props) {
  const [showInput, setShowInput] = useState(false);
  const [urlInput, setUrlInput] = useState(url);

  const suggestPath = (name: string) => {
    const slug = name.toLowerCase()
      .replace(/[àâä]/g, 'a')
      .replace(/[éèêë]/g, 'e')
      .replace(/[îï]/g, 'i')
      .replace(/[ôö]/g, 'o')
      .replace(/[ùûü]/g, 'u')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    return `/images/${slug}.webp`;
  };

  if (showInput) {
    return (
      <div className="flex gap-1">
        <Input
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="/images/..."
          className="h-11 w-40 text-xs"
        />
        <Button size="sm" onClick={() => { onChange(urlInput); setShowInput(false); }}>OK</Button>
        <Button size="sm" variant="ghost" onClick={() => setShowInput(false)}>✕</Button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => {
          setUrlInput(suggestPath(productName));
          setShowInput(true);
        }}
        className="flex h-11 w-11 cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed bg-card text-xl"
        title="Changer l'image"
      >
        {url ? <img src={url} alt="" className="h-full w-full object-cover" /> : emoji}
      </button>
      {url && (
        <button onClick={() => onChange('')} aria-label="Retirer l'image" className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-background">
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
