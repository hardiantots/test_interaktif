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
    const page = await browser.newPage({ viewport, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile });
    page.setDefaultTimeout(15000);
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    await page.goto('http://127.0.0.1:3000/?qa=1', { waitUntil: 'networkidle' });
    await page.waitForFunction(() => window.__cityAudit?.().zones.education?.target);
    await page.locator('canvas').scrollIntoViewIfNeeded();
    assert.equal(await page.locator('.scene-label').count(), 4);
    await page.screenshot({ path: fileURLToPath(new URL(`${name}.png`, output)), fullPage: true });
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
      assert.equal(await page.locator('.progress-value').innerText(), `${++explored}/4`);
      await page.screenshot({ path: fileURLToPath(new URL(`${name}-${id}.png`, output)), fullPage: true });
      const citations = await page.locator('.lesson-sources a').evaluateAll((links) => links.map((link) => link.href));
      assert.ok(citations.length >= 1 && citations.every((url) => url.startsWith('https://')));
      const correct = { health: 1, transport: 2, industry: 0, education: 1 }[id];
      await page.locator('.knowledge-check button').nth((correct + 1) % 3).click();
      assert.equal(await page.locator('.quiz-feedback strong').innerText(), 'Coba pertimbangkan lagi.');
      await page.locator('.knowledge-check button').nth(correct).click();
      assert.equal(await page.locator('.quiz-feedback strong').innerText(), 'Tepat.');
      await page.screenshot({ path: fileURLToPath(new URL(`${name}-${id}-learning.png`, output)), fullPage: true });
      await page.getByRole('button', { name: 'Tutup detail zona' }).click();
      await page.getByRole('button', { name: new RegExp(label) }).click();
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
    assert.deepEqual(errors, [], 'No browser errors');
    report.push({ name, viewport, metrics, errors, checks: 'mesh hover/click, correct modal, row parity, unique progress, close button/Escape/backdrop, ethics, citations, wrong/correct quiz answers, no overflow' });
    await page.close();
  }
  await writeFile(new URL('report.json', output), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally { await browser.close(); }
