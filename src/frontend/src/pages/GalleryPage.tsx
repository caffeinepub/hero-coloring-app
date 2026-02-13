import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useVibration } from '../hooks/useVibration';
import { usePremiumUnlocks } from '../hooks/usePremiumUnlocks';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import HeroTile from '../components/gallery/HeroTile';
import UnlockHeroDialog from '../components/premium/UnlockHeroDialog';
import MySavesDialog from '../components/saves/MySavesDialog';
import { heroes } from '../lib/heroes';
import { ArrowLeft, Save } from 'lucide-react';

export default function GalleryPage() {
  const navigate = useNavigate();
  const { vibrate } = useVibration();
  const { isHeroUnlocked } = usePremiumUnlocks();
  const { identity } = useInternetIdentity();
  const [unlockingHeroId, setUnlockingHeroId] = useState<number | null>(null);
  const [showSaves, setShowSaves] = useState(false);

  const handleHeroClick = (heroId: number) => {
    vibrate('light');
    const hero = heroes.find((h) => h.id === heroId);
    if (!hero) return;

    if (hero.isPremium && !isHeroUnlocked(heroId)) {
      setUnlockingHeroId(heroId);
    } else {
      navigate({ to: '/studio/$heroId', params: { heroId: heroId.toString() } });
    }
  };

  const handleUnlockComplete = (heroId: number) => {
    setUnlockingHeroId(null);
    navigate({ to: '/studio/$heroId', params: { heroId: heroId.toString() } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-yellow via-warm-peach to-warm-orange px-4 py-6">
      {/* Header */}
      <div className="mx-auto mb-6 flex max-w-6xl items-center justify-between">
        <button
          onClick={() => {
            vibrate('light');
            navigate({ to: '/' });
          }}
          className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 font-comic font-bold text-gray-800 shadow-lg transition-all hover:scale-105 hover:bg-white active:scale-95"
        >
          <ArrowLeft className="h-5 w-5" />
          BACK
        </button>

        <h2 className="font-comic text-2xl font-black text-hero-red drop-shadow-md sm:text-3xl md:text-4xl">
          Choose Your Hero
        </h2>

        <button
          onClick={() => {
            vibrate('light');
            setShowSaves(true);
          }}
          className="flex items-center gap-2 rounded-full bg-hero-purple px-4 py-2 font-comic font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
        >
          <Save className="h-5 w-5" />
          <span className="hidden sm:inline">MY SAVES</span>
        </button>
      </div>

      {/* Hero Grid */}
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
        {heroes.map((hero) => (
          <HeroTile
            key={hero.id}
            hero={hero}
            isLocked={hero.isPremium && !isHeroUnlocked(hero.id)}
            onClick={() => handleHeroClick(hero.id)}
          />
        ))}
      </div>

      {/* Auth Note */}
      {!identity && (
        <div className="mx-auto mt-8 max-w-2xl rounded-2xl bg-white/90 p-4 text-center shadow-lg backdrop-blur-sm">
          <p className="font-comic text-sm font-bold text-gray-700">
            💡 Sign in to save your artworks and unlock premium heroes!
          </p>
        </div>
      )}

      {/* Unlock Dialog */}
      {unlockingHeroId !== null && (
        <UnlockHeroDialog
          heroId={unlockingHeroId}
          onClose={() => setUnlockingHeroId(null)}
          onUnlockComplete={handleUnlockComplete}
        />
      )}

      {/* My Saves Dialog */}
      <MySavesDialog open={showSaves} onOpenChange={setShowSaves} />
    </div>
  );
}
