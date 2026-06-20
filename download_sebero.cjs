const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const sharp = require('sharp');

const catalogPath = path.join(__dirname, 'catalog_template.csv');
const outDir = path.join(__dirname, 'public', 'images', 'catalog');

// Ensure outDir exists
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

async function fetchSeberoImages() {
    console.log('Fetching Sebero catalog...');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    
    const urls = [
        'https://sebero.ru/catalog',
        'https://sebero.ru/limited',
        'https://sebero.ru/black',
        'https://sebero.ru/arctic-mix'
    ];
    
    let allProducts = [];
    
    for (const url of urls) {
        try {
            await page.goto(url, { waitUntil: 'networkidle2' });
            const products = await page.evaluate(() => {
                const items = document.querySelectorAll('.catalog-item, .item, .product, .t-item, .t-col, [class*="product"]');
                const res = [];
                for (const item of items) {
                    let title = item.querySelector('h1, h2, h3, h4, .title, .name, [class*="title"], [class*="name"]');
                    if (!title) title = item;
                    const text = title.textContent.trim().replace(/\s+/g, ' ');
                    const img = item.querySelector('img');
                    if (text && img && img.src) {
                        res.push({ title: text, src: img.src });
                    }
                }
                return res;
            });
            allProducts = allProducts.concat(products);
            console.log(`Fetched ${products.length} from ${url}`);
        } catch(e) {
            console.log(`Failed to fetch ${url}`);
        }
    }
    
    await browser.close();
    console.log(`Total found ${allProducts.length} images on Sebero.`);
    return allProducts;
}

async function bingImageSearch(query) {
    try {
        const url = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}`;
        const res = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const $ = cheerio.load(res.data);
        const imgEl = $('.iuscp').first().find('.mimg');
        let imgUrl = imgEl.attr('src') || imgEl.attr('data-src');
        if (imgUrl) {
            if (imgUrl.includes('?w=')) imgUrl = imgUrl.split('?')[0];
            return imgUrl;
        }
    } catch(e) {}
    return null;
}

async function processImage(url, id) {
    try {
        console.log(`Downloading ${url} for ID ${id}`);
        const response = await axios({ url, responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data, 'binary');
        const dest = path.join(outDir, `${id}.png`);
        await sharp(buffer).png().toFile(dest);
        console.log(`Saved ${dest}`);
        return true;
    } catch (e) {
        console.log(`Failed to process ${url}`);
        return false;
    }
}

async function run() {
    const seberoProducts = await fetchSeberoImages();
    const csvContent = fs.readFileSync(catalogPath, 'utf-8');
    const existingImages = new Set(fs.readdirSync(outDir).map(f => f.split('.')[0]));
    
    const lines = csvContent.split('\n');
    let count = 0;
    
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const row = line.match(/(?:\"([^\"]*)\"|([^,]*))(?:,|$)/g).map(s => s.replace(/,$/, '').replace(/^\"/, '').replace(/\"$/, ''));
        const id = row[0];
        const type = row[1];
        if (type !== 'Магазин' && type !== 'Аренда') continue;
        
        const brand = row[4];
        const flavor = row[5];
        
        if (brand.toLowerCase().includes('sebero') && id && !existingImages.has(id)) {
            const fLower = flavor.toLowerCase().split(' / ')[0].trim();
            let bestMatch = null;
            
            const synonyms = {
                'лимончело': ['лимончелло'],
                'fruit yogurt': ['фруктовый йогурт', 'йогурт'],
                'summer vibe': ['summer vibe', 'летний вайб'],
                'fruit tea': ['фруктовый чай'],
                'melon ron do': ['рондо', 'ron do'],
                'fruit smoothie': ['смузи', 'фруктовый смузи'],
                'pop star': ['поп звезда', 'поп-звезда', 'pop star'],
                'juicy shake': ['джуси шейк', 'juicy shake'],
                'arctic mix': ['arctic mix'],
                'ревень чёрная смородина': ['ревень-черная смородина', 'ревень'],
                'малина': ['malina', 'малина'],
                'киви': ['kiwi', 'киви'],
                'сочный персик': ['персик'],
                'цитрусовый шок': ['цитрус'],
                'маракуйя': ['маракуйя', 'passion'],
                'бабл-гам с цитрусом': ['бабл-гам', 'бабл гам', 'bubble'],
                'дыня абрикос ваниль': ['дыня', 'абрикос', 'ваниль'],
                'жвачка ловис': ['жвачка', 'ловис'],
                'дикие ягоды': ['wild berries', 'дикие ягоды'],
                'красный скитлс': ['скитлс', 'skittles'],
                'дюшес': ['дюшес', 'duchesse'],
                'фруктовый милкшейк': ['милкшейк'],
                'облепиховый чай': ['облепих'],
                'малиновый рафаэлло': ['рафаэлло', 'rafaello'],
                'ежевика': ['ежевика', 'blackberry'],
                'манго йогурт': ['манго', 'йогурт'],
                'сок мульти фрукт': ['мульти', 'сок']
            };
            
            const searchTerms = [fLower, ...(synonyms[fLower] || [])];
            
            for (const sp of seberoProducts) {
                const spTitle = sp.title.toLowerCase();
                if (searchTerms.some(term => spTitle.includes(term))) {
                    bestMatch = sp;
                    break;
                }
            }
            
            if (!bestMatch) {
                const words = fLower.split(/\s+/).filter(w => w.length > 2);
                for (const sp of seberoProducts) {
                    const spTitle = sp.title.toLowerCase();
                    if (words.length > 0 && words.every(w => spTitle.includes(w))) {
                        bestMatch = sp;
                        break;
                    }
                }
            }
            
            if (bestMatch) {
                console.log(`\nMatch found for Sebero ${flavor} -> ${bestMatch.title}`);
                await processImage(bestMatch.src, id);
                count++;
            } else {
                console.log(`\nNo match found on official site for Sebero: ${flavor}. Falling back to Bing...`);
                // Fallback to Bing
                let query = `Табак Sebero ${flavor}`;
                // append some context
                if (flavor.toLowerCase().match(/^[a-z\s]+$/)) {
                    query += ` банка`; // if english, append banka
                }
                const bingUrl = await bingImageSearch(query);
                if (bingUrl) {
                    console.log(`Bing match found for ${flavor}: ${bingUrl}`);
                    await processImage(bingUrl, id);
                    count++;
                } else {
                    console.log(`Bing search failed for ${flavor}`);
                }
            }
        }
    }
    
    console.log(`\nDone. Downloaded ${count} Sebero images.`);
}

run();
