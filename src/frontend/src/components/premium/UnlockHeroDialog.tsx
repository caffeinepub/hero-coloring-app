import { useState, useEffect } from 'react';
import { usePremiumUnlocks } from '../../hooks/usePremiumUnlocks';
import { useVibration } from '../../hooks/useVibration';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { X, Play, CheckCircle } from 'lucide-react';

interface UnlockHeroDialogProps {
  heroId: number;
  onClose: () => void;
  onUnlockComplete: (heroId: number) => void;
}

export default function UnlockHeroDialog({ heroId, onClose, onUnlockComplete }: UnlockHeroDialogProps) {
  const [isWatching, setIsWatching] = useState(false);
  const [progress, setProgress] = useState(0);
  const { unlockHero } = usePremiumUnlocks();
  const { vibrate } = useVibration();
  const { identity } = useInternetIdentity();

  useEffect(() => {
    if (isWatching) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            handleUnlockComplete();
            return 100;
          }
          return prev + 2;
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [isWatching]);

  const handleUnlockComplete = () => {
    vibrate('heavy');
    unlockHero(heroId);
    setTimeout(() => {
      onUnlockComplete(heroId);
    }, 500);
  };

  const handleWatchAd = () => {
    if (!identity) {
      alert('Please sign in to unlock premium heroes!');
      return;
    }
    vibrate('medium');
    setIsWatching(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md animate-scale-in rounded-3xl bg-white p-6 shadow-2xl">
        {/* Close Button */}
        {!isWatching && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-gray-200 p-2 transition-all hover:bg-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {!isWatching ? (
          <>
            {/* Title */}
            <h3 className="mb-4 font-comic text-3xl font-black text-hero-red">Unlock Secret Hero?</h3>

            {/* Description */}
            <p className="mb-6 font-comic text-lg text-gray-700">
              Watch a quick video to unlock this Hero Gift! 🎁
            </p>

            {/* Watch Ad Button */}
            <button
              onClick={handleWatchAd}
              className="flex w-full items-center justify-center gap-3 rounded-full bg-hero-green px-8 py-4 font-comic text-xl font-black text-white shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              <Play className="h-6 w-6" />
              WATCH AD
            </button>

            {!identity && (
              <p className="mt-4 text-center font-comic text-sm text-gray-500">
                💡 Sign in required to unlock premium heroes
              </p>
            )}
          </>
        ) : (
          <>
            {/* Watching Progress */}
            <div className="text-center">
              {progress < 100 ? (
                <>
                  <h3 className="mb-4 font-comic text-2xl font-black text-hero-red">Watching Ad...</h3>
                  <div className="mb-4 h-4 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full bg-gradient-to-r from-hero-green to-hero-yellow transition-all duration-100"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="font-comic text-lg text-gray-600">{Math.round(progress)}%</p>
                </>
              ) : (
                <>
                  <CheckCircle className="mx-auto mb-4 h-16 w-16 text-hero-green" />
                  <h3 className="mb-2 font-comic text-2xl font-black text-hero-green">Hero Unlocked!</h3>
                  <p className="font-comic text-lg text-gray-600">Opening studio...</p>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
