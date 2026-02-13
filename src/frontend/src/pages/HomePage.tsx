import { useNavigate } from '@tanstack/react-router';
import { useVibration } from '../hooks/useVibration';
import { Sparkles, ImageOff } from 'lucide-react';
import { useState } from 'react';

export default function HomePage() {
  const navigate = useNavigate();
  const { vibrate } = useVibration();
  const [logoError, setLogoError] = useState(false);

  const handleStartPainting = () => {
    vibrate('medium');
    navigate({ to: '/gallery' });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-warm-yellow via-warm-orange to-warm-red px-4 py-8">
      <div className="flex flex-col items-center gap-8">
        {/* Logo */}
        {logoError ? (
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white/20 shadow-xl">
            <ImageOff className="h-16 w-16 text-white/60" />
          </div>
        ) : (
          <img
            src="/assets/generated/hero-coloring-logo.dim_512x512.png"
            alt="Hero Coloring"
            className="h-32 w-32 animate-bounce-slow drop-shadow-2xl"
            onError={() => setLogoError(true)}
          />
        )}

        {/* Animated Title */}
        <div className="animate-scale-in">
          <h1 className="hero-title text-center font-comic text-6xl font-black leading-tight text-hero-red drop-shadow-hero sm:text-7xl md:text-8xl">
            HERO
            <br />
            COLORING
          </h1>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStartPainting}
          className="btn-primary group relative overflow-hidden rounded-full bg-hero-green px-12 py-6 text-2xl font-black text-white shadow-2xl transition-all hover:scale-110 hover:shadow-hero active:scale-95 sm:px-16 sm:py-8 sm:text-3xl"
        >
          <span className="relative z-10 flex items-center gap-3">
            <Sparkles className="h-8 w-8" />
            START PAINTING
            <Sparkles className="h-8 w-8" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        </button>

        {/* Level Badge */}
        <div className="animate-fade-in rounded-2xl bg-black/30 px-6 py-3 backdrop-blur-sm">
          <p className="font-comic text-lg font-bold text-white sm:text-xl">
            🎨 LEVEL 1: ROOKIE HERO 🎨
          </p>
        </div>
      </div>
    </div>
  );
}
