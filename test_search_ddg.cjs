const axios = require('axios');
const cheerio = require('cheerio');

async function testSearch(brand, flavor) {
    try {
        const query = encodeURIComponent(`Табак ${brand} ${flavor} купить`);
        const url = `https://html.duckduckgo.com/html/?q=${query}`;
        
        console.log(`Fetching ${url}`);
        const res = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        const $ = cheerio.load(res.data);
        // DDG images might not be in the HTML version, it's mostly links. Let's see if there are images.
        const images = $('img.result__icon__img'); // Favicons usually
        // Actually, DDG has an image search API. Or let's just use Google Images search URL.
        const gUrl = `https://www.google.ru/search?q=${query}&tbm=isch`;
        const gRes = await axios.get(gUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        const g$ = cheerio.load(gRes.data);
        const firstImg = g$('img').eq(1); // 0 is logo usually
        console.log('Google Image SRC:', firstImg.attr('src'));
        
    } catch (e) {
        console.error('Error:', e.message);
    }
}

testSearch('Chabacco', 'Фруктово-ягодный джем');
