const fs = require('fs');
const puppeteer = require('puppeteer');

const baseJarPath = 'C:\\Users\\ilyas\\.gemini\\antigravity-ide\\brain\\3d226963-4a66-4630-b499-145aa842bdcf\\deus_base_jar_1781987910633.png';
const baseJarBase64 = fs.readFileSync(baseJarPath).toString('base64');
const baseJarUri = `data:image/png;base64,${baseJarBase64}`;

async function generateUltimateJar() {
    console.log('Launching Puppeteer...');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 500, height: 700 });
    
    const color = '#ff3366'; // Red
    const brandText = 'DEATH PUNCH';
    const flavorText = 'КРАСНАЯ ЧЕРЕШНЯ';
    
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
            .container {
                width: 475px;
                height: 627px;
                position: relative;
                /* SCALE DOWN to fit on screen */
                transform: scale(0.6);
            }
            
            /* SVG Clip Path perfectly tracing the jar */
            .jar-image {
                position: absolute;
                left: 0;
                top: 0;
                width: 475px;
                height: 627px;
                /* Background is offset to precisely grab the jar from the original 1024x1024 image */
                background-image: url('${baseJarUri}');
                background-position: -276px -207px; /* exact jar coordinates */
                background-size: 1024px 1024px;
                background-repeat: no-repeat;
                /* We apply a perfect vector clip-path so absolutely ZERO background remains */
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
                font-size: 26px; /* Appropriate size */
                fill: #ffffff;
                letter-spacing: 2px;
            }
            .flavor-text {
                font-family: 'Montserrat', sans-serif;
                font-weight: 900;
                font-size: 34px; /* Scaled down */
                fill: ${color}; 
            }
        </style>
    </head>
    <body>
        <svg width="0" height="0">
            <defs>
                <clipPath id="jar-clip">
                    <!-- Perfect cylinder mask. Top curve, right straight, bottom curve, left straight -->
                    <path d="M 0 40 Q 237 0 475 40 L 475 580 Q 237 627 0 580 Z"></path>
                </clipPath>
            </defs>
        </svg>

        <div class="container" id="capture">
            <div class="jar-image"></div>
            <svg class="svg-overlay" viewBox="0 0 475 627">
                <defs>
                    <!-- Brand curve ABOVE silver ring (Y=260) -->
                    <path id="curve-brand" d="M 40 240 Q 237 280 435 240" fill="transparent" />
                    <!-- Flavor curve BELOW silver ring (Y=440) -->
                    <path id="curve-flavor" d="M 40 420 Q 237 460 435 420" fill="transparent" />
                </defs>
                
                <text class="brand-text" textLength="300" lengthAdjust="spacingAndGlyphs">
                    <textPath href="#curve-brand" startOffset="50%" text-anchor="middle" dominant-baseline="middle">
                        ${brandText}
                    </textPath>
                </text>
                
                <text class="flavor-text" textLength="340" lengthAdjust="spacingAndGlyphs">
                    <textPath href="#curve-flavor" startOffset="50%" text-anchor="middle" dominant-baseline="middle">
                        ${flavorText}
                    </textPath>
                </text>
            </svg>
        </div>
        <script>
            // Wait for fonts
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
    await element.screenshot({ path: 'ultimate_jar.png', omitBackground: true });
    
    await browser.close();
    console.log('Ultimate jar saved.');
}

generateUltimateJar();
