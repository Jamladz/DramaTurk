export type TelegramUser = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
};

export interface WebAppInitData {
  query_id?: string;
  user?: TelegramUser;
  receiver?: TelegramUser;
  chat?: {
    id: number;
    type: 'group' | 'supergroup' | 'channel';
    title: string;
    username?: string;
    photo_url?: string;
  };
  start_param?: string;
  auth_date: number;
  hash: string;
}

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initData: string;
        initDataUnsafe: WebAppInitData;
        version: string;
        platform: string;
        colorScheme: 'light' | 'dark';
        themeParams: {
          bg_color: string;
          text_color: string;
          hint_color: string;
          link_color: string;
          button_color: string;
          button_text_color: string;
          secondary_bg_color: string;
        };
        isExpanded: boolean;
        viewportHeight: number;
        viewportStableHeight: number;
        headerColor: string;
        backgroundColor: string;
        isClosingConfirmationEnabled: boolean;
        BackButton: {
          isVisible: boolean;
          onClick(callback: Function): void;
          offClick(callback: Function): void;
          show(): void;
          hide(): void;
        };
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          isProgressVisible: boolean;
          setText(text: string): void;
          onClick(callback: Function): void;
          offClick(callback: Function): void;
          show(): void;
          hide(): void;
          enable(): void;
          disable(): void;
          showProgress(leaveActive: boolean): void;
          hideProgress(): void;
          setParams(params: {
            text?: string;
            color?: string;
            text_color?: string;
            is_active?: boolean;
            is_visible?: boolean;
          }): void;
        };
        HapticFeedback: {
          impactOccurred(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'): void;
          notificationOccurred(type: 'error' | 'success' | 'warning'): void;
          selectionChanged(): void;
        };
        CloudStorage: {
          setItem(key: string, value: string, callback?: (err: Error | null, success?: boolean) => void): void;
          getItem(key: string, callback?: (err: Error | null, value?: string) => void): void;
          removeItem(key: string, callback?: (err: Error | null, success?: boolean) => void): void;
        };
        addToHomeScreen?(): void; // Newly introduced capability for some clients
        checkHomeScreenStatus?(callback: (status: 'unsupported' | 'unknown' | 'added' | 'missed') => void): void;
        ready(): void;
        expand(): void;
        close(): void;
      };
    };
  }
}
