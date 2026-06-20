const axios = require('axios');
const cheerio = require('cheerio');

async function checkDeusRu() {
    const res = await axios.get('http://deustobacco.ru/');
    const $ = cheerio.load(res.data);
    const divs = [];
    $('[style*="background-image"]').each((i, el) => {
        divs.push($(el).attr('style'));
    });
    console.log(divs.filter(d => d.includes('url')).slice(0, 5));
}
checkDeusRu();
