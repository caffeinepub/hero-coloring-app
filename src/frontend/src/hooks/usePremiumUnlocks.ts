import { useState, useEffect } from 'react';
import { useInternetIdentity } from './useInternetIdentity';

const STORAGE_KEY = 'hero_coloring_unlocked_heroes';

export function usePremiumUnlocks() {
  const { identity } = useInternetIdentity();
  const [unlockedHeroes, setUnlockedHeroes] = useState<Set<number>>(new Set());

  // Load unlocked heroes from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setUnlockedHeroes(new Set(parsed));
      }
    } catch (error) {
      console.error('Failed to load unlocked heroes:', error);
    }
  }, []);

  // Save to localStorage whenever unlocked heroes change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(unlockedHeroes)));
    } catch (error) {
      console.error('Failed to save unlocked heroes:', error);
    }
  }, [unlockedHeroes]);

  // Clear unlocks when user logs out
  useEffect(() => {
    if (!identity) {
      setUnlockedHeroes(new Set());
    }
  }, [identity]);

  const unlockHero = (heroId: number) => {
    setUnlockedHeroes((prev) => new Set([...prev, heroId]));
  };

  const isHeroUnlocked = (heroId: number) => {
    return unlockedHeroes.has(heroId);
  };

  return {
    unlockHero,
    isHeroUnlocked,
    unlockedHeroes: Array.from(unlockedHeroes),
  };
}
