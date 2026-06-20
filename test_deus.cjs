const axios = require('axios');
const cheerio = require('cheerio');

async function testDeus() {
    try {
        const res = await axios.get('http://deustobacco.ru/');
        const $ = cheerio.load(res.data);
        const images = [];
        $('img').each((i, el) => {
            const src = $(el).attr('src');
            const alt = $(el).attr('alt') || '';
            images.push({ src, alt });
        });
        console.log(images.slice(0, 10));
    } catch(e) {
        console.error('Error:', e.message);
    }
}
testDeus();
