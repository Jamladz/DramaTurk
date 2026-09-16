import { serve } from '@hono/node-server';
import app from './server';
import express from 'express';
import path from 'path';

const PORT = 3000;

async function startLocalServer() {
  const isProd = process.env.NODE_ENV === 'production';
  
  if (!isProd) {
    // In development mode, use Vite middleware
    const expressApp = express();
    expressApp.use(express.json());
    
    // Proxy Hono routes to Hono's fetch handler
    expressApp.all('/api/*', async (req, res) => {
      try {
        const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
        const headers = new Headers();
        for (const [key, value] of Object.entries(req.headers)) {
          if (value) {
            if (Array.isArray(value)) {
              value.forEach(v => headers.append(key, v));
            } else {
              headers.set(key, value);
            }
          }
        }
        
        let body: any = undefined;
        if (req.method !== 'GET' && req.method !== 'HEAD') {
          body = JSON.stringify(req.body);
        }

        const webReq = new Request(url, {
          method: req.method,
          headers,
          body
        });

        const webRes = await app.fetch(webReq);
        
        res.status(webRes.status);
        webRes.headers.forEach((value, key) => {
          res.setHeader(key, value);
        });
        
        const resBody = await webRes.text();
        res.send(resBody);
      } catch (err: any) {
        console.error("Proxy error:", err);
        res.status(500).json({ error: err.message });
      }
    });

    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    
    expressApp.use(vite.middlewares);

    expressApp.listen(PORT, '0.0.0.0', () => {
      console.log(`Local development server running at http://localhost:${PORT}`);
    });
  } else {
    // In production, run the pure Hono server serving static client files
    const serveStatic = (await import('@hono/node-server/serve-static')).serveStatic;
    app.use('*', serveStatic({ root: 'dist/client' }));
    
    // SPA routing fallback
    app.get('*', async (c) => {
      const fs = await import('node:fs/promises');
      try {
        const html = await fs.readFile(path.join(process.cwd(), 'dist/client/index.html'), 'utf-8');
        return c.html(html);
      } catch (e) {
        return c.text('Not found', 404);
      }
    });

    serve({
      fetch: app.fetch,
      port: PORT,
    }, (info) => {
      console.log(`Local production server running at http://localhost:${info.port}`);
    });
  }
}

startLocalServer();
