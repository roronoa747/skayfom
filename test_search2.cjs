const axios = require('axios');
const cheerio = require('cheerio');

async function testSearch(brand, flavor) {
    try {
        const query = encodeURIComponent(`${brand} ${flavor}`);
        const urls = [
            `https://hookah-cat.online/search/?search=${query}`,
            `https://kalyan-hut.ru/search/?query=${query}`
        ];
        
        for (const url of urls) {
            console.log(`Fetching ${url}`);
            try {
                const res = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
                const $ = cheerio.load(res.data);
                const img = $('img').eq(2).attr('src') || $('img').eq(3).attr('src');
                console.log('Sample IMG:', img);
                // Also look for specific product cards
                const cardImg = $('.product-card img, .product-item img, .catalog-card img').first().attr('src');
                if (cardImg) {
                    console.log('FOUND CARD IMG:', cardImg);
                }
            } catch(e) {
                console.log('Failed', url, e.message);
            }
        }
    } catch (e) {
        console.error('Error:', e.message);
    }
}

testSearch('Chabacco', 'Фруктово-ягодный джем');
