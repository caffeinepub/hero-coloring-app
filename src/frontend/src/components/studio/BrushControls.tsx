import { useVibration } from '../../hooks/useVibration';
import { Eraser, Trash2 } from 'lucide-react';

interface BrushControlsProps {
  strokeWidth: number;
  onStrokeWidthChange: (width: number) => void;
  isEraser: boolean;
  onEraserToggle: () => void;
  onClear: () => void;
}

export default function BrushControls({
  strokeWidth,
  onStrokeWidthChange,
  isEraser,
  onEraserToggle,
  onClear,
}: BrushControlsProps) {
  const { vibrate } = useVibration();

  return (
    <div className="flex items-center gap-4">
      {/* Brush Size Label */}
      <div className="flex-shrink-0">
        <p className="font-comic text-sm font-bold text-gray-700">Brush Size:</p>
        <p className="font-comic text-xs text-gray-500">{Math.round(strokeWidth)}px</p>
      </div>

      {/* Slider */}
      <input
        type="range"
        min="2"
        max="30"
        value={strokeWidth}
        onChange={(e) => onStrokeWidthChange(Number(e.target.value))}
        className="flex-1 accent-hero-orange"
      />

      {/* Eraser Button */}
      <button
        onClick={onEraserToggle}
        className={`rounded-full p-3 transition-all hover:scale-110 active:scale-95 ${
          isEraser ? 'bg-hero-purple text-white' : 'bg-gray-200 text-gray-700'
        }`}
      >
        <Eraser className="h-6 w-6" />
      </button>

      {/* Clear Button */}
      <button
        onClick={onClear}
        className="rounded-full bg-hero-red p-3 text-white transition-all hover:scale-110 active:scale-95"
      >
        <Trash2 className="h-6 w-6" />
      </button>
    </div>
  );
}
