import { useArtworks } from '../../hooks/useArtworks';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { X, Download, Trash2 } from 'lucide-react';

interface MySavesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MySavesDialog({ open, onOpenChange }: MySavesDialogProps) {
  const { identity } = useInternetIdentity();
  const { artworks, isLoading, deleteArtwork } = useArtworks();

  if (!open) return null;

  const handleDownload = (artwork: any) => {
    const url = artwork.coloredImage.getDirectURL();
    const a = document.createElement('a');
    a.href = url;
    a.download = `${artwork.name}.png`;
    a.click();
  };

  const handleDelete = async (artworkId: string) => {
    if (confirm('Delete this artwork?')) {
      await deleteArtwork(artworkId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative max-h-[80vh] w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b-4 border-hero-orange bg-gradient-to-r from-hero-yellow to-hero-orange p-4">
          <h2 className="font-comic text-2xl font-black text-white">My Saved Artworks 🎨</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-full bg-white/20 p-2 transition-all hover:bg-white/30"
          >
            <X className="h-6 w-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(80vh - 80px)' }}>
          {!identity ? (
            <div className="py-12 text-center">
              <p className="font-comic text-lg text-gray-600">Please sign in to view your saved artworks!</p>
            </div>
          ) : isLoading ? (
            <div className="py-12 text-center">
              <p className="font-comic text-lg text-gray-600">Loading...</p>
            </div>
          ) : artworks.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-comic text-lg text-gray-600">No saved artworks yet. Start coloring! 🎨</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {artworks.map((artwork) => (
                <div key={artwork.id} className="group relative overflow-hidden rounded-2xl bg-gray-100 shadow-lg">
                  <img
                    src={artwork.coloredImage.getDirectURL()}
                    alt={artwork.name}
                    className="aspect-square w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => handleDownload(artwork)}
                      className="rounded-full bg-hero-green p-2 text-white transition-all hover:scale-110"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(artwork.id)}
                      className="rounded-full bg-hero-red p-2 text-white transition-all hover:scale-110"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
