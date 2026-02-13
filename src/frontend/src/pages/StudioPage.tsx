import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useVibration } from '../hooks/useVibration';
import { heroes } from '../lib/heroes';
import DrawingSurface from '../components/studio/DrawingSurface';
import BrushControls from '../components/studio/BrushControls';
import ColorPalette from '../components/studio/ColorPalette';
import FinishSaveButton from '../components/studio/FinishSaveButton';
import ConfettiOverlay from '../components/effects/ConfettiOverlay';
import { ArrowLeft } from 'lucide-react';

export default function StudioPage() {
  const { heroId } = useParams({ from: '/studio/$heroId' });
  const navigate = useNavigate();
  const { vibrate } = useVibration();
  const [selectedColor, setSelectedColor] = useState('#FF0000');
  const [strokeWidth, setStrokeWidth] = useState(10);
  const [isEraser, setIsEraser] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const drawingSurfaceRef = useRef<{ clear: () => void; exportImage: () => Promise<Blob> }>(null);

  const hero = heroes.find((h) => h.id === parseInt(heroId));

  useEffect(() => {
    if (!hero) {
      navigate({ to: '/gallery' });
    }
  }, [hero, navigate]);

  if (!hero) return null;

  const handleClear = () => {
    vibrate('medium');
    drawingSurfaceRef.current?.clear();
  };

  const handleEraserToggle = () => {
    vibrate('light');
    setIsEraser(!isEraser);
  };

  const handleColorSelect = (color: string) => {
    vibrate('light');
    setSelectedColor(color);
    setIsEraser(false);
  };

  const handleFinishSave = async () => {
    vibrate('heavy');
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const exportImage = async () => {
    return drawingSurfaceRef.current?.exportImage();
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-warm-peach via-warm-yellow to-warm-orange">
      {/* Header */}
      <div className="flex items-center justify-between bg-white/90 px-4 py-3 shadow-lg backdrop-blur-sm">
        <button
          onClick={() => {
            vibrate('light');
            navigate({ to: '/gallery' });
          }}
          className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 font-comic font-bold text-gray-800 shadow-md transition-all hover:scale-105 hover:bg-gray-200 active:scale-95"
        >
          <ArrowLeft className="h-5 w-5" />
          BACK
        </button>

        <h2 className="font-comic text-xl font-black text-hero-red sm:text-2xl">
          Coloring Time! 🎨
        </h2>

        <div className="w-20" />
      </div>

      {/* Drawing Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 p-4">
          <DrawingSurface
            ref={drawingSurfaceRef}
            templateImage={hero.templatePath}
            color={isEraser ? '#FFFFFF' : selectedColor}
            strokeWidth={strokeWidth}
          />
        </div>

        {/* Controls Area */}
        <div className="rounded-t-3xl bg-white/95 p-4 shadow-2xl backdrop-blur-sm">
          <div className="mx-auto max-w-4xl space-y-4">
            {/* Brush Size */}
            <BrushControls
              strokeWidth={strokeWidth}
              onStrokeWidthChange={setStrokeWidth}
              isEraser={isEraser}
              onEraserToggle={handleEraserToggle}
              onClear={handleClear}
            />

            {/* Color Palette */}
            <ColorPalette selectedColor={selectedColor} onColorSelect={handleColorSelect} />

            {/* Finish & Save */}
            <FinishSaveButton
              heroId={hero.id}
              heroName={hero.name}
              onFinishSave={handleFinishSave}
              exportImage={exportImage}
            />
          </div>
        </div>
      </div>

      {/* Confetti Overlay */}
      {showConfetti && <ConfettiOverlay />}
    </div>
  );
}
