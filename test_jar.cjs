const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const outDir = path.join(__dirname, 'public', 'images', 'catalog');
const baseJarPath = 'C:\\Users\\ilyas\\.gemini\\antigravity-ide\\brain\\3d226963-4a66-4630-b499-145aa842bdcf\\wide_jar_1781988210530.png';

const baseJarBase64 = fs.readFileSync(baseJarPath).toString('base64');
const baseJarUri = `data:image/png;base64,${baseJarBase64}`;

async function generateTest() {
    console.log('Launching Puppeteer...');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 800, height: 800 });
    
    const color = '#ff3366'; // Red glow
    const brandText = 'DEUS';
    const flavorText = 'PINA COLADA';
    
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
            }
            .container {
                width: 500px;
                height: 500px;
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .glow-bg {
                position: absolute;
                width: 400px;
                height: 400px;
                background: radial-gradient(circle, ${color} 0%, transparent 60%);
                opacity: 0.4;
                mix-blend-mode: screen;
                z-index: 1;
            }
            .jar {
                position: absolute;
                width: 450px;
                height: 450px;
                background-image: url('${baseJarUri}');
                background-size: cover;
                background-position: center;
                z-index: 2;
                border-radius: 50%; /* Just to clip if needed */
                box-shadow: inset 0 0 50px rgba(0,0,0,0.8); /* Add some inner shadow */
            }
            /* Add an interesting reflection or styling to the jar */
            .jar::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(0,0,0,0.5) 100%);
                pointer-events: none;
            }
            .svg-overlay {
                position: absolute;
                z-index: 3;
                width: 450px;
                height: 450px;
                pointer-events: none;
            }
        </style>
    </head>
    <body>
        <div class="container" id="capture">
            <div class="glow-bg"></div>
            <div class="jar"></div>
            <svg class="svg-overlay" viewBox="0 0 450 450">
                <defs>
                    <!-- Arc path for the text to follow -->
                    <path id="curve" d="M 50 250 Q 225 320 400 250" fill="transparent" />
                    <!-- Filter for neon text glow -->
                    <filter id="neon" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                
                <text font-family="Montserrat" font-weight="800" font-size="16" fill="rgba(255,255,255,0.7)" letter-spacing="4">
                    <textPath href="#curve" startOffset="50%" text-anchor="middle" dominant-baseline="middle">
                        ${brandText}
                    </textPath>
                </text>
                
                <!-- Flavor text slightly below the brand text, using the same curve but offset -->
                <path id="curve2" d="M 50 280 Q 225 350 400 280" fill="transparent" />
                <text font-family="Montserrat" font-weight="900" font-size="28" fill="#fff" filter="url(#neon)">
                    <textPath href="#curve2" startOffset="50%" text-anchor="middle" dominant-baseline="middle">
                        ${flavorText}
                    </textPath>
                </text>
            </svg>
        </div>
    </body>
    </html>
    `;
    
    await page.setContent(html);
    await page.evaluateHandle('document.fonts.ready');
    
    const element = await page.$('#capture');
    await element.screenshot({ path: 'test_jar.png' });
    
    await browser.close();
    console.log('Test image saved to test_jar.png');
}

generateTest();
