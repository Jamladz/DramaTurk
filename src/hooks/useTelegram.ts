import { useEffect, useState } from 'react';

export function useTelegram() {
  const [tg, setTg] = useState(window.Telegram?.WebApp);

  useEffect(() => {
    const tgApp = window.Telegram?.WebApp;
    if (tgApp) {
      setTg(tgApp);
      tgApp.ready();
      
      // Expand to full screen as requested (Official Telegram Method)
      try {
        if (tgApp.requestFullscreen) {
          tgApp.requestFullscreen();
        } else {
          tgApp.expand();
        }
      } catch (e) {
        // Fallback to expand if requestFullscreen fails
        try {
          tgApp.expand();
        } catch (innerError) {
          console.error("Telegram expand error:", innerError);
        }
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
