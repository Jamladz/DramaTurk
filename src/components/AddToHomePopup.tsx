import { useEffect, useState } from 'react';
import { useTelegram } from '../hooks/useTelegram';
import { Download, X } from 'lucide-react';

export function AddToHomePopup() {
  const { tg } = useTelegram();
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed or added
    const dismissed = localStorage.getItem('dramaturk_pwa_dismissed');
    if (dismissed) return;

    // Wait a bit before showing to not overwhelm the user
    const timer = setTimeout(() => {
      // Use official Telegram check if available (introduced in recent versions)
      if (tg?.checkHomeScreenStatus) {
        tg.checkHomeScreenStatus((status) => {
          if (status === 'missed' || status === 'unknown') {
            setShow(true);
          }
        });
      } else {
        // Fallback for older clients that don't support checking
        setShow(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [tg]);

  const handleAdd = () => {
    if (tg?.addToHomeScreen) {
      tg.addToHomeScreen();
    }
    setShow(false);
    localStorage.setItem('dramaturk_pwa_dismissed', 'true');
  };

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem('dramaturk_pwa_dismissed', 'true');
  };

  if (!show) return null;

  return (
    <div className="fixed top-20 left-4 right-4 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="bg-[#2c2c2e] rounded-2xl p-4 shadow-2xl border border-white/10 flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
          <span className="text-2xl">🎬</span>
        </div>
        
        <div className="flex-1">
          <h3 className="text-white font-semibold text-sm">Add to Home Screen</h3>
          <p className="text-gray-400 text-xs mt-1">Get faster access to Turkish dramas.</p>
        </div>

        <div className="flex flex-col gap-2">
          {tg?.addToHomeScreen && (
            <button 
              onClick={handleAdd}
              className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-full transition-colors"
              aria-label="Add to home screen"
            >
              <Download size={16} />
            </button>
          )}
          <button 
            onClick={handleDismiss}
            className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors"
            aria-label="Dismiss"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
