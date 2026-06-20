const axios = require('axios');
const cheerio = require('cheerio');

async function testYandex(query) {
    try {
        const url = `https://yandex.ru/images/search?text=${encodeURIComponent(query)}`;
        console.log('Fetching', url);
        const res = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        });
        const $ = cheerio.load(res.data);
        const img = $('.serp-item__thumb').first().attr('src');
        console.log('Found:', img);
    } catch(e) {
        console.error('Error:', e.message);
    }
}
testYandex('Табак Deus Pina Colada банка');
testYandex('Табак Chabacco Фруктово-ягодный джем');
