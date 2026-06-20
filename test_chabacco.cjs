const axios = require('axios');
const cheerio = require('cheerio');

async function testChabacco() {
    try {
        const res = await axios.get('https://chabacco.ru/flavors/'); // or catalog
        const $ = cheerio.load(res.data);
        const images = [];
        $('img').each((i, el) => {
            const src = $(el).attr('src');
            const alt = $(el).attr('alt') || '';
            if (src) images.push({ src, alt });
        });
        console.log(images.slice(0, 10));
    } catch(e) {
        console.error('Error:', e.message);
    }
}
testChabacco();
