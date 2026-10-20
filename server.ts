import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const app = new Hono();

// Initialize Firebase Admin
try {
  initializeApp({
    projectId: "gen-lang-client-0163667078",
  });
} catch (e) {
  console.error("Firebase Admin initialization error:", e);
}

const db = getFirestore();
db.settings({ databaseId: "ai-studio-beed856d-c8cf-4b57-8b1f-f01c9896d3da" });

function verifyTelegramWebAppData(telegramInitData: string): any {
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

  initData.delete('hash');
  
  const keys = Array.from(initData.keys()).sort();
  const dataCheckString = keys.map(key => `${key}=${initData.get(key)}`).join('\n');

  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(token).digest();
  const computedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

  if (computedHash !== hash) {
    throw new Error('Invalid signature');
  }

  const userStr = initData.get('user');
  if (!userStr) throw new Error("No user in initData");
  
  return JSON.parse(decodeURIComponent(userStr));
}

// API Routes
app.post('/api/auth/telegram', async (c) => {
  try {
    const body = await c.req.json();
    const { initData, referralCode } = body;
    
    if (!initData) {
      return c.json({ error: 'Missing initData' }, 400);
    }

    const tgUser = verifyTelegramWebAppData(initData);
    const userId = tgUser.id.toString();

    // Create or update user in Firestore
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    const initials = (tgUser.first_name?.[0] || '') + (tgUser.last_name?.[0] || '');

    if (!userDoc.exists) {
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
      await userRef.update({
        username: tgUser.username || '',
        firstName: tgUser.first_name || '',
        lastName: tgUser.last_name || '',
        initials: initials.toUpperCase(),
        photoUrl: tgUser.photo_url || '',
        lastActiveAt: FieldValue.serverTimestamp()
      });
    }

    const customToken = await getAuth().createCustomToken(userId);
    return c.json({ token: customToken });
  } catch (error) {
    console.error("Auth error:", error);
    return c.json({ error: 'Unauthorized' }, 401);
  }
});

app.get('/api/ping', (c) => {
  return c.json({ status: 'ok' });
});

// Serve static files (assets)
app.use('/assets/*', serveStatic({ root: './dist/client' }));

// SPA Fallback: Serve index.html for all other routes
app.get('*', async (c) => {
  const filePath = path.resolve('./dist/client/index.html');
  if (fs.existsSync(filePath)) {
    const html = fs.readFileSync(filePath, 'utf-8');
    return c.html(html);
  }
  return c.text('Frontend not built. Please run npm run build.', 404);
});

// For development/Node.js environments (like AI Studio preview)
if (typeof EdgeRuntime !== 'string' && !globalThis.hasOwnProperty('WebSocketPair')) {
  const port = 3000;
  console.log(`Server running at http://localhost:${port}`);
  serve({
    fetch: app.fetch,
    port
  });
}

// Export for Cloudflare Workers
export default app;
