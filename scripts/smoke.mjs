import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const output = new URL('../docs/qa/', import.meta.url);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-webgl', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const report = [];
try {
  for (const viewport of [{ width: 1440, height: 1080 }, { width: 1024, height: 900 }, { width: 390, height: 844 }]) {
    const mobile = viewport.width < 500;
    const name = mobile ? 'mobile' : viewport.width === 1024 ? 'laptop' : 'desktop';
    const page = await browser.newPage({ viewport, deviceScaleFactor: 1, reducedMotion: "reduce", isMobile: mobile, hasTouch: mobile });
    page.setDefaultTimeout(15000);
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    await page.goto('http://127.0.0.1:3000/?qa=1', { waitUntil: 'networkidle' });
    await page.waitForFunction(() => window.__cityAudit?.().zones.education?.target);
    await page.locator('canvas').scrollIntoViewIfNeeded();
    assert.equal(await page.locator('.scene-label').count(), 4);
    await page.screenshot({ path: fileURLToPath(new URL(`${name}.png`, output)), fullPage: false });
    const metrics = await page.evaluate(() => window.__cityAudit());
    assert.equal(Object.keys(metrics.zones).length, 4);
    assert.ok(metrics.triangles > 1000, 'Canvas must render actual geometry');
    let explored = 0;
    for (const [id, label, title] of [['health', 'Kesehatan', 'Diagnostik cerdas'], ['transport', 'Transportasi', 'Mobilitas otonom'], ['industry', 'Industri', 'Pabrik adaptif'], ['education', 'Pendidikan', 'Belajar personal']]) {
      // Full-page screenshots and smooth anchor navigation can move the viewport.
      // Center the canvas immediately before resolving real mesh coordinates.
      await page.evaluate(() => {
        const rect = document.querySelector('canvas').getBoundingClientRect();
        window.scrollTo({ top: scrollY + rect.top - (innerHeight - rect.height) / 2, behavior: 'instant' });
      });
      const { target } = await page.evaluate((key) => window.__cityAudit().zones[key], id);
      await page.mouse.move(target.x, target.y);
      await page.locator('.scene-tooltip').waitFor({ state: 'visible' });
      await page.mouse.click(target.x, target.y);
      await page.getByRole('dialog').waitFor({ state: 'visible' });
      assert.equal(await page.locator('#zone-title').innerText(), title);
      assert.ok(await page.locator('.zone-modal').evaluate(el => el.scrollWidth <= el.clientWidth), 'No dialog horizontal overflow');
      assert.equal(await page.locator('.progress-value').innerText(), `${++explored}/4`);
      await page.screenshot({ path: fileURLToPath(new URL(`${name}-${id}.png`, output)), fullPage: false });
      const citations = await page.locator('.lesson-sources a').evaluateAll((links) => links.map((link) => link.href));
      assert.ok(citations.length >= 1 && citations.every((url) => url.startsWith('https://')));
      for (let imageIndex = 0; imageIndex < 3; imageIndex++) {
        await page.locator('.carousel-dots button').nth(imageIndex).click();
        await page.waitForFunction(() => { const img = document.querySelector('.carousel-media img'); return img?.complete && img.naturalWidth > 0; });
      }
      await page.getByRole('button', { name: /Latihan.*0\/7/ }).click();
      const keys = { health: [1,0,1,2,0,1,2], transport: [2,1,2,0,1,2,0], industry: [0,0,1,2,0,1,2], education: [1,1,2,0,1,2,0] }[id];
      for (let i = 0; i < 7; i++) {
        await page.locator('.quiz-dots button').nth(i).click();
        await page.locator('.quiz-options button').nth(i === 0 ? (keys[i] + 1) % 3 : keys[i]).click();
        assert.equal(await page.locator('.quiz-options button:disabled').count(), 3);
        assert.match(await page.locator('.quiz-feedback strong').innerText(), i === 0 ? /Belum tepat/ : /Tepat/);
      }
      assert.match(await page.locator('.quiz-result h3').innerText(), /6 dari 7/);
      await page.screenshot({ path: fileURLToPath(new URL(`${name}-${id}-learning.png`, output)), fullPage: false });
      await page.getByRole('button', { name: 'Tutup detail zona' }).click();
      await page.locator('.zone-row').filter({ hasText: label }).click();
      assert.equal(await page.locator('#zone-title').innerText(), title);
      assert.equal(await page.locator('.progress-value').innerText(), `${explored}/4`, 'Repeat visits must not increase progress');
      await page.keyboard.press('Escape');
      await page.locator('canvas').scrollIntoViewIfNeeded();
    }
    for (const label of ['Bias diperiksa', 'Sumber teratribusi', 'AI diberi label']) await page.getByText(label, { exact: true }).click();
    assert.equal(await page.locator('input:checked').count(), 3);
    await page.getByRole('button', { name: /Kesehatan/ }).click();
    await page.mouse.click(4, 4);
    assert.equal(await page.getByRole('dialog').count(), 0, 'Backdrop closes dialog');
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'No horizontal overflow');
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForFunction(() => document.querySelector('.progress-value')?.textContent === '4/4');
    await page.locator('.zone-row').first().click();
    await page.getByRole('button', { name: /Latihan.*7\/7/ }).click();
    assert.match(await page.locator('.quiz-result h3').innerText(), /6 dari 7/);
    await page.getByRole('button', { name: 'Ulangi 7 soal' }).click();
    await page.locator('.quiz-dots button').nth(6).click();
    await page.locator('.quiz-options button').first().click();
    await page.reload({ waitUntil: 'networkidle' });
    await page.locator('.zone-row').first().click();
    await page.getByRole('button', { name: /Latihan.*1\/7/ }).click();
    assert.equal(await page.locator('.quiz-options button:disabled').count(), 0, 'Sparse unanswered slots stay unanswered after reload');
    await page.getByRole('button', { name: 'Tutup detail zona' }).click();
    if (mobile) await page.evaluate(() => { Element.prototype.requestFullscreen = () => Promise.reject(new Error('Unsupported')); });
    await page.getByRole('button', { name: 'Buka layar penuh' }).click();
    await page.locator('.map-expanded').waitFor();
    await page.getByRole('button', { name: 'Buka zona Pendidikan' }).click();
    await page.locator('dialog.zone-modal').waitFor();
    await page.screenshot({ path: fileURLToPath(new URL(`${name}-fullscreen-dialog.png`, output)), fullPage: false });
    await page.getByRole('button', { name: 'Tutup detail zona' }).click();
    await page.getByRole('button', { name: 'Keluar layar penuh' }).click();
    await page.locator('.map-expanded').waitFor({ state: 'detached' });
    assert.equal(await page.locator('[inert]').count(), 0);
    assert.deepEqual(errors, [], 'No browser errors');
    console.log(`Passed ${name}`);
    report.push({ name, viewport, metrics, errors, checks: 'mesh hover/click, correct modal, row parity, unique progress, close button/Escape/backdrop, ethics, citations, all 28 questions, 12 illustrations, locked answers, quiz reset, reload persistence including sparse answers, fullscreen and fallback, no overflow' });
    await page.close();
  }
  await writeFile(new URL('report.json', output), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally { await browser.close(); }
