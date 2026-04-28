import React, { useState } from 'react';
import { KnoLogo } from './Logos';
import { Loader2 } from 'lucide-react';
import { t } from '../src/i18n';
import { getSystemLanguage } from '../services/geminiService';

interface AuthScreenProps {
  onLogin: () => Promise<void>;
  onBack: () => void;
  initialMode?: 'login' | 'signup';
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, onBack }) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoggingIn || !name.trim()) return;
    setIsLoggingIn(true);
    setError(null);

    try {
      const mockUserId = 'local-user-' + Math.random().toString(36).substring(2, 9);
      
      localStorage.setItem('local_session', JSON.stringify({
          user: {
              id: mockUserId,
              email: `${name.replace(/\s+/g, '').toLowerCase()}@local.kno`,
              displayName: name.trim()
          }
      }));
      
      await onLogin();
    } catch (err: any) {
      console.error("Auth error", err);
      setError(err.message || "An error occurred creating your local profile.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-[150] flex flex-col items-center justify-center font-sans animate-fade-in">
      <div className="w-full max-w-[400px] px-8 flex flex-col items-center">
        <KnoLogo className="w-12 h-12 text-gray-900 mb-6 drop-shadow-sm" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">
          Welcome to Kno
        </h1>
        <p className="text-gray-500 mb-8 text-center text-sm font-medium">
          Enter a display name to create your local offline profile. No data will be sent to the cloud.
        </p>

        <form onSubmit={handleAuth} className="w-full flex flex-col gap-4 mb-4">
          <input
            type="text"
            placeholder={t("Your Name", getSystemLanguage())}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 font-medium"
          />
          
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button 
            type="submit"
            disabled={isLoggingIn || !name.trim()}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isLoggingIn ? (
              <Loader2 className="w-5 h-5 animate-spin text-white" />
            ) : (
              t("Create Local Profile", getSystemLanguage())
            )}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-4 text-center leading-relaxed">
          {t("Your data is 100% private and stored locally on this physical device.", getSystemLanguage())}
        </p>

        <button onClick={onBack} className="mt-8 text-sm text-gray-400 hover:text-gray-600 font-medium transition-colors">
          ← {t('Back', getSystemLanguage())} {t('to', getSystemLanguage())} {t('About Kno', getSystemLanguage())}
        </button>
      </div>
    </div>
  );
};
