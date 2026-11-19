/**
 * Generates the social-share images (1200×630 JPEG) for every language:
 *   public/images/og/og-bn.jpg, og-en.jpg, og-ar.jpg
 *
 * Run:  npm run og
 * Needs Google Chrome / Chromium installed. Set CHROME_PATH if it isn't found automatically.
 * Re-run whenever the logo, name, motto or tagline changes.
 */
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { siteConfig } from '../src/config/site.config.js';

const root = fileURLToPath(new URL('..', import.meta.url));
const outDir = join(root, 'public/images/og');
const logoUrl = pathToFileURL(join(root, 'public', siteConfig.logo)).href;
const PORT = 9339;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
  ].filter(Boolean);
  const found = candidates.find((p) => existsSync(p));
  if (!found) throw new Error('Chrome not found. Set CHROME_PATH=/path/to/chrome');
  return found;
}

function template(code) {
  const c = JSON.parse(readFileSync(join(root, `src/i18n/locales/${code}.json`), 'utf-8'));
  const { dir } = siteConfig.languages.find((l) => l.code === code);
  const font = { bn: 'Hind Siliguri', en: 'Plus Jakarta Sans', ar: 'Noto Kufi Arabic' }[code] ?? 'Plus Jakarta Sans';

  return `<!doctype html>
<html lang="${code}" dir="${dir}">
<head>
<meta charset="utf-8" />
<link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@500;600;700&family=Noto+Kufi+Arabic:wght@500;700;800&family=Plus+Jakarta+Sans:wght@500;700;800&display=block" rel="stylesheet" />
<style>
  * { box-sizing: border-box; margin: 0; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body {
    font-family: "${font}", sans-serif; color: #fff; position: relative;
    background:
      radial-gradient(700px 420px at 88% 8%, rgb(54 162 67 / .45), transparent 60%),
      radial-gradient(600px 420px at 0% 100%, rgb(50 102 198 / .6), transparent 60%),
      linear-gradient(135deg, #0f1e3d, #1c3a75 55%, #1e4590);
  }
  .dots { position: absolute; inset: 0; opacity: .18;
    background-image: radial-gradient(#fff 1px, transparent 1px); background-size: 26px 26px; }
  .wrap { position: relative; height: 100%; display: flex; align-items: center; gap: 64px; padding: 0 80px 40px; }
  .logo { flex: none; width: 360px; height: 360px; border-radius: 50%; position: relative; }
  .logo::before { content: ""; position: absolute; inset: -22px; border-radius: 50%;
    border: 2px dashed rgb(255 255 255 / .25); }
  .logo img { width: 100%; height: 100%; border-radius: 50%; background: #fff; object-fit: cover;
    box-shadow: 0 30px 60px -20px rgb(0 0 0 / .6), 0 0 0 10px rgb(255 255 255 / .12); }
  .text { flex: 1; min-width: 0; }
  .pill { display: inline-block; padding: 8px 20px; border-radius: 999px; font-size: 22px; font-weight: 600;
    color: #b3e6b9; background: rgb(255 255 255 / .1); border: 1px solid rgb(255 255 255 / .2); }
  h1 { margin-top: 22px; font-size: ${code === 'en' ? 54 : 58}px; line-height: 1.2; font-weight: 800; }
  .motto { margin-top: 18px; font-size: ${code === 'en' ? 36 : 40}px; line-height: 1.35; font-weight: 700;
    background: linear-gradient(90deg, #80d28a, #d8f3db); -webkit-background-clip: text; color: transparent; }
  .meta { margin-top: 30px; display: flex; flex-wrap: wrap; gap: 10px; }
  .meta span { white-space: nowrap; padding: 6px 14px; border-radius: 999px; font-size: 19px; font-weight: 600;
    color: rgb(217 230 248 / .95); background: rgb(255 255 255 / .08); border: 1px solid rgb(255 255 255 / .15); }
  .bar { position: absolute; inset-inline: 0; bottom: 0; height: 10px;
    background: linear-gradient(90deg, #3266c6, #36a243, #3266c6); }
  .wave { position: absolute; inset-inline: 0; bottom: 10px; width: 100%; height: 60px; }
</style>
</head>
<body>
  <div class="dots"></div>
  <div class="wrap">
    <div class="logo"><img src="${logoUrl}" alt="" /></div>
    <div class="text">
      <span class="pill">${esc(c.hero.eyebrow)}</span>
      <h1>${esc(c.brand.name)}</h1>
      <p class="motto">${esc(c.brand.motto)}</p>
      <p class="meta">${c.hero.badges.map((b) => `<span>✓ ${esc(b)}</span>`).join('')}</p>
    </div>
  </div>
  <svg class="wave" viewBox="0 0 1200 60" preserveAspectRatio="none" aria-hidden="true">
    <path d="M0 30 C 150 5, 300 5, 450 30 S 750 55, 900 30 S 1100 5, 1200 25 V 60 H 0 Z" fill="rgb(255 255 255 / .08)"/>
    <path d="M0 42 C 200 20, 400 20, 600 42 S 1000 62, 1200 38 V 60 H 0 Z" fill="rgb(255 255 255 / .1)"/>
  </svg>
  <div class="bar"></div>
</body>
</html>`;
}

/* ---- minimal Chrome DevTools Protocol client (Node 22 has a global WebSocket) ---- */
async function connect() {
  for (let i = 0; i < 50; i++) {
    try {
      const targets = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      const page = targets.find((t) => t.type === 'page');
      if (page) {
        const ws = new WebSocket(page.webSocketDebuggerUrl);
        await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
        let id = 0;
        const pending = new Map();
        ws.onmessage = (m) => {
          const d = JSON.parse(m.data);
          if (pending.has(d.id)) { pending.get(d.id)(d.result); pending.delete(d.id); }
        };
        const send = (method, params = {}) =>
          new Promise((r) => { const i2 = ++id; pending.set(i2, r); ws.send(JSON.stringify({ id: i2, method, params })); });
        return { ws, send };
      }
    } catch { /* not ready yet */ }
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error('Could not connect to Chrome');
}

const work = mkdtempSync(join(tmpdir(), 'shf-og-'));
const chrome = spawn(findChrome(), [
  '--headless=new', '--no-sandbox', '--disable-gpu', '--hide-scrollbars',
  `--remote-debugging-port=${PORT}`, `--user-data-dir=${join(work, 'profile')}`,
  '--allow-file-access-from-files', 'about:blank',
], { stdio: 'ignore' });

try {
  mkdirSync(outDir, { recursive: true });
  const { ws, send } = await connect();
  await send('Emulation.setDeviceMetricsOverride', { width: 1200, height: 630, deviceScaleFactor: 1, mobile: false });

  for (const { code } of siteConfig.languages) {
    const file = join(work, `og-${code}.html`);
    writeFileSync(file, template(code));
    await send('Page.navigate', { url: pathToFileURL(file).href });
    // wait for web fonts + logo
    await send('Runtime.evaluate', {
      expression: `new Promise(r => (function w(){ document.readyState === 'complete' ? document.fonts.ready.then(() => setTimeout(r, 400)) : setTimeout(w, 100) })())`,
      awaitPromise: true,
    });
    const shot = await send('Page.captureScreenshot', {
      format: 'jpeg', quality: 88, clip: { x: 0, y: 0, width: 1200, height: 630, scale: 1 },
    });
    const out = join(outDir, `og-${code}.jpg`);
    writeFileSync(out, Buffer.from(shot.data, 'base64'));
    console.log(`✓ ${out.replace(root, '')}  (${Math.round(Buffer.byteLength(shot.data, 'base64') / 1024)} KB)`);
  }
  ws.close();
} finally {
  chrome.kill();
}
