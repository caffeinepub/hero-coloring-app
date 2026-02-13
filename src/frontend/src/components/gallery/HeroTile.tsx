import { Lock, ImageOff } from 'lucide-react';
import { useState } from 'react';

interface Hero {
  id: number;
  name: string;
  templatePath: string;
  isPremium: boolean;
}

interface HeroTileProps {
  hero: Hero;
  isLocked: boolean;
  onClick: () => void;
}

export default function HeroTile({ hero, isLocked, onClick }: HeroTileProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95 ${
        isLocked ? 'border-4 border-gray-400' : 'border-4 border-hero-orange'
      }`}
    >
      {/* Hero Image */}
      <div className="aspect-square p-4">
        {imageError ? (
          <div className="flex h-full w-full items-center justify-center bg-gray-100">
            <ImageOff className="h-12 w-12 text-gray-400" />
          </div>
        ) : (
          <img
            src={hero.templatePath}
            alt={hero.name}
            className={`h-full w-full object-contain transition-all ${
              isLocked ? 'opacity-30 grayscale' : 'opacity-40'
            }`}
            onError={() => setImageError(true)}
          />
        )}
      </div>

      {/* Lock Overlay */}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="rounded-full bg-gray-800 p-4 shadow-lg">
            <Lock className="h-8 w-8 text-white sm:h-10 sm:w-10" />
          </div>
        </div>
      )}

      {/* Hero Name */}
      <div className="bg-gradient-to-r from-hero-red to-hero-orange p-3">
        <p className="font-comic text-sm font-black text-white sm:text-base">{hero.name}</p>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-hero-yellow/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
    </button>
  );
}
