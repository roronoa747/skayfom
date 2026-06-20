const fs = require('fs');
const puppeteer = require('puppeteer');

const baseJarPath = 'C:\\Users\\ilyas\\.gemini\\antigravity-ide\\brain\\3d226963-4a66-4630-b499-145aa842bdcf\\deus_base_jar_1781987910633.png';
const baseJarBase64 = fs.readFileSync(baseJarPath).toString('base64');
const baseJarUri = `data:image/png;base64,${baseJarBase64}`;

async function testPerfectMask() {
    console.log('Launching Puppeteer...');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 600, height: 800 });
    
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
                /* Add a grey grid background just to prove transparency */
                background-color: #333;
                background-image: linear-gradient(45deg, #444 25%, transparent 25%, transparent 75%, #444 75%, #444), 
                                  linear-gradient(45deg, #444 25%, transparent 25%, transparent 75%, #444 75%, #444);
                background-size: 20px 20px;
                background-position: 0 0, 10px 10px;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
            }
            .container {
                width: 600px;
                height: 800px;
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            
            /* The jar container exactly matches the jar bounds */
            .jar-container {
                position: relative;
                width: 475px;  /* maxX 751 - minX 276 = 475 */
                height: 627px; /* maxY 834 - minY 207 = 627 */
                /* Scale it down so it looks good */
                transform: scale(0.65);
                /* Precise border-radius for the cylinder */
                border-radius: 50px 50px 40px 40px / 20px 20px 30px 30px; 
                overflow: hidden;
            }
            
            .jar-image {
                position: absolute;
                left: -276px;
                top: -207px;
                width: 1024px;
                height: 1024px;
                background-image: url('${baseJarUri}');
                background-size: 1024px 1024px;
                background-repeat: no-repeat;
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
                opacity: 0.9;
            }
            .flavor-text {
                font-family: 'Montserrat', sans-serif;
                font-weight: 900;
                font-size: 38px;
                fill: ${color}; 
            }
        </style>
    </head>
    <body>
        <div class="container" id="capture">
            <div class="jar-container">
                <div class="jar-image"></div>
                <svg class="svg-overlay" viewBox="0 0 475 627">
                    <defs>
                        <!-- Top silver line is around Y=350 inside the 475x627 box -->
                        <!-- So brand goes above it at Y=280 -->
                        <path id="curve-brand" d="M 50 250 Q 237 280 425 250" fill="transparent" />
                        <!-- Flavor goes below it at Y=450 -->
                        <path id="curve-flavor" d="M 40 430 Q 237 470 435 430" fill="transparent" />
                    </defs>
                    
                    <text class="brand-text" textLength="340" lengthAdjust="spacingAndGlyphs">
                        <textPath href="#curve-brand" startOffset="50%" text-anchor="middle" dominant-baseline="middle">
                            ${brandText}
                        </textPath>
                    </text>
                    
                    <text class="flavor-text" textLength="370" lengthAdjust="spacingAndGlyphs">
                        <textPath href="#curve-flavor" startOffset="50%" text-anchor="middle" dominant-baseline="middle">
                            ${flavorText}
                        </textPath>
                    </text>
                </svg>
            </div>
        </div>
    </body>
    </html>
    `;
    
    await page.setContent(html);
    await page.evaluateHandle('document.fonts.ready');
    
    const element = await page.$('#capture');
    await element.screenshot({ path: 'test_perfect_mask.png', omitBackground: true });
    
    await browser.close();
    console.log('Test perfect mask saved to test_perfect_mask.png');
}

testPerfectMask();
