import React, { useState } from 'react';
import { X, Key, HardDrive, Shield, CheckCircle2 } from 'lucide-react';
import { UserPlan } from '../types';

interface PricingModalProps {
  currentPlan?: UserPlan | null;
  isLoggedIn?: boolean;
  onClose: () => void;
  onUpgrade: (plan: UserPlan) => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({ currentPlan = 'Free', onClose, onUpgrade }) => {
  const isPro = currentPlan !== 'Free' && currentPlan != null;
  const [activationCode, setActivationCode] = useState('');

  const handleBuyOnline = (url: string) => {
    // In a real desktop app, this would open the user's default browser 
    // to your LemonSqueezy or Gumroad checkout page.
    window.open(url, '_blank');
  };

  const handleActivate = () => {
    if (!activationCode.trim()) return;
    
    // Simulate hitting a License API (e.g. LemonSqueezy License Validation API)
    // Normally you send `activationCode` to the API and it returns the plan.
    const code = activationCode.trim().toUpperCase();
    
    if (code.length > 20 && code.includes('-')) {
        onUpgrade('6_Months');
    } else {
        onUpgrade('1_Month');
    }
  };

  return (
    <div className="fixed inset-0 z-[200] overflow-y-auto animate-fade-in font-sans" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex min-h-full items-start justify-center p-4 text-center sm:p-8">
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xl transition-opacity" aria-hidden="true" onClick={onClose}></div>
        
        <div className="relative transform flex flex-col rounded-[32px] bg-white text-left shadow-2xl transition-all w-full max-w-4xl max-h-[90vh] my-4 border border-gray-100" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-gray-100/50 hover:bg-gray-200/50 rounded-full text-gray-500 transition-colors z-50 backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="overflow-y-auto w-full no-scrollbar">
            <div className="pt-12 pb-8 px-6 md:px-10 text-center">
              <h2 className="text-3xl md:text-5xl font-semibold text-gray-900 tracking-tight mb-4" id="modal-title">
                Own your cognitive engine.
              </h2>
              <p className="text-lg text-gray-500 max-w-3xl mx-auto font-medium">
                100% private. 100% offline. Zero tracking. Just you, your ideas, and wholesale AI processing.
              </p>
            </div>

            <div className="px-4 md:px-10 pb-12">
              <div className="max-w-3xl mx-auto">
                <div className="rounded-[24px] p-6 md:p-8 border transition-all flex flex-col relative bg-zinc-900 border-zinc-900 shadow-2xl ring-1 ring-zinc-900 text-white">
                  
                  <div className="mb-8 text-center">
                    <h3 className="text-2xl font-semibold text-white">Kno Local - The Private Mind</h3>
                    <p className="text-sm mt-2 text-zinc-400">Unlock your spatial brain on your own hardware.</p>
                  </div>
                  
                  <div className="flex-1 space-y-6">
                    <div className="flex items-start">
                      <div className="bg-zinc-800 p-2.5 rounded-xl mr-4 shrink-0">
                        <Key className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="text-base font-semibold text-white mb-1">Bring Your Own Key (BYOK)</h4>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                          100% privacy first. Connect your Gemini/OpenAI keys directly and enjoy wholesale prices from major model providers. We never mark up your API costs.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-zinc-800 p-2.5 rounded-xl mr-4 shrink-0">
                        <HardDrive className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="text-base font-semibold text-white mb-1">Local-First Storage</h4>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                          Your whiteboard canvas, Memory Lab progress, and Neural Dump cards are saved directly to your device. No cloud outages, no corporate data mining.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-zinc-800 p-2.5 rounded-xl mr-4 shrink-0">
                        <Shield className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="text-base font-semibold text-white mb-1">Total Ownership</h4>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                          Export your entire brain graph as a raw JSON file at any time. When you use Kno, you truly own your thoughts.
                        </p>
                      </div>
                    </div>
                  </div>

                  {isPro ? (
                    <div className="mt-8 bg-zinc-800/50 rounded-xl p-6 border border-zinc-700/50 flex flex-col items-center justify-center text-center">
                        <CheckCircle2 className="w-12 h-12 text-green-400 mb-4" />
                        <h4 className="text-xl font-bold text-white mb-2">Kno is Activated</h4>
                        <p className="text-zinc-400 text-sm mb-6">Your local offline license is currently active on the <strong>{currentPlan.replace('_', ' ')}</strong> plan.</p>
                        <button 
                            onClick={() => onUpgrade('Free')}
                            className="px-6 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm text-white font-medium transition-colors"
                        >
                            Remove License
                        </button>
                    </div>
                  ) : (
                    <>
                      {/* Step 1: Buy Online */}
                      <div className="mt-8 border-t border-zinc-700/50 pt-8">
                        <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest text-center mb-4">Step 1: Purchase License Online</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <button 
                            onClick={() => handleBuyOnline('https://kno.lemonsqueezy.com/checkout/buy/52d26def-df7d-4285-b5ac-fb3b1fa8427d')}
                            className="p-4 rounded-xl border transition-all flex flex-col items-center justify-center text-center bg-zinc-800 border-zinc-700 hover:bg-zinc-700 hover:border-zinc-600 text-white group"
                            >
                            <div className="text-lg font-bold mb-1 group-hover:text-amber-400 transition-colors">Buy 1 Month License</div>
                            <div className="text-2xl font-black mb-1">HK$77.54</div>
                            <div className="text-[10px] text-zinc-400 flex items-center gap-1">Opens in browser <Shield className="w-3 h-3" /></div>
                            </button>

                            <button 
                            onClick={() => handleBuyOnline('https://kno.lemonsqueezy.com/checkout/buy/100ff29e-5745-4e90-b8eb-7436999eac8a')}
                            className="p-4 rounded-xl border transition-all flex flex-col items-center justify-center text-center relative bg-blue-600 border-blue-500 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 group"
                            >
                            <div className="absolute -top-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Best Value</div>
                            <div className="text-lg font-bold mb-1 transition-transform group-hover:scale-105">Buy 6 Months License</div>
                            <div className="text-2xl font-black mb-1">HK$227.11</div>
                            <div className="text-[10px] text-blue-200 flex items-center justify-center gap-1">Opens in browser <Shield className="w-3 h-3" /></div>
                            </button>
                        </div>
                      </div>

                      {/* Step 2: Activate License Key */}
                      <div className="mt-6 bg-zinc-800 border border-zinc-700 rounded-xl p-5">
                          <h4 className="text-sm font-semibold text-white mb-2">Step 2: Activate Your App</h4>
                          <p className="text-xs text-zinc-400 mb-4">Paste the License Key you received via email to unlock Kno.</p>
                          <div className="flex gap-2">
                              <input 
                                  type="text" 
                                  value={activationCode}
                                  onChange={(e) => setActivationCode(e.target.value)}
                                  placeholder="e.g. KNO-XXXX-XXXX-XXXX" 
                                  className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                              />
                              <button 
                                  onClick={handleActivate}
                                  disabled={!activationCode.trim()}
                                  className="whitespace-nowrap px-6 py-2 bg-white text-zinc-900 hover:bg-zinc-200 disabled:bg-zinc-600 disabled:text-zinc-400 font-bold rounded-lg text-sm transition-colors"
                              >
                                  Activate
                              </button>
                          </div>
                      </div>
                    </>
                  )}
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
