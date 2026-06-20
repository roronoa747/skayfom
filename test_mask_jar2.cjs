const fs = require('fs');
const puppeteer = require('puppeteer');

const baseJarPath = 'C:\\Users\\ilyas\\.gemini\\antigravity-ide\\brain\\3d226963-4a66-4630-b499-145aa842bdcf\\deus_base_jar_1781987910633.png';
const baseJarBase64 = fs.readFileSync(baseJarPath).toString('base64');
const baseJarUri = `data:image/png;base64,${baseJarBase64}`;

async function testMaskClip() {
    console.log('Launching Puppeteer...');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 400, height: 400 });
    
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
                /* Add a grey grid background JUST FOR TESTING so we can verify the jar is 100% transparent */
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
                width: 300px;
                height: 350px;
                position: relative;
            }
            
            /* The jar container with clipping */
            .jar-container {
                position: absolute;
                width: 260px;  /* Actual visible jar width */
                height: 330px; /* Actual visible jar height */
                left: 20px;
                top: 10px;
                z-index: 2;
                border-radius: 20px; /* Cuts off corners */
                overflow: hidden;
            }
            
            .jar-image {
                width: 100%;
                height: 100%;
                background-image: url('${baseJarUri}');
                background-size: 170%; /* Zooms past the black margins */
                background-position: center center;
                background-repeat: no-repeat;
            }
            
            .svg-overlay {
                position: absolute;
                top: 0;
                left: 0;
                z-index: 5;
                width: 260px;
                height: 330px;
                pointer-events: none;
            }
            
            .brand-text {
                font-family: 'Montserrat', sans-serif;
                font-weight: 800;
                font-size: 14px;
                fill: #ffffff;
                letter-spacing: 1px;
                opacity: 0.9;
            }
            .flavor-text {
                font-family: 'Montserrat', sans-serif;
                font-weight: 900;
                font-size: 18px; /* Safe size */
                fill: ${color}; /* Colored text */
            }
        </style>
    </head>
    <body>
        <div class="container" id="capture">
            <div class="jar-container">
                <div class="jar-image"></div>
                <svg class="svg-overlay" viewBox="0 0 260 330">
                    <defs>
                        <!-- Strong curve for brand: X from 30 to 230 (width 200) -->
                        <path id="curve-brand" d="M 30 110 Q 130 135 230 110" fill="transparent" />
                        <!-- Strong curve for flavor: X from 20 to 240 (width 220) -->
                        <path id="curve-flavor" d="M 10 200 Q 130 225 250 200" fill="transparent" />
                    </defs>
                    
                    <text class="brand-text">
                        <textPath href="#curve-brand" startOffset="50%" text-anchor="middle" dominant-baseline="middle">
                            ${brandText}
                        </textPath>
                    </text>
                    
                    <text class="flavor-text" textLength="220" lengthAdjust="spacingAndGlyphs">
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
    // Save WITH background so the grid is visible! This proves transparency!
    await element.screenshot({ path: 'test_mask_jar2.png', omitBackground: false });
    
    await browser.close();
    console.log('Test mask jar saved to test_mask_jar2.png');
}

testMaskClip();
