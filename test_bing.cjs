const axios = require('axios');
const cheerio = require('cheerio');

async function testBing(query) {
    try {
        const url = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}`;
        console.log('Fetching', url);
        const res = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        const $ = cheerio.load(res.data);
        const img = $('.mimg').first().attr('src') || $('.mimg').first().attr('data-src');
        console.log('Found Image:', img);
    } catch(e) {
        console.log('Error', e.message);
    }
}

testBing('Табак Chabacco Фруктово-ягодный джем');
