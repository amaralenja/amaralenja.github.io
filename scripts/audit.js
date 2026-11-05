const { chromium } = require('playwright');
const fs = require('fs') || null;
const path = require('path');

(async () => {
  const pages = ['index.html','shop.html','product.html?id=green-pill','safety.html','faq.html','login.html','privacy.html','404.html'];
  const viewports = [{w:1440,h:900,name:'desktop'},{w:375,h:812,name:'mobile'}];
  const browser = await chromium.launch();
  const results = [];
  for (const vp of viewports) {
    const context = await browser.newContext({ viewport: { width: vp.w, height: vp.h } });
    const page = await context.newPage();
    const errors = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', e => errors.push('pageerror: ' + e.message));
    for (const p of pages) {
      await page.goto('http://127.0.0.1:8123/' + p.replace(/\?id=\w+/,'?id=green-pill'), { waitUntil: 'networkidle' });
      const overflow = await page.evaluate(() => {
        const sw = document.documentElement.scrollWidth, iw = window.innerWidth;
        const bad = [];
        if (sw > iw + 1) {
          document.querySelectorAll('*').forEach(el => {
            if (el.scrollWidth > iw + 2) bad.push(el.tagName + '.' + (el.className||'').split(' ')[0] + ' ' + el.scrollWidth + 'w vs ' + iw);
          });
        }
        return { sw, iw, bad: bad.slice(0,5) };
      });
      const brokenImgs = await page.evaluate(() => Array.from(document.images).filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.src));
      const hasH1 = await page.evaluate(() => !!document.querySelector('h1'));
      results.push({ page: p, viewport: vp.name, overflow, brokenImgs, hasH1, errors: errors.splice(0) });
      if (vp.name === 'mobile') {
        const safe = p.replace(/[?&=-]/g,'_').slice(0,12);
        await page.screenshot({ path: 'screenshots/mobile-' + safe + '.png', fullPage: true });
      }
    }
    await context.close();
  }
  await browser.close();
  console.log(JSON.stringify(results, null, 2));
})();