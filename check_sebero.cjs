const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function checkCatalog() {
    try {
        const res = await axios.get('https://sebero.ru/', {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const $ = cheerio.load(res.data);
        const links = [];
        $('a').each((i, el) => {
            const href = $(el).attr('href');
            if (href && href.includes('catalog')) {
                links.push(href);
            }
        });
        console.log('Catalog links found on homepage:', [...new Set(links)]);
    } catch(e) {
        console.error(e.message);
    }
}
checkCatalog();
