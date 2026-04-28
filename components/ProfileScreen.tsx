import React, { useState, useEffect } from 'react';
import { UserProfile, UserPlan } from '../types';
import { Crown, AlertTriangle, CheckCircle2, Key, LogOut } from 'lucide-react';
import { getLocaleString, t } from '../src/i18n';
import { getSystemLanguage } from '../services/geminiService';
import { loadAllFromStorage } from '../services/storage';

interface ProfileScreenProps {
  user: any;
  userProfile: UserProfile | null;
  onClose: () => void;
  onUpgrade: (plan: UserPlan) => void;
  onLogout: () => void;
  onChangePlan: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  userProfile,
  onClose,
  onUpgrade,
  onLogout,
  onChangePlan
}) => {
  const [showConfirmUnsubscribe, setShowConfirmUnsubscribe] = useState(false);
  const [unsubscribeSuccess, setUnsubscribeSuccess] = useState(false);
  const [apiKey, setApiKey] = useState(userProfile?.customApiKey || '');
  const [imageApiKey, setImageApiKey] = useState(userProfile?.openaiApiKey || localStorage.getItem('openaiApiKey') || '');
  const [isSavingKey, setIsSavingKey] = useState(false);
  const [keySaved, setKeySaved] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setApiKey(userProfile.customApiKey || '');
      setImageApiKey(userProfile.openaiApiKey || localStorage.getItem('openaiApiKey') || '');
    }
  }, [userProfile]);

  const handleUnsubscribe = () => {
    onUpgrade('Free');
    setUnsubscribeSuccess(true);
    setTimeout(() => {
      setUnsubscribeSuccess(false);
      setShowConfirmUnsubscribe(false);
    }, 3000);
  };

  const handleSaveApiKey = async () => {
    setIsSavingKey(true);
    try {
      localStorage.setItem('customApiKey', apiKey);
      localStorage.setItem('openaiApiKey', imageApiKey);
      
      setKeySaved(true);
      setTimeout(() => setKeySaved(false), 3000);
      
      // Reload to apply the local keys globally across the app instance
      window.location.reload();
    } catch (error) {
      console.error("Error saving API key:", error);
      alert("Failed to save API key completely to local storage. Check permissions.");
    } finally {
      setIsSavingKey(false);
    }
  };

  const getPlanLimit = (plan: string) => {
    switch (plan) {
      case '1_Month':
      case '6_Months':
        return 'Unlimited';
      default: return 0;
    }
  };
  const totalAiUsed = (userProfile?.usageCount || 0) + (userProfile?.logicGuardUsageCount || 0);
  const planLimit = getPlanLimit(userProfile?.plan || 'Free');

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden animate-scale-in">
        <div className="p-4 md:p-6 border-b border-gray-100 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-bold text-gray-900">Your Profile</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        
        <div className="p-4 md:p-6 space-y-5 overflow-y-auto">
          {/* User Info */}
          <div className="flex items-center gap-4">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-16 h-16 rounded-full border-2 border-gray-100" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-2xl">
                {user?.email?.[0].toUpperCase()}
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{user?.displayName || 'User'}</h3>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>

          {/* Plan Details */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500">Current Plan</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 uppercase tracking-wider">
                {(userProfile?.plan || 'Free').replace('_', ' ')} <Crown className="w-3 h-3" />
              </span>
            </div>
            
            <div className="space-y-2 mt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total AI Used</span>
                <span className="font-medium text-gray-900">{totalAiUsed} / {planLimit}</span>
              </div>
              {userProfile?.billingDueDate && userProfile.plan !== 'Free' && (
                <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                  <span className="text-gray-600">Next Billing Date</span>
                  <span className="font-medium text-gray-900">
                    {new Date(userProfile.billingDueDate).toLocaleDateString(getLocaleString(getSystemLanguage()))}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* API Key Input */}
          {userProfile?.plan !== 'Free' && (
            <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-200">
              <div className="flex items-center gap-2 mb-3">
                <Key className="w-4 h-4 text-zinc-600" />
                <span className="text-sm font-semibold text-zinc-900">Your API Keys (Required)</span>
              </div>
              <p className="text-xs text-zinc-500 mb-3">
                Kno relies exclusively on your personal API keys for 100% privacy and wholesale processing.
              </p>
              <div className="space-y-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-zinc-700">Gemini API Key (General AI)</label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={t("Paste your Gemini API key...", getSystemLanguage())}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-zinc-700">Generate Image API Key (Neural Dump)</label>
                  <input
                    type="password"
                    value={imageApiKey}
                    onChange={(e) => setImageApiKey(e.target.value)}
                    placeholder={t("Paste your Image API key...", getSystemLanguage())}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={handleSaveApiKey}
                  disabled={isSavingKey || (!apiKey && !imageApiKey)}
                  className="w-full px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 disabled:opacity-50 transition-colors mt-2"
                >
                  {isSavingKey ? 'Saving...' : keySaved ? 'Saved!' : 'Save Keys'}
                </button>
              </div>
            </div>
          )}

          {/* System Language Settings */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
              <span className="text-sm font-semibold text-gray-900">System Language</span>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              Choose the language for AI-generated summaries, quizzes, and responses.
            </p>
            <select
              value={userProfile?.language || localStorage.getItem('system_language') || 'English'}
              onChange={async (e) => {
                const newLang = e.target.value;
                localStorage.setItem('system_language', newLang);
                window.location.reload();
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
            >
              <option value="English">English</option>
              <option value="Chinese">中文 (Chinese)</option>
              <option value="Spanish">Español (Spanish)</option>
              <option value="French">Français (French)</option>
              <option value="German">Deutsch (German)</option>
              <option value="Japanese">日本語 (Japanese)</option>
              <option value="Korean">한국어 (Korean)</option>
            </select>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-2">
            <button 
              onClick={onChangePlan}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors"
            >
              Change Plan
            </button>
            {userProfile?.plan !== 'Free' && (
              <div className="relative">
                {showConfirmUnsubscribe ? (
                  <div className="bg-red-50 border border-red-100 rounded-xl p-4 animate-fade-in">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-semibold text-red-800">Confirm Unsubscribe</h4>
                        <p className="text-xs text-red-600 mt-1 mb-3">Are you sure you want to downgrade to the Free plan? You will lose access to premium features.</p>
                        <div className="flex gap-2">
                          <button 
                            onClick={handleUnsubscribe}
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg transition-colors"
                          >
                            Yes, Unsubscribe
                          </button>
                          <button 
                            onClick={() => setShowConfirmUnsubscribe(false)}
                            className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-medium rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : unsubscribeSuccess ? (
                  <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium text-green-800">Successfully unsubscribed</span>
                  </div>
                ) : (
                  <button 
                    onClick={() => setShowConfirmUnsubscribe(true)}
                    className="w-full py-2.5 px-4 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-sm font-medium transition-colors"
                  >
                    Unsubscribe from Premium
                  </button>
                )}
              </div>
            )}
            
            <button 
              onClick={async () => {
                const keys = ['kno_inbox', 'kno_library', 'kno_folders', 'kno_themes', 'kno_canvases'];
                const results = await loadAllFromStorage(keys);
                const data = {
                  inbox: results['kno_inbox'] || [],
                  library: results['kno_library'] || [],
                  folders: results['kno_folders'] || [],
                  themes: results['kno_themes'] || [],
                  canvases: results['kno_canvases'] || [],
                };
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `kno_export_${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              className="w-full py-2.5 px-4 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Export All Data
            </button>
            <button 
              onClick={onLogout}
              className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
