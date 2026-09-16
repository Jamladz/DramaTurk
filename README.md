# Drama Turk - Telegram Mini App

🎬 A production-ready Telegram Mini App for watching Turkish TV series and weekly episodes. Built with React, Tailwind CSS, Firebase, and designed for Cloudflare Pages/Workers.

## Architecture & Tech Stack

- **Frontend:** React, React Router, Tailwind CSS, Lucide Icons
- **Backend (API):** Express (for local dev) / Cloudflare Workers (for production)
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth (Custom Tokens generated via Telegram `initData` signature verification)
- **Platform:** Telegram WebApp SDK

## Database Schema (Firestore)

The application uses Firestore to store users, series, episodes, and referral data.

- `users/{telegramUserId}`: Telegram ID, names, referral stats.
- `series/{seriesId}`: Title, description, poster, status.
- `episodes/{episodeId}`: Series ID, episode number, title, release date, thumbnail, duration.
- `tasks/{taskId}`: (To be implemented) Daily/weekly user tasks.

## Deployment Guide

Follow these steps to deploy the application to a production environment.

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

Ensure you have a Firebase project created.
1. Enable **Authentication** (No specific providers needed, Custom Tokens are used).
2. Enable **Firestore**.
3. Generate a new Private Key from Project Settings > Service Accounts. This is your Firebase Admin credential.
4. Update `/src/firebase.ts` with your public Firebase configuration.

### 3. Configure Telegram

1. Open Telegram and search for `@BotFather`.
2. Create a new bot or select an existing one.
3. Keep the **Bot Token** safe.
4. Go to Bot Settings > Web Apps and configure your Cloudflare deployment URL (once deployed).

### 4. Configure Environment Variables

Create a `.env` file for local development (do not commit it).

```env
TELEGRAM_BOT_TOKEN="your-bot-token"
# Firebase Admin Credentials (if running locally or outside Cloudflare)
# In Cloudflare, these will be set via wrangler secrets
```

### 5. Configure Cloudflare

The project includes a `wrangler.toml` file to deploy the backend API. 
Make sure you have Wrangler CLI installed and authenticated (`npx wrangler login`).

Set up your secrets securely in Cloudflare:

```bash
npx wrangler secret put TELEGRAM_BOT_TOKEN
```

### 6. Deploy Frontend

You can deploy the Vite React app to Cloudflare Pages:

```bash
npm run build
npx wrangler pages deploy dist/client --project-name drama-turk
```

### 7. Deploy Workers / API

Deploy the serverless backend using:

```bash
npx wrangler deploy
```

*(Note: The provided `server.ts` uses Express for local full-stack simulation. For actual Cloudflare Workers deployment, you'll need to adapt the Express routes into Hono or Cloudflare's native Request/Response handler.)*

### 8. Configure Telegram Mini App URL

In `@BotFather`, set the Menu Button or Web App URL to your deployed Cloudflare Pages URL.

### 9. Test Flow

1. **Authentication:** Open the bot in Telegram and start the Web App. The `initData` should be passed successfully and verified by the backend.
2. **Referral System:** Navigate to the Referral tab, copy the link, and test it from a different account.
3. **PWA:** Check if the "Add to Home Screen" prompt appears after a few seconds of usage (on supported devices).

## Security Notes

- The Telegram `initData` is validated strictly on the server-side (`verifyTelegramWebAppData`). Do not trust `Telegram.WebApp.initDataUnsafe` for database actions.
- The referral tracking is executed securely on the server-side during the initial authentication payload check.
