const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('Launch browser...');
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    locale: 'ru-RU',
    permissions: ['clipboard-read', 'clipboard-write']
  });
  const page = await context.newPage();

  console.log('Loading page...');
  await page.goto('https://docs.google.com/spreadsheets/d/1EpBXaSdDobu1M5d2U2HNC7lflFHAD0bholw0uIsXoqU/edit#gid=0');

  await page.waitForTimeout(5000); // wait for load

  // Read pristine CSV and convert to TSV
  const csvContent = fs.readFileSync(path.resolve(__dirname, '../catalog_template.csv'), 'utf8');
  let tsvContent = '';
  let inQuotes = false;
  for (let i = 0; i < csvContent.length; i++) {
      let char = csvContent[i];
      if (char === '"') {
          inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
          tsvContent += '\t';
      } else {
          tsvContent += char;
      }
  }

  // --- SHEET 1 (ASTANA) ---
  console.log('Clearing Sheet 1 (Astana)...');
  await page.keyboard.press('Control+a');
  await page.waitForTimeout(500);
  await page.keyboard.press('Delete');
  await page.waitForTimeout(1000);

  console.log('Focusing A1 on Sheet 1...');
  await page.keyboard.press('Control+Home');
  await page.waitForTimeout(1000);

  console.log('Copying TSV to clipboard...');
  await page.evaluate(async (text) => {
      await navigator.clipboard.writeText(text);
  }, tsvContent);
  await page.waitForTimeout(1000);

  console.log('Pasting data to Sheet 1...');
  await page.keyboard.press('Control+v');
  console.log('Waiting for paste to complete...');
  await page.waitForTimeout(10000);

  // --- SHEET 2 (TARAZ) ---
  console.log('Creating new sheet for Taraz (Shift+F11)...');
  await page.keyboard.press('Shift+F11');
  
  // Wait for UI to create sheet and update URL
  await page.waitForTimeout(3000);

  const currentUrl = page.url();
  console.log('New Sheet URL:', currentUrl);
  let tarazGid = '0';
  if (currentUrl.includes('gid=')) {
      tarazGid = currentUrl.split('gid=')[1];
  }

  console.log('Focusing A1 on Sheet 2...');
  await page.keyboard.press('Control+Home');
  await page.waitForTimeout(1000);

  console.log('Pasting data to Sheet 2...');
  await page.keyboard.press('Control+v');
  console.log('Waiting for paste to complete...');
  await page.waitForTimeout(10000);

  console.log('Done! Taraz GID is:', tarazGid);

  // Save the GID to a temp file so we can read it
  fs.writeFileSync(path.resolve(__dirname, 'taraz_gid.txt'), tarazGid);

  await browser.close();
})();
