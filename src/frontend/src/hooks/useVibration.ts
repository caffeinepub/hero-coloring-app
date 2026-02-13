import { useCallback } from 'react';

type VibrationType = 'light' | 'medium' | 'heavy' | 'selection';

const vibrationPatterns: Record<VibrationType, number | number[]> = {
  light: 10,
  medium: 20,
  heavy: 50,
  selection: [5, 10],
};

export function useVibration() {
  const vibrate = useCallback((type: VibrationType = 'light') => {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(vibrationPatterns[type]);
      } catch (error) {
        // Silently fail if vibration is not supported
      }
    }
  }, []);

  return { vibrate };
}
