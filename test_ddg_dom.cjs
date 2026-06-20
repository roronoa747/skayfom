const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('ddg_dom.html', 'utf8');
const $ = cheerio.load(html);

const imgs = [];
$('img').each((i, el) => {
    const src = $(el).attr('src');
    if (src && src.includes('external-content')) imgs.push(src);
});
console.log('Total external images found:', imgs.length);
console.log(imgs.slice(0, 5));
