const fs = require('fs');
const puppeteer = require('puppeteer');

const baseJarPath = 'C:\\Users\\ilyas\\.gemini\\antigravity-ide\\brain\\3d226963-4a66-4630-b499-145aa842bdcf\\deus_base_jar_1781987910633.png';
const baseJarBase64 = fs.readFileSync(baseJarPath).toString('base64');
const baseJarUri = `data:image/png;base64,${baseJarBase64}`;

async function testMaskClip() {
    console.log('Launching Puppeteer...');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 500, height: 500 });
    
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
                width: 500px;
                height: 500px;
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            
            /* The jar container with clipping */
            .jar-container {
                position: absolute;
                width: 280px;  /* Width of the jar */
                height: 330px; /* Height of the jar */
                z-index: 2;
                border-radius: 20px; /* Slight rounding for the top/bottom cylinder edges */
                overflow: hidden;
            }
            
            .jar-image {
                width: 100%;
                height: 100%;
                /* We scale the background to zoom exactly onto the jar, cutting out the black background */
                background-image: url('${baseJarUri}');
                background-size: 135%; /* Zoom in */
                background-position: center 55%; /* Shift slightly to center the jar perfectly */
                background-repeat: no-repeat;
            }
            
            .svg-overlay {
                position: absolute;
                top: 0;
                left: 0;
                z-index: 5;
                width: 280px;
                height: 330px;
                pointer-events: none;
            }
            
            .brand-text {
                font-family: 'Montserrat', sans-serif;
                font-weight: 800;
                font-size: 15px;
                fill: #ffffff;
                letter-spacing: 2px;
                opacity: 0.9;
            }
            .flavor-text {
                font-family: 'Montserrat', sans-serif;
                font-weight: 900;
                font-size: 20px; /* Scaled down */
                fill: ${color}; /* Colored text */
            }
        </style>
    </head>
    <body>
        <div class="container" id="capture">
            <div class="jar-container">
                <div class="jar-image"></div>
                <svg class="svg-overlay" viewBox="0 0 280 330">
                    <defs>
                        <!-- Put brand ABOVE the silver line (around Y=130) -->
                        <path id="curve-brand" d="M 10 130 Q 140 150 270 130" fill="transparent" />
                        <!-- Put flavor BELOW the silver line (around Y=230) -->
                        <path id="curve-flavor" d="M 10 220 Q 140 240 270 220" fill="transparent" />
                    </defs>
                    
                    <text class="brand-text">
                        <textPath href="#curve-brand" startOffset="50%" text-anchor="middle" dominant-baseline="middle">
                            ${brandText}
                        </textPath>
                    </text>
                    
                    <text class="flavor-text">
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
    await element.screenshot({ path: 'test_mask_jar.png', omitBackground: true });
    
    await browser.close();
    console.log('Test mask jar saved to test_mask_jar.png');
}

testMaskClip();
