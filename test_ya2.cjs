const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('test_ya.html', 'utf8');
const $ = cheerio.load(html);

$('.serp-item').each((i, el) => {
    try {
        const data = JSON.parse($(el).attr('data-bem') || '{}');
        if (data['serp-item'] && data['serp-item'].thumb && data['serp-item'].thumb.url) {
            console.log('Thumb:', data['serp-item'].thumb.url);
        }
    } catch(e) {}
});
