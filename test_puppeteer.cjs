const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');
    
    const brand = 'Chabacco';
    const flavor = 'Фруктово-ягодный джем';
    const query = encodeURIComponent(`Табак ${brand} ${flavor}`);
    
    console.log('Navigating to HookahMarket...');
    await page.goto(`https://hookahmarket.ru/search/?q=${query}`, { waitUntil: 'networkidle2' });
    
    // Evaluate and extract image
    const result = await page.evaluate((b, f) => {
        const items = document.querySelectorAll('.product-item, .item-card, .product'); // Try typical classes
        for (const item of items) {
            const title = item.textContent || '';
            if (title.toLowerCase().includes(b.toLowerCase()) && title.toLowerCase().includes(f.toLowerCase())) {
                const img = item.querySelector('img');
                return {
                    title: title.trim().substring(0, 100),
                    imgSrc: img ? (img.getAttribute('src') || img.getAttribute('data-src')) : null
                };
            }
        }
        return null;
    }, brand, flavor);
    
    console.log(result);
    
    await browser.close();
})();
