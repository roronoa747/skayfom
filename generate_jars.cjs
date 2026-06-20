const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const catalogPath = path.join(__dirname, 'catalog_template.csv');
const outDir = path.join(__dirname, 'public', 'images', 'catalog');
const baseJarPath = 'C:\\Users\\ilyas\\.gemini\\antigravity-ide\\brain\\3d226963-4a66-4630-b499-145aa842bdcf\\deus_base_jar_1781987910633.png';

// Convert image to base64 to embed in HTML
const baseJarBase64 = fs.readFileSync(baseJarPath).toString('base64');
const baseJarUri = `data:image/png;base64,${baseJarBase64}`;

const colorMap = {
    'клубника': '#ff3366', 'strawberry': '#ff3366', 'малина': '#ff0055',
    'вишня': '#cc0000', 'cherry': '#cc0000', 'яблоко': '#66cc00', 'apple': '#66cc00',
    'мята': '#00ffcc', 'mint': '#00ffcc', 'лимон': '#ffcc00', 'lemon': '#ffcc00',
    'апельсин': '#ff9900', 'orange': '#ff9900', 'грейпфрут': '#ff6666',
    'ананас': '#ffcc33', 'pineapple': '#ffcc33', 'манго': '#ffaa00', 'mango': '#ffaa00',
    'персик': '#ff9966', 'peach': '#ff9966', 'виноград': '#9933cc', 'grape': '#9933cc',
    'черника': '#3333ff', 'blueberry': '#3333ff', 'арбуз': '#ff3366', 'watermelon': '#ff3366',
    'дыня': '#ffcc66', 'melon': '#ffcc66', 'кола': '#663300', 'cola': '#663300',
    'pina colada': '#ffff99', 'vanilla': '#ffffcc', 'шоколад': '#663300'
};

function getColor(flavor) {
    const fLower = flavor.toLowerCase();
    for (const [key, color] of Object.entries(colorMap)) {
        if (fLower.includes(key)) return color;
    }
    return '#8888ff'; // default blue-ish glow
}

async function generateMissingImages() {
    console.log('Reading CSV...');
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
            missing.push({ id, brand, flavor: flavor.split('/')[0].trim() });
        }
    }
    
    console.log(`Found ${missing.length} missing images.`);
    if (missing.length === 0) return;
    
    console.log('Launching Puppeteer...');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 800, height: 800 });
    
    for (let i = 0; i < missing.length; i++) {
        const item = missing[i];
        const color = getColor(item.flavor);
        const flavorText = item.flavor.toUpperCase();
        const brandText = item.brand.toUpperCase();
        
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@800;900&display=swap" rel="stylesheet">
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    background-color: #000;
                    width: 500px;
                    height: 500px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    overflow: hidden;
                    position: relative;
                }
                .glow {
                    position: absolute;
                    width: 300px;
                    height: 300px;
                    background: radial-gradient(circle, ${color} 0%, transparent 70%);
                    opacity: 0.5;
                    mix-blend-mode: screen;
                    z-index: 1;
                }
                .jar {
                    position: absolute;
                    width: 400px;
                    height: 400px;
                    background-image: url('${baseJarUri}');
                    background-size: cover;
                    background-position: center;
                    z-index: 2;
                }
                .label {
                    position: absolute;
                    z-index: 3;
                    top: 280px;
                    width: 100%;
                    text-align: center;
                    font-family: 'Montserrat', sans-serif;
                    transform: scaleY(0.9) skewX(-2deg); /* slight perspective */
                }
                .brand {
                    font-size: 16px;
                    color: rgba(255, 255, 255, 0.7);
                    letter-spacing: 4px;
                    margin-bottom: 5px;
                }
                .flavor {
                    font-size: 26px;
                    color: #fff;
                    font-weight: 900;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    text-shadow: 0 0 10px ${color}, 0 0 20px ${color};
                }
                .container {
                    width: 500px;
                    height: 500px;
                    position: relative;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            </style>
        </head>
        <body>
            <div class="container" id="capture">
                <div class="glow"></div>
                <div class="jar"></div>
                <div class="label">
                    <div class="brand">${brandText}</div>
                    <div class="flavor">${flavorText}</div>
                </div>
            </div>
        </body>
        </html>
        `;
        
        await page.setContent(html);
        await page.evaluateHandle('document.fonts.ready');
        
        const element = await page.$('#capture');
        const dest = path.join(outDir, `${item.id}.png`);
        await element.screenshot({ path: dest });
        
        if (i % 20 === 0) console.log(`Generated ${i}/${missing.length}...`);
    }
    
    await browser.close();
    console.log(`Successfully generated all ${missing.length} missing images!`);
}

generateMissingImages();
