import express from 'express';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import crypto from 'crypto';

const app = express();
app.use(express.json());

// Initialize Firebase Admin (Uses Application Default Credentials in production/Cloud Run)
// In a real environment, you'd configure the service account.
initializeApp({
  projectId: "gen-lang-client-0163667078",
});

const db = getFirestore();
db.settings({ databaseId: "ai-studio-beed856d-c8cf-4b57-8b1f-f01c9896d3da" });

function verifyTelegramWebAppData(telegramInitData: string): any {
  // In development without a real bot token, we'll bypass strict verification
  // and simulate successful parsing for demo purposes if TELEGRAM_BOT_TOKEN is missing.
  const token = process.env.TELEGRAM_BOT_TOKEN;
  
  const initData = new URLSearchParams(telegramInitData);
  const hash = initData.get('hash');
  
  if (!token) {
    console.warn("Missing TELEGRAM_BOT_TOKEN. Bypassing verification for development.");
    const userStr = initData.get('user');
    if (!userStr) throw new Error("No user in initData");
    return JSON.parse(decodeURIComponent(userStr));
  }

  if (!hash) {
    throw new Error('No hash provided');
  }

  // Remove hash from the data to verify
  initData.delete('hash');
  
  // Sort the keys alphabetically
  const keys = Array.from(initData.keys()).sort();
  const dataCheckString = keys.map(key => `${key}=${initData.get(key)}`).join('\n');

  // Compute secret key
  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(token).digest();
  
  // Compute hash
  const computedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

  if (computedHash !== hash) {
    throw new Error('Invalid signature');
  }

  const userStr = initData.get('user');
  if (!userStr) throw new Error("No user in initData");
  
  return JSON.parse(decodeURIComponent(userStr));
}

// Routes
app.post('/api/auth/telegram', async (req, res) => {
  try {
    const { initData, referralCode } = req.body;
    
    if (!initData) {
      return res.status(400).json({ error: 'Missing initData' });
    }

    const tgUser = verifyTelegramWebAppData(initData);
    const userId = tgUser.id.toString();

    // Create or update user in Firestore
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    const initials = (tgUser.first_name?.[0] || '') + (tgUser.last_name?.[0] || '');

    if (!userDoc.exists) {
      // New user
      await userRef.set({
        telegramId: userId,
        username: tgUser.username || '',
        firstName: tgUser.first_name || '',
        lastName: tgUser.last_name || '',
        initials: initials.toUpperCase(),
        photoUrl: tgUser.photo_url || '',
        createdAt: FieldValue.serverTimestamp(),
        lastActiveAt: FieldValue.serverTimestamp(),
        invitedCount: 0,
        referredBy: referralCode || null,
        referralCode: `ref_${userId}`
      });
      
      // If referred, update the referrer
      if (referralCode && referralCode.startsWith('ref_')) {
        const referrerId = referralCode.replace('ref_', '');
        if (referrerId !== userId) {
          const referrerRef = db.collection('users').doc(referrerId);
          await referrerRef.update({
            invitedCount: FieldValue.increment(1)
          });
        }
      }
    } else {
      // Update existing
      await userRef.update({
        username: tgUser.username || '',
        firstName: tgUser.first_name || '',
        lastName: tgUser.last_name || '',
        initials: initials.toUpperCase(),
        photoUrl: tgUser.photo_url || '',
        lastActiveAt: FieldValue.serverTimestamp()
      });
    }

    // Mint custom token
    const customToken = await getAuth().createCustomToken(userId);
    
    res.json({ token: customToken });
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ error: 'Unauthorized' });
  }
});

app.get('/api/ping', (req, res) => {
  res.json({ status: 'ok' });
});


async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  
  if (!isProd) {
    // In development mode, use Vite middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve the built client
    app.use(express.static('dist/client'));
    app.get('*', (req, res) => {
      res.sendFile('index.html', { root: 'dist/client' });
    });
  }

  app.listen(3000, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:3000`);
  });
}

startServer();
