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
    async function authenticate() {
      // In development mode (if not opened in Telegram), we might not have initData
      // For this app, we strictly require Telegram initData.
      if (!initData) {
        console.warn("No Telegram initData found. Running outside of Telegram?");
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
        }
      } catch (error) {
        console.error("Auth error:", error);
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
