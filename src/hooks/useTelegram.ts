import { useEffect, useState } from 'react';

export function useTelegram() {
  const [tg, setTg] = useState(window.Telegram?.WebApp);

  useEffect(() => {
    const tgApp = window.Telegram?.WebApp;
    if (tgApp) {
      setTg(tgApp);
      tgApp.ready();
      
      // Expand to full screen as requested
      try {
        tgApp.expand();
      } catch (e) {
        // Ignore expand errors
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
