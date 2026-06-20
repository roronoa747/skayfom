const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
        
        console.log('Navigating to sebero.ru/catalog');
        await page.goto('https://sebero.ru/catalog', { waitUntil: 'networkidle2' });
        const content = await page.content();
        console.log('Content length:', content.length);
        console.log('Title:', await page.title());
        
        const imgs = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('img')).map(img => img.src);
        });
        console.log('Images found:', imgs.length);
        
        await browser.close();
    } catch(e) {
        console.error(e.message);
    }
})();
