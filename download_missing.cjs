const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const Jimp = require('jimp');

const catalogPath = path.join(__dirname, 'catalog_template.csv');
const outDir = path.join(__dirname, 'public', 'images', 'catalog');

async function bingImageSearch(query) {
    try {
        const url = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}`;
        const res = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        const $ = cheerio.load(res.data);
        const results = [];
        
        $('.iuscp').each((i, el) => {
            const imgEl = $(el).find('.mimg');
            let imgUrl = imgEl.attr('src') || imgEl.attr('data-src');
            if (imgUrl) {
                // Remove size limits to get higher quality if possible
                if (imgUrl.includes('?w=')) {
                    imgUrl = imgUrl.split('?')[0];
                }
                const mData = $(el).find('.iusc').attr('m');
                let title = '';
                if (mData) {
                    try {
                        const m = JSON.parse(mData);
                        title = m.t || m.desc || '';
                    } catch(e){}
                }
                results.push({
                    title: title,
                    image: imgUrl
                });
            }
        });
        return results;
    } catch (e) {
        console.error('Bing search failed:', e.message);
        return [];
    }
}

async function processImage(url, id) {
    try {
        console.log(`Downloading ${url} for ID ${id}`);
        const image = await Jimp.read(url);
        
        // Simple white background removal (thresholding)
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
            const r = this.bitmap.data[idx + 0];
            const g = this.bitmap.data[idx + 1];
            const b = this.bitmap.data[idx + 2];
            if (r > 240 && g > 240 && b > 240) {
                this.bitmap.data[idx + 3] = 0; 
            }
        });
        
        image.autocrop();
        
        const dest = path.join(outDir, `${id}.png`);
        await image.writeAsync(dest);
        console.log(`Saved ${dest}`);
        return true;
    } catch (e) {
        console.log(`Failed to process ${url}:`, e.message);
        return false;
    }
}

async function run() {
    const csvContent = fs.readFileSync(catalogPath, 'utf-8');
    const existingImages = new Set(fs.readdirSync(outDir).map(f => f.split('.')[0]));
    
    const lines = csvContent.split('\n');
    const missing = [];
    
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const row = line.match(/(?:\"([^\"]*)\"|([^,]*))(?:,|$)/g).map(s => s.replace(/,$/, '').replace(/^\"/, '').replace(/\"$/, ''));
        const id = row[0];
        const type = row[1];
        if (type !== 'Магазин' && type !== 'Аренда') continue;
        
        const brand = row[4];
        const flavor = row[5];
        if (id && !existingImages.has(id)) {
            missing.push({ id, brand, flavor });
        }
    }
    
    console.log(`Found ${missing.length} missing items.`);
    
    for (let idx = 0; idx < missing.length; idx++) {
        const item = missing[idx];
        console.log(`\n[${idx+1}/${missing.length}] Searching for: [${item.brand}] ${item.flavor} (ID: ${item.id})`);
        
        // Exact search keywords
        const query = `Табак ${item.brand} ${item.flavor} банка купить`;
        
        try {
            const results = await bingImageSearch(query);
            if (results && results.length > 0) {
                const bLower = item.brand.toLowerCase();
                const fLower = item.flavor.toLowerCase();
                
                let bestMatch = null;
                for (const res of results) {
                    const title = res.title.toLowerCase();
                    // To prevent downloading "Overdose Raspberry" for "Chabacco Raspberry"
                    if (title.includes(bLower) && title.includes(fLower)) {
                        bestMatch = res;
                        break;
                    }
                }
                
                // Relaxed match: if no exact match, just check if Brand and at least one word from flavor is there
                if (!bestMatch) {
                    const fWords = fLower.split(/\s+/).filter(w => w.length > 3); // words longer than 3 chars
                    for (const res of results) {
                        const title = res.title.toLowerCase();
                        if (title.includes(bLower)) {
                            if (fWords.length === 0 || fWords.some(w => title.includes(w))) {
                                bestMatch = res;
                                break;
                            }
                        }
                    }
                }

                // Super relaxed match: just take the first result since Bing is pretty accurate with our query
                if (!bestMatch) {
                    bestMatch = results[0];
                }
                
                if (bestMatch) {
                    console.log(`Match found: ${bestMatch.title || 'No Title'} (${bestMatch.image})`);
                    const success = await processImage(bestMatch.image, item.id);
                } else {
                    console.log('No exact text match in title. Skipping to avoid wrong brand/flavor.');
                }
            } else {
                console.log('No images found on Yandex.');
            }
        } catch (e) {
            console.error('Search error:', e.message);
        }
        
        // Wait 1.5 seconds to avoid captcha/ban
        await new Promise(r => setTimeout(r, 1500));
    }
    console.log('Done.');
}

run();
