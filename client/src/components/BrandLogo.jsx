import { Shield } from 'lucide-react';

/**
 * BrandLogo — Shared logo component used in Navbar and auth pages.
 * @param {'nav' | 'hero'} size — "nav" for compact navbar, "hero" for large auth page header
 */
export default function BrandLogo({ size = 'nav' }) {
  const isHero = size === 'hero';

  return (
    <div className="flex items-center gap-2 select-none">
      <div
        className="flex items-center justify-center rounded-xl"
        style={{
          width: isHero ? 48 : 36,
          height: isHero ? 48 : 36,
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)',
        }}
      >
        <Shield size={isHero ? 28 : 20} className="text-white" strokeWidth={2.5} />
      </div>
      <span
        className="font-extrabold tracking-tight"
        style={{
          fontSize: isHero ? '2rem' : '1.25rem',
          background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        InplaSheild
      </span>
    </div>
  );
}
