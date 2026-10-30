import { useConfig } from '../lib/ConfigContext';
import { themeEffect } from '../lib/config';

const Web = ({ className }: { className: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="0.8">
    {[0, 15, 30, 45, 60, 75, 90].map((a) => (
      <line key={a} x1="0" y1="0" x2={100 * Math.cos((a * Math.PI) / 180)} y2={100 * Math.sin((a * Math.PI) / 180)} />
    ))}
    {[18, 34, 52, 72, 94].map((r) => (
      <path key={r} d={[0, 15, 30, 45, 60, 75, 90].map((a, i) => `${i ? 'Q' + (r * 0.92 * Math.cos(((a - 7.5) * Math.PI) / 180)).toFixed(1) + ' ' + (r * 0.92 * Math.sin(((a - 7.5) * Math.PI) / 180)).toFixed(1) + ' ' : 'M'}${(r * Math.cos((a * Math.PI) / 180)).toFixed(1)} ${(r * Math.sin((a * Math.PI) / 180)).toFixed(1)}`).join(' ')} />
    ))}
  </svg>
);

const Bat = ({ className, style }: { className: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 64 28" className={className} style={style} fill="currentColor">
    <path d="M32 8c2-4 3-6 3-6s1 3 1 5c4-2 10-1 14 2 3-3 8-4 14-2-5 2-7 6-7 10-3-2-7-2-9 1-2-2-6-2-8 1-2 2-5 4-8 7-3-3-6-5-8-7-2-3-6-3-8-1-2-3-6-3-9-1 0-4-2-8-7-10 6-2 11-1 14 2 4-3 10-4 14-2 0-2 1-5 1-5s1 2 3 6z" />
  </svg>
);

export default function Decorations() {
  const { config } = useConfig();
  const { theme } = config;
  const decor = themeEffect(theme);
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {theme.bgImageUrl && (
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${theme.bgImageUrl})`, opacity: theme.bgImageOpacity }} />
      )}
      <div className="absolute inset-0" style={{ opacity: theme.effectOpacity ?? 1 }}>
      {decor === 'halloween' && (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(0_0%_0%/0.35),transparent_60%)]" />
          <div className="absolute left-1/2 top-6 h-28 w-28 -translate-x-1/2 rounded-full bg-[hsl(0_0%_95%/0.08)] blur-[2px] shadow-[0_0_80px_30px_hsl(0_0%_100%/0.05)]" />
          <Web className="absolute left-0 top-0 h-40 w-40 text-[hsl(0_0%_88%/0.28)]" />
          <Web className="absolute right-0 top-0 h-40 w-40 -scale-x-100 text-[hsl(0_0%_88%/0.28)]" />
          <Web className="absolute bottom-0 left-0 h-32 w-32 -scale-y-100 text-[hsl(0_0%_88%/0.2)]" />
          <Web className="absolute bottom-0 right-0 h-32 w-32 -scale-x-100 -scale-y-100 text-[hsl(0_0%_88%/0.2)]" />
          <Bat className="bat absolute left-[12%] top-[14%] w-12 text-[hsl(0_0%_4%/0.85)]" />
          <Bat className="bat absolute right-[18%] top-[22%] w-9 text-[hsl(0_0%_4%/0.85)]" style={{ animationDelay: '-3s' }} />
          <Bat className="bat absolute left-[55%] top-[8%] w-7 text-[hsl(0_0%_4%/0.85)]" style={{ animationDelay: '-6s' }} />
          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-4xl opacity-25 select-none">
            <span>🕸️</span><span>🦇</span><span>🕸️</span><span>🦇</span><span>🕸️</span>
          </div>
        </>
      )}
      {decor === 'christmas' && (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(0_70%_40%/0.25),transparent_60%)]" />
          {Array.from({ length: 18 }).map((_, i) => (
            <span key={i} className="snow absolute text-white/40" style={{ left: `${(i * 37) % 100}%`, animationDelay: `-${i * 1.3}s`, fontSize: 10 + (i % 4) * 5 }}>❄</span>
          ))}
        </>
      )}
      {decor === 'fluo' && (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,hsl(312_100%_55%/0.22),transparent_40%),radial-gradient(circle_at_85%_75%,hsl(184_100%_50%/0.18),transparent_40%),radial-gradient(circle_at_60%_10%,hsl(80_100%_50%/0.12),transparent_35%)]" />
      )}
      {decor === 'summer' && (
        <>
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(circle,hsl(45_100%_60%/0.55),transparent_70%)]" />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-[linear-gradient(to_top,hsl(188_85%_50%/0.15),transparent)]" />
        </>
      )}
      </div>
    </div>
  );
}
