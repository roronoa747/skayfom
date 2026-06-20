const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
        
        await page.goto('https://sebero.ru/catalog', { waitUntil: 'networkidle2' });
        
        const products = await page.evaluate(() => {
            const items = document.querySelectorAll('.catalog-item, .item, .product, .t-item, .t-col, [class*="product"]'); // typical classes
            const res = [];
            for (const item of items) {
                // Try to find the title
                let title = item.querySelector('h1, h2, h3, h4, .title, .name, [class*="title"], [class*="name"]');
                if (!title) {
                    // fallback to any text inside
                    title = item;
                }
                const text = title.textContent.trim();
                const img = item.querySelector('img');
                if (text && img && img.src) {
                    res.push({ title: text.substring(0, 50), src: img.src });
                }
            }
            return res;
        });
        
        console.log(JSON.stringify(products, null, 2));
        
        await browser.close();
    } catch(e) {
        console.error(e.message);
    }
})();
