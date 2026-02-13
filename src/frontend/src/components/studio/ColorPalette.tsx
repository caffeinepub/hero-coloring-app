import { useVibration } from '../../hooks/useVibration';

interface ColorPaletteProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

const colors = [
  { name: 'Red', value: '#FF0000' },
  { name: 'Blue', value: '#0000FF' },
  { name: 'Yellow', value: '#FFFF00' },
  { name: 'Green', value: '#00FF00' },
  { name: 'Orange', value: '#FF8800' },
  { name: 'Purple', value: '#8800FF' },
  { name: 'Black', value: '#000000' },
  { name: 'Pink', value: '#FF69B4' },
  { name: 'Brown', value: '#8B4513' },
];

export default function ColorPalette({ selectedColor, onColorSelect }: ColorPaletteProps) {
  const { vibrate } = useVibration();

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {colors.map((color) => (
        <button
          key={color.value}
          onClick={() => {
            vibrate('light');
            onColorSelect(color.value);
          }}
          className={`h-12 w-12 rounded-full shadow-lg transition-all hover:scale-110 active:scale-95 ${
            selectedColor === color.value ? 'ring-4 ring-white ring-offset-2 ring-offset-gray-300' : ''
          }`}
          style={{ backgroundColor: color.value }}
          title={color.name}
        />
      ))}
    </div>
  );
}
