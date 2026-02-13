import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { LogIn, LogOut } from 'lucide-react';

export default function AuthButton() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <button
      onClick={handleAuth}
      disabled={disabled}
      className={`flex items-center gap-2 rounded-full px-4 py-2 font-comic font-bold shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 ${
        isAuthenticated
          ? 'bg-white text-gray-800 hover:bg-gray-100'
          : 'bg-hero-green text-white hover:bg-hero-green/90'
      }`}
    >
      {disabled ? (
        'Loading...'
      ) : isAuthenticated ? (
        <>
          <LogOut className="h-4 w-4" />
          LOGOUT
        </>
      ) : (
        <>
          <LogIn className="h-4 w-4" />
          LOGIN
        </>
      )}
    </button>
  );
}
