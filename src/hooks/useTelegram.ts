import { useEffect, useState } from 'react';

export function useTelegram() {
  const [tg, setTg] = useState(window.Telegram?.WebApp);

  useEffect(() => {
    const tgApp = (window as any).Telegram?.WebApp;
    if (tgApp) {
      setTg(tgApp);
      tgApp.ready();
      
      // Expand and request fullscreen officially as requested
      try {
        tgApp.expand();
        if (typeof tgApp.requestFullscreen === 'function') {
          tgApp.requestFullscreen();
        }
      } catch (e) {
        // Ignore expand or fullscreen errors
      }
    }
  }, []);

  return {
    tg,
    user: tg?.initDataUnsafe?.user,
    initData: tg?.initData,
    initDataUnsafe: tg?.initDataUnsafe,
    startParam: tg?.initDataUnsafe?.start_param
  };
}
