const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function scrape() {
    try {
        const res = await axios.get('https://sebero.ru/catalog/');
        const $ = cheerio.load(res.data);
        
        const products = [];
        $('.product, .item, .catalog-item, [class*="product"]').each((i, el) => {
            const title = $(el).find('h3, h2, .title, [class*="name"]').text().trim();
            const img = $(el).find('img').attr('src');
            if (title && img) {
                products.push({ title, img });
            }
        });
        
        fs.writeFileSync('sebero_test.json', JSON.stringify(products, null, 2));
        console.log(`Found ${products.length} products. Saved to sebero_test.json`);
    } catch(e) {
        console.error(e.message);
    }
}
scrape();
