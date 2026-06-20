const fs = require('fs');
const puppeteer = require('puppeteer');

const baseJarPath = 'C:\\Users\\ilyas\\.gemini\\antigravity-ide\\brain\\3d226963-4a66-4630-b499-145aa842bdcf\\deus_base_jar_1781987910633.png';
const baseJarBase64 = fs.readFileSync(baseJarPath).toString('base64');
const baseJarUri = `data:image/png;base64,${baseJarBase64}`;

async function findBounds() {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 1024, height: 1024 });
    
    const html = `
    <!DOCTYPE html>
    <html>
    <body>
        <canvas id="c" width="1024" height="1024"></canvas>
        <script>
            window.bounds = null;
            const img = new Image();
            img.onload = () => {
                const canvas = document.getElementById('c');
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                const data = ctx.getImageData(0, 0, 1024, 1024).data;
                
                let minX = 1024, maxX = 0, minY = 1024, maxY = 0;
                
                for(let y = 0; y < 1024; y++) {
                    for(let x = 0; x < 1024; x++) {
                        const i = (y * 1024 + x) * 4;
                        const r = data[i], g = data[i+1], b = data[i+2];
                        // If it's brighter than very dark gray, it's the jar
                        if (r > 15 || g > 15 || b > 15) {
                            if (x < minX) minX = x;
                            if (x > maxX) maxX = x;
                            if (y < minY) minY = y;
                            if (y > maxY) maxY = y;
                        }
                    }
                }
                window.bounds = {minX, maxX, minY, maxY};
            };
            img.src = '${baseJarUri}';
        </script>
    </body>
    </html>
    `;
    
    await page.setContent(html);
    await page.waitForFunction('window.bounds !== null');
    const bounds = await page.evaluate(() => window.bounds);
    console.log(JSON.stringify(bounds));
    await browser.close();
}

findBounds();
