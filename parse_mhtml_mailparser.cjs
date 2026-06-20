const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const sharp = require('sharp');
const simpleParser = require('mailparser').simpleParser;

const mhtmlPath = path.join(__dirname, 'deus_page.mhtml');
const mhtmlData = fs.readFileSync(mhtmlPath);

(async () => {
    try {
        const parsed = await simpleParser(mhtmlData);
        let htmlContent = parsed.html || parsed.textAsHtml;
        
        if (!htmlContent) {
            for (const att of parsed.attachments) {
                if (att.contentType === 'text/html') {
                    htmlContent = att.content.toString('utf-8');
                    break;
                }
            }
        }
        
        const $ = cheerio.load(htmlContent);
        const items = [];
        
        $('[class*="item"], [class*="card"], [class*="product"]').each((i, el) => {
            const text = $(el).text().replace(/\s+/g, ' ').trim();
            if (text.toLowerCase().includes('deus')) {
                const imgEl = $(el).find('img');
                const imgUrl = imgEl.attr('src') || imgEl.attr('data-src') || '';
                
                let title = '';
                $(el).find('*').each((j, child) => {
                    const c = $(child).attr('class') || '';
                    if (c.includes('name') || c.includes('title') || c.includes('product-card__title')) {
                        title = $(child).text().trim();
                    }
                });
                if (!title) title = text;
                
                items.push({ title: title, src: imgUrl, fullText: text });
            }
        });
        
        console.log(`Found ${items.length} product elements containing Deus.`);
        if (items.length > 0) {
            console.log(items.slice(0, 3));
        }

        const catalogPath = path.join(__dirname, 'catalog_template.csv');
        const outDir = path.join(__dirname, 'public', 'images', 'catalog');
        const existingImages = new Set(fs.readdirSync(outDir).map(f => f.split('.')[0]));
        
        const csvContent = fs.readFileSync(catalogPath, 'utf-8');
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
            
            if (brand.toLowerCase().includes('deus') && id && !existingImages.has(id)) {
                let fLower = flavor.toLowerCase().split(' / ')[0].trim();
                
                let bestMatch = null;
                for (const item of items) {
                    if (item.fullText.toLowerCase().includes(fLower)) {
                        bestMatch = item;
                        break;
                    }
                }
                
                if (bestMatch && bestMatch.src) {
                    console.log(`\nMatch: ${flavor} -> ${bestMatch.title}`);
                    let buffer = null;
                    
                    for (const att of parsed.attachments) {
                        const cid = 'cid:' + att.contentId;
                        if (bestMatch.src.includes(att.contentId) || cid === bestMatch.src) {
                            buffer = att.content;
                            break;
                        }
                        if (att.contentLocation && (bestMatch.src.includes(att.contentLocation) || att.contentLocation.includes(bestMatch.src))) {
                            buffer = att.content;
                            break;
                        }
                    }
                    
                    if (buffer) {
                        try {
                            const dest = path.join(outDir, `${id}.png`);
                            await sharp(buffer).png().toFile(dest);
                            console.log(`Saved ${dest}`);
                            count++;
                        } catch(e) {
                            console.log('Failed sharp');
                        }
                    } else {
                        console.log(`Image attachment not found for ${bestMatch.src}`);
                    }
                }
            }
        }
        
        console.log(`\nDone. Saved ${count} images.`);
    } catch(e) {
        console.error(e);
    }
})();
