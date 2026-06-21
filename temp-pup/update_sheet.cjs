const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ locale: 'ru-RU' });
  const page = await context.newPage();

  console.log('Navigating to Google Sheet...');
  await page.goto('https://docs.google.com/spreadsheets/d/1EpBXaSdDobu1M5d2U2HNC7lflFHAD0bholw0uIsXoqU/edit?usp=sharing');

  // Wait for the UI to load
  await page.waitForTimeout(5000);

  // Focus the A1 cell by clicking top left grid header or sending shortcut
  console.log('Focusing A1 cell...');
  // The first cell can usually be selected by pressing Home or clicking
  await page.keyboard.press('Control+Home');
  await page.waitForTimeout(1000);

  console.log('Reading local CSV...');
  const csvContent = fs.readFileSync(path.resolve(__dirname, '../catalog_template.csv'), 'utf8');
  
  // Actually pasting 600 rows into a spreadsheet might lag the browser. 
  // Let's try to copy it to clipboard and trigger Ctrl+V.
  // Playwright has an issue with direct clipboard writing in headed mode without permissions.
  // Instead, let's use the UI: File -> Import.
  
  console.log('Clicking File menu...');
  await page.click('div#docs-file-menu');
  await page.waitForTimeout(1000);

  console.log('Clicking Import...');
  // Look for menu item containing "Импортировать"
  await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('.goog-menuitem-content'));
    const importItem = items.find(el => el.textContent.includes('Импортировать') || el.textContent.includes('Import'));
    if (importItem) importItem.click();
  });

  await page.waitForTimeout(3000);

  console.log('Navigating to Upload tab...');
  // Find iframe of the picker
  const frames = page.frames();
  let pickerFrame = frames.find(f => f.url().includes('picker'));
  if (!pickerFrame) {
      console.log('Picker iframe not found! Falling back to paste method...');
      // Fallback: paste method
      await page.keyboard.press('Escape');
      await page.waitForTimeout(1000);
      await page.keyboard.press('Control+Home');
      await page.evaluate((data) => {
        const pasteEvent = new ClipboardEvent('paste', {
          clipboardData: new DataTransfer()
        });
        pasteEvent.clipboardData.setData('text/plain', data);
        document.dispatchEvent(pasteEvent);
      }, csvContent);
      console.log('Pasted data.');
      await page.waitForTimeout(10000);
      await browser.close();
      return;
  }

  // Click 'Upload' (Загрузка)
  await pickerFrame.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('div[role="tab"]'));
      const uploadTab = tabs.find(t => t.textContent.includes('Загрузка') || t.textContent.includes('Upload'));
      if (uploadTab) uploadTab.click();
  });
  await page.waitForTimeout(2000);

  console.log('Uploading file...');
  // Setup file chooser
  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    pickerFrame.click('button:has-text("Выбрать файл на устройстве"), button:has-text("Browse")').catch(() => {
      return pickerFrame.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Выбрать') || b.textContent.includes('Browse'));
        if (btn) btn.click();
      });
    })
  ]);
  await fileChooser.setFiles(path.resolve(__dirname, '../catalog_template.csv'));
  
  await page.waitForTimeout(5000);

  console.log('Selecting Replace Current Sheet...');
  // Now we are back to the main document context for the Import options dialog
  await page.evaluate(() => {
      // Find the select dropdown
      const selects = document.querySelectorAll('div[role="listbox"]');
      if (selects.length > 0) selects[0].click();
  });
  await page.waitForTimeout(1000);

  await page.evaluate(() => {
      // Click "Replace current sheet" (Заменить текущий лист)
      const options = Array.from(document.querySelectorAll('.goog-menuitem-content'));
      const replaceOption = options.find(el => el.textContent.includes('Заменить текущий лист') || el.textContent.includes('Replace current sheet'));
      if (replaceOption) replaceOption.click();
  });
  await page.waitForTimeout(1000);

  console.log('Clicking Import Data...');
  await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const importBtn = btns.find(b => b.textContent.includes('Импортировать данные') || b.textContent.includes('Import data'));
      if (importBtn) importBtn.click();
  });

  console.log('Waiting for import to finish...');
  await page.waitForTimeout(10000);
  console.log('Done!');
  await browser.close();
})();
