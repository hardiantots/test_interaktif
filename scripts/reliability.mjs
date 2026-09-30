import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
const base = 'http://127.0.0.1:3000';
const started = performance.now();
const responses = await Promise.all(Array.from({length:24}, async () => {
  const r = await fetch(base); assert.equal(r.status,200); assert.ok((await r.text()).includes('Future AI City')); return r.status;
}));
const browser = await chromium.launch({channel:'chrome',headless:true});
try {
 const a = await browser.newContext(), b = await browser.newContext();
 const first = await a.newPage(), other = await b.newPage();
 await first.goto(base); await other.goto(base);
 await first.locator('.zone-row').first().click();
 await first.getByRole('button',{name:/Latihan/}).click();
 await first.locator('.quiz-options button').first().click();
 await first.getByRole('button',{name:'Tutup detail zona'}).click();
 assert.equal(await other.locator('.progress-value').innerText(),'0/4');
 const sibling = await a.newPage(); await sibling.goto(base);
 await sibling.waitForFunction(() => document.querySelector('.progress-value')?.textContent === '1/4');
 await sibling.locator('.zone-row').nth(1).click();
 await first.waitForFunction(() => document.querySelector('.progress-value')?.textContent === '2/4');
 const blocked = await browser.newContext();
 await blocked.addInitScript(() => { Storage.prototype.setItem = () => { throw new Error('Storage blocked'); }; });
 const page = await blocked.newPage(); await page.goto(base);
 await page.locator('.zone-row').first().click();
 await page.getByRole('button',{name:'Tutup detail zona'}).click();
 assert.match(await page.locator('[role=status]').filter({hasText:'Penyimpanan browser'}).innerText(),/tidak tersedia/);
 const result = {concurrentLocalHttpRequests:responses.length,statuses:[...new Set(responses)],elapsedMs:Math.round(performance.now()-started),checks:['independent browser progress','same-browser tab synchronization','blocked storage remains usable'],limitation:'Local HTTP burst, not a 24-device WebGL or production capacity benchmark.'};
 await writeFile('docs/qa/reliability.json',JSON.stringify(result,null,2)); console.log(result);
} finally {await browser.close();}
