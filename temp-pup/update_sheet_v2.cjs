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
  await page.goto('https://docs.google.com/spreadsheets/d/1EpBXaSdDobu1M5d2U2HNC7lflFHAD0bholw0uIsXoqU/edit?usp=sharing');

  await page.waitForTimeout(5000); // wait for load

  // Read CSV and convert to TSV (Tab Separated Values) 
  // so Google Sheets puts columns correctly without prompt
  console.log('Reading and converting CSV to TSV...');
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

  // Click on the top-left cell header (the empty box above row 1 and left of col A) to select everything
  // Then press Delete to clear the sheet.
  console.log('Clearing sheet...');
  await page.keyboard.press('Control+a');
  await page.waitForTimeout(500);
  await page.keyboard.press('Delete');
  await page.waitForTimeout(1000);

  // Focus A1
  console.log('Focusing A1...');
  await page.keyboard.press('Control+Home');
  await page.waitForTimeout(1000);

  // Write TSV to clipboard
  console.log('Copying TSV to clipboard...');
  await page.evaluate(async (text) => {
      await navigator.clipboard.writeText(text);
  }, tsvContent);
  await page.waitForTimeout(1000);

  console.log('Pasting data...');
  // Use Shift+Insert as an alternative to Ctrl+V just in case, but Ctrl+V is standard
  await page.keyboard.press('Control+v');

  // Wait for Google to process the large paste
  console.log('Waiting for paste to complete...');
  await page.waitForTimeout(15000);

  console.log('Done!');
  await browser.close();
})();
