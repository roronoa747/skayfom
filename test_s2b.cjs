const axios = require('axios');
const cheerio = require('cheerio');

async function checkPiterSmoke() {
    try {
        const url = 'https://pitersmoke.ru/search/?q=deus+pina';
        console.log('Fetching', url);
        const res = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        console.log('Status:', res.status);
        const $ = cheerio.load(res.data);
        const products = [];
        $('.product-item').each((i, el) => {
            const title = $(el).find('.product-item-title').text().trim();
            const img = $(el).find('img').attr('src') || $(el).find('img').attr('data-src');
            products.push({ title, img });
        });
        console.log('Products found:', products);
    } catch(e) {
        console.error('Error:', e.message);
    }
}
checkPiterSmoke();
