import { useState } from 'react';
import { useVibration } from '../../hooks/useVibration';
import { useArtworks } from '../../hooks/useArtworks';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { CheckCircle, Download, Loader2 } from 'lucide-react';

interface FinishSaveButtonProps {
  heroId: number;
  heroName: string;
  onFinishSave: () => void;
  exportImage: () => Promise<Blob | undefined>;
}

export default function FinishSaveButton({ heroId, heroName, onFinishSave, exportImage }: FinishSaveButtonProps) {
  const { vibrate } = useVibration();
  const { createArtwork } = useArtworks();
  const { identity } = useInternetIdentity();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFinishSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      vibrate('heavy');

      const blob = await exportImage();
      if (!blob) {
        throw new Error('Failed to export image. Please try again.');
      }

      onFinishSave();

      if (identity) {
        // Save to backend
        const artworkName = `${heroName}_${Date.now()}`;
        await createArtwork(artworkName, blob, BigInt(heroId));
      } else {
        // Download locally
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${heroName}_${Date.now()}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Save error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to save artwork. Please try again.';
      setError(errorMessage);
      vibrate('heavy');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleFinishSave}
        disabled={isSaving}
        className="flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-hero-green to-hero-blue px-8 py-4 font-comic text-xl font-black text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSaving ? (
          <>
            <Loader2 className="h-6 w-6 animate-spin" />
            SAVING...
          </>
        ) : identity ? (
          <>
            <CheckCircle className="h-6 w-6" />
            FINISH & SAVE
          </>
        ) : (
          <>
            <Download className="h-6 w-6" />
            FINISH & DOWNLOAD
          </>
        )}
      </button>
      {error && (
        <div className="rounded-lg bg-red-100 px-4 py-2 text-center text-sm font-bold text-red-800">
          {error}
        </div>
      )}
    </div>
  );
}
