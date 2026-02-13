import { Outlet } from '@tanstack/react-router';
import AuthButton from '../auth/AuthButton';
import { Heart } from 'lucide-react';

export default function AppLayout() {
  return (
    <div className="relative min-h-screen">
      {/* Auth Button - Fixed Top Right */}
      <div className="fixed right-4 top-4 z-50">
        <AuthButton />
      </div>

      {/* Main Content */}
      <Outlet />

      {/* Footer */}
      <footer className="bg-gradient-to-r from-hero-red via-hero-orange to-hero-yellow py-4 text-center shadow-lg">
        <p className="font-comic text-sm font-bold text-white">
          Built with <Heart className="inline h-4 w-4 fill-white text-white" /> using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== 'undefined' ? window.location.hostname : 'hero-coloring-app'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline transition-colors hover:text-yellow-200"
          >
            caffeine.ai
          </a>
        </p>
        <p className="mt-1 font-comic text-xs text-white/80">© {new Date().getFullYear()} Hero Coloring App</p>
      </footer>
    </div>
  );
}
