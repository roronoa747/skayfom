const fs = require('fs');
const puppeteer = require('puppeteer');

const baseJarPath = 'C:\\Users\\ilyas\\.gemini\\antigravity-ide\\brain\\3d226963-4a66-4630-b499-145aa842bdcf\\deus_base_jar_1781987910633.png';
const baseJarBase64 = fs.readFileSync(baseJarPath).toString('base64');
const baseJarUri = `data:image/png;base64,${baseJarBase64}`;

async function generateCornerJar() {
    console.log('Launching Puppeteer...');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 600, height: 600 });
    
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
                    <!-- Added strong corner rounding at the bottom left/right -->
                    <path d="
                        M 5 60 
                        Q 237 20 470 60 
                        L 470 560 
                        Q 470 585 440 595 
                        Q 237 620 35 595 
                        Q 5 585 5 560 
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
    await element.screenshot({ path: 'test_corner_jar.png', omitBackground: true });
    
    await browser.close();
    console.log('Corner jar saved.');
}

generateCornerJar();
