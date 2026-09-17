import React, { createContext, useContext, useEffect, useState } from 'react';
import { signInWithCustomToken, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useTelegram } from './useTelegram';

interface AuthContextType {
  user: User | null;
  profile: any | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, profile: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const { initData, startParam } = useTelegram();

  useEffect(() => {
    function getFallbackProfile(tgUser: any) {
      if (!tgUser) {
        // Return beautiful mock profile for outside Telegram
        return {
          telegramId: "mock_12345",
          username: "drama_turk_fan",
          firstName: "سليمان",
          lastName: "الدير",
          initials: "SA",
          photoUrl: "",
          invitedCount: 3,
          referralCode: "ref_mock_12345"
        };
      }
      const initials = ((tgUser.first_name?.[0] || '') + (tgUser.last_name?.[0] || '')).toUpperCase() || 'TG';
      return {
        telegramId: tgUser.id.toString(),
        username: tgUser.username || '',
        firstName: tgUser.first_name || '',
        lastName: tgUser.last_name || '',
        initials: initials,
        photoUrl: tgUser.photo_url || '',
        invitedCount: 0,
        referralCode: `ref_${tgUser.id}`
      };
    }

    async function authenticate() {
      // In development/AI Studio mode (if not opened in Telegram), we don't have initData
      if (!initData) {
        console.warn("No Telegram initData found. Running outside of Telegram. Using fallback profile.");
        const localTgUser = (window as any).Telegram?.WebApp?.initDataUnsafe?.user;
        setProfile(getFallbackProfile(localTgUser));
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/auth/telegram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            initData, 
            referralCode: startParam 
          })
        });

        if (!response.ok) throw new Error('Authentication failed');
        
        const { token } = await response.json();
        
        // Sign in with Firebase using the custom token
        const userCredential = await signInWithCustomToken(auth, token);
        setUser(userCredential.user);
        
        // Fetch extended profile from Firestore
        const profileRef = doc(db, 'users', userCredential.user.uid);
        const profileSnap = await getDoc(profileRef);
        
        if (profileSnap.exists()) {
          setProfile(profileSnap.data());
        } else {
          // If profile does not exist in Firestore yet, use local Telegram WebApp properties
          const localTgUser = (window as any).Telegram?.WebApp?.initDataUnsafe?.user;
          setProfile(getFallbackProfile(localTgUser));
        }
      } catch (error) {
        console.error("Auth error, falling back to local Telegram WebApp user data:", error);
        // Fall back to Telegram WebApp raw user data so the UI displays username and name perfectly!
        const localTgUser = (window as any).Telegram?.WebApp?.initDataUnsafe?.user;
        setProfile(getFallbackProfile(localTgUser));
      } finally {
        setLoading(false);
      }
    }

    authenticate();
  }, [initData, startParam]);

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
