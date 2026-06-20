const axios = require('axios');
const cheerio = require('cheerio');

async function testSearch(brand, flavor) {
    try {
        const query = encodeURIComponent(`Табак ${brand} ${flavor}`);
        let url = `https://s2b.ru/search/?q=${query}`;
        console.log(`Fetching ${url}`);
        let res = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        let $ = cheerio.load(res.data);
        let firstItem = $('.product-item, .catalog-item').first();
        if (firstItem.length) {
            console.log('Found on S2B!');
        } else {
            console.log('Not found on s2b, trying hookahmarket...');
            url = `https://hookahmarket.ru/search/?q=${query}`;
            res = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
            $ = cheerio.load(res.data);
            firstItem = $('.product-item, .item-card').first();
            if (firstItem.length) {
                console.log('Found on HookahMarket!');
                const img = firstItem.find('img').attr('src') || firstItem.find('img').attr('data-src');
                console.log(`Image: ${img}`);
            } else {
                console.log('Not found on hookahmarket either.');
            }
        }
    } catch (e) {
        console.error('Error:', e.message);
    }
}

testSearch('Chabacco', 'Фруктово-ягодный джем');
