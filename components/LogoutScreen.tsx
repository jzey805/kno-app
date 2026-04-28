import React, { useEffect, useState } from 'react';
import { KnoLogo } from './Logos';
import { Loader2, CheckCircle2 } from 'lucide-react';

interface LogoutScreenProps {
  onComplete: () => void;
}

export const LogoutScreen: React.FC<LogoutScreenProps> = ({ onComplete }) => {
  const [status, setStatus] = useState<'saving' | 'saved' | 'logging_out'>('saving');

  useEffect(() => {
    const processLogout = async () => {
      // 1. Simulate saving data (data is already saved to localStorage via useEffect in App.tsx, but we show this for UX)
      setStatus('saving');
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // 2. Show saved confirmation
      setStatus('saved');
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 3. Show logging out
      setStatus('logging_out');
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // 4. Complete
      onComplete();
    };

    processLogout();
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-white z-[200] flex flex-col items-center justify-center font-sans animate-fade-in">
      <div className="flex flex-col items-center">
        <div className="relative mb-8">
          <KnoLogo className="w-16 h-16 text-black animate-pulse" />
          {status === 'saved' && (
            <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-0.5 animate-scale-in">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            </div>
          )}
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">
          {status === 'saving' && 'Saving your workspace...'}
          {status === 'saved' && 'All items saved securely.'}
          {status === 'logging_out' && 'Signing out...'}
        </h2>
        
        <div className="h-6 flex items-center justify-center">
          {status !== 'saved' && (
            <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
          )}
        </div>
      </div>
    </div>
  );
};
