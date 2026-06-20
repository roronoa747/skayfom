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
    'вишня': '#cc0000', 'cherry': '#cc0000', 'черешня': '#ff3366',
    'яблоко': '#66cc00', 'apple': '#66cc00', 'мята': '#00ffcc', 'mint': '#00ffcc', 
    'лимон': '#ffcc00', 'lemon': '#ffcc00', 'апельсин': '#ff9900', 'orange': '#ff9900', 
    'грейпфрут': '#ff6666', 'ананас': '#ffcc33', 'pineapple': '#ffcc33', 
    'манго': '#ffaa00', 'mango': '#ffaa00', 'персик': '#ff9966', 'peach': '#ff9966', 
    'виноград': '#9933cc', 'grape': '#9933cc', 'черника': '#3333ff', 'blueberry': '#3333ff', 
    'арбуз': '#ff3366', 'watermelon': '#ff3366', 'дыня': '#ffcc66', 'melon': '#ffcc66', 
    'кола': '#663300', 'cola': '#663300', 'pina colada': '#ffff99', 
    'vanilla': '#ffffcc', 'шоколад': '#663300'
};

function getColor(flavor) {
    const fLower = flavor.toLowerCase();
    for (const [key, color] of Object.entries(colorMap)) {
        if (fLower.includes(key)) return color;
    }
    return '#ff3366'; // Default color
}

async function generateMissingImages() {
    console.log('Reading CSV...');
    let csvContent;
    try {
        csvContent = fs.readFileSync(catalogPath, 'utf8');
        // If it's garbled, fallback
        if (csvContent.includes('')) {
            csvContent = fs.readFileSync(catalogPath, 'latin1');
            const iconv = require('iconv-lite');
            csvContent = iconv.decode(fs.readFileSync(catalogPath), 'windows-1251');
        }
    } catch(e) {
        csvContent = fs.readFileSync(catalogPath, 'utf8');
    }
    
    const existingImages = new Set(fs.readdirSync(outDir).filter(f => f.endsWith('.png')).map(f => f.split('.')[0]));
    
    const lines = csvContent.split('\\n');
    if (lines.length === 1) {
        // Handle alternative line endings
        csvContent.split('\\r\\n');
    }
    const missing = [];
    
    const allRows = csvContent.split(/\\r?\\n/);
    for (let i = 1; i < allRows.length; i++) {
        const line = allRows[i].trim();
        if (!line) continue;
        const row = line.match(/(?:\"([^\"]*)\"|([^,]*))(?:,|$)/g).map(s => s.replace(/,$/, '').replace(/^\"/, '').replace(/\"$/, ''));
        const id = row[0];
        const type = row[1];
        if (type !== 'Табак' && type !== 'Бестабачная' && type !== '???' && type !== '????') continue;
        
        const brand = row[4] || '';
        const flavorFull = row[5] || '';
        
        if (id) {
            missing.push({ id, brand, flavor: flavorFull.split('/')[0].trim() });
        }
    }
    
    console.log(`Found ${missing.length} missing images.`);
    if (missing.length === 0) return;
    
    console.log('Launching Puppeteer...');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 600, height: 600 });
    
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
                    background-color: transparent;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                }
                .wrapper {
                    width: 500px;
                    height: 500px;
                    position: relative;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .container {
                    width: 475px;
                    height: 627px;
                    position: relative;
                    transform: scale(0.55);
                }
                
                .jar-image {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 475px;
                    height: 627px;
                    background-image: url('${baseJarUri}');
                    background-position: -276px -207px; 
                    background-size: 1024px 1024px;
                    background-repeat: no-repeat;
                    clip-path: url(#jar-clip);
                }
                
                .svg-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    z-index: 5;
                    width: 475px;
                    height: 627px;
                    pointer-events: none;
                }
                
                .brand-text {
                    font-family: 'Montserrat', sans-serif;
                    font-weight: 800;
                    font-size: 26px;
                    fill: #ffffff;
                    letter-spacing: 2px;
                }
                .flavor-text {
                    font-family: 'Montserrat', sans-serif;
                    font-weight: 900;
                    font-size: 34px;
                    fill: ${color}; 
                }
            </style>
        </head>
        <body>
            <svg width="0" height="0">
                <defs>
                    <clipPath id="jar-clip">
                        <path d="
                            M 15 40 
                            Q 237 0 460 40 
                            L 460 550 
                            Q 460 580 420 595 
                            Q 237 615 55 595 
                            Q 15 580 15 550 
                            Z"></path>
                    </clipPath>
                </defs>
            </svg>

            <div class="wrapper" id="capture">
                <div class="container">
                    <div class="jar-image"></div>
                    <svg class="svg-overlay" viewBox="0 0 475 627">
                        <defs>
                            <path id="curve-brand" d="M 40 240 Q 237 280 435 240" fill="transparent" />
                            <!-- Lowered by 15px -->
                            <path id="curve-flavor" d="M 40 435 Q 237 475 435 435" fill="transparent" />
                        </defs>
                        
                        <text class="brand-text" textLength="300" lengthAdjust="spacingAndGlyphs">
                            <textPath href="#curve-brand" startOffset="50%" text-anchor="middle" dominant-baseline="middle">
                                ${brandText}
                            </textPath>
                        </text>
                        
                        <!-- Added textLength 340 to force all long names to fit inside the jar -->
                        <text class="flavor-text" textLength="340" lengthAdjust="spacingAndGlyphs">
                            <textPath href="#curve-flavor" startOffset="50%" text-anchor="middle" dominant-baseline="middle">
                                ${flavorText}
                            </textPath>
                        </text>
                    </svg>
                </div>
            </div>
            <script>
                document.fonts.ready.then(() => {
                    window.ready = true;
                });
            </script>
        </body>
        </html>
        `;
        
        await page.setContent(html);
        await page.waitForFunction('window.ready === true');
        
        const element = await page.$('#capture');
        const dest = path.join(outDir, `${item.id}.png`);
        await element.screenshot({ path: dest, omitBackground: true });
        
        if (i % 20 === 0) console.log(`Generated ${i}/${missing.length}...`);
    }
    
    await browser.close();
    console.log('Successfully generated all missing images!');
}

generateMissingImages();
