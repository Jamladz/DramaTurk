import { Hono } from 'hono';
import { cors } from 'hono/cors';
import crypto from 'node:crypto';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';

const app = new Hono();

// Enable CORS
app.use('*', cors());

// Firebase client config
const firebaseConfig = {
  projectId: "gen-lang-client-0163667078",
  appId: "1:638271136518:web:b935de69f34a181b997487",
  apiKey: "AIzaSyB6jUo0n3twSTlo4UOS8EUP5LT5FgGVIP4",
  authDomain: "gen-lang-client-0163667078.firebaseapp.com",
  storageBucket: "gen-lang-client-0163667078.firebasestorage.app",
  messagingSenderId: "638271136518"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp, "ai-studio-beed856d-c8cf-4b57-8b1f-f01c9896d3da");

// Verify Telegram initData
function verifyTelegramWebAppData(telegramInitData: string, botToken: string): any {
  const initData = new URLSearchParams(telegramInitData);
  const hash = initData.get('hash');
  
  if (!hash) {
    throw new Error('No hash provided');
  }

  initData.delete('hash');
  const keys = Array.from(initData.keys()).sort();
  const dataCheckString = keys.map(key => `${key}=${initData.get(key)}`).join('\n');

  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
  const computedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

  if (computedHash !== hash) {
    throw new Error('Invalid signature');
  }

  const userStr = initData.get('user');
  if (!userStr) throw new Error("No user in initData");
  
  return JSON.parse(decodeURIComponent(userStr));
}

// Sign custom token JWT with RS256
function signCustomToken(userId: string, serviceAccount: { client_email: string; private_key: string }) {
  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: serviceAccount.client_email,
    sub: serviceAccount.client_email,
    aud: 'https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit',
    iat: now,
    exp: now + 3600,
    uid: userId
  };

  const base64UrlEncode = (obj: any) => {
    return Buffer.from(JSON.stringify(obj))
      .toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  };

  const encodedHeader = base64UrlEncode(header);
  const encodedPayload = base64UrlEncode(payload);
  const tokenData = `${encodedHeader}.${encodedPayload}`;

  const sign = crypto.createSign('RSA-SHA256');
  sign.update(tokenData);
  const signature = sign.sign(serviceAccount.private_key, 'base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${tokenData}.${signature}`;
}

app.post('/api/auth/telegram', async (c) => {
  try {
    const body = await c.req.json();
    const { initData, referralCode } = body;

    if (!initData) {
      return c.json({ error: 'Missing initData' }, 400);
    }

    // Read secrets/variables from env (Cloudflare Worker secrets)
    const env = (c.env || {}) as any;
    const telegramBotToken = env.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
    const clientEmail = env.FIREBASE_CLIENT_EMAIL || process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = env.FIREBASE_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY;

    let tgUser;
    if (!telegramBotToken) {
      console.warn("Missing TELEGRAM_BOT_TOKEN. Bypassing verification for development.");
      const params = new URLSearchParams(initData);
      const userStr = params.get('user');
      if (!userStr) return c.json({ error: 'No user in initData' }, 400);
      tgUser = JSON.parse(decodeURIComponent(userStr));
    } else {
      tgUser = verifyTelegramWebAppData(initData, telegramBotToken);
    }

    const userId = tgUser.id.toString();

    // Create or update user in Firestore
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    const initials = ((tgUser.first_name?.[0] || '') + (tgUser.last_name?.[0] || '')).toUpperCase();

    if (!userSnap.exists()) {
      // New user
      await setDoc(userRef, {
        telegramId: userId,
        username: tgUser.username || '',
        firstName: tgUser.first_name || '',
        lastName: tgUser.last_name || '',
        initials: initials,
        photoUrl: tgUser.photo_url || '',
        createdAt: serverTimestamp(),
        lastActiveAt: serverTimestamp(),
        invitedCount: 0,
        referredBy: referralCode || null,
        referralCode: `ref_${userId}`
      });

      // If referred, update the referrer
      if (referralCode && referralCode.startsWith('ref_')) {
        const referrerId = referralCode.replace('ref_', '');
        if (referrerId !== userId) {
          const referrerRef = doc(db, 'users', referrerId);
          await updateDoc(referrerRef, {
            invitedCount: increment(1)
          });
        }
      }
    } else {
      // Update existing
      await updateDoc(userRef, {
        username: tgUser.username || '',
        firstName: tgUser.first_name || '',
        lastName: tgUser.last_name || '',
        initials: initials,
        photoUrl: tgUser.photo_url || '',
        lastActiveAt: serverTimestamp()
      });
    }

    // Mint custom token
    let customToken;
    if (clientEmail && privateKey) {
      // Sign with real credentials
      customToken = signCustomToken(userId, {
        client_email: clientEmail,
        private_key: privateKey.replace(/\\n/g, '\n') // Handle escaped newlines
      });
    } else {
      // If credentials are not set yet, return a mock token for local testing
      console.warn("Missing FIREBASE_CLIENT_EMAIL or FIREBASE_PRIVATE_KEY. Returning unsigned token for testing.");
      customToken = `mock_token_for_user_${userId}`;
    }

    return c.json({ token: customToken });
  } catch (error: any) {
    console.error("Auth error:", error);
    return c.json({ error: error.message || 'Unauthorized' }, 401);
  }
});

app.get('/api/ping', (c) => {
  return c.json({ status: 'ok' });
});

export default app;
