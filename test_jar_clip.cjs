const fs = require('fs');
const puppeteer = require('puppeteer');

const baseJarPath = 'C:\\Users\\ilyas\\.gemini\\antigravity-ide\\brain\\3d226963-4a66-4630-b499-145aa842bdcf\\deus_base_jar_1781987910633.png';
const baseJarBase64 = fs.readFileSync(baseJarPath).toString('base64');
const baseJarUri = `data:image/png;base64,${baseJarBase64}`;

async function testCSSJar() {
    console.log('Launching Puppeteer...');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 500, height: 500 });
    
    const color = '#ff3366'; // Red glow
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
            
            /* Clean, elegant glow behind the jar */
            .glow-bg {
                position: absolute;
                width: 400px;
                height: 400px;
                background: radial-gradient(circle, ${color} 0%, transparent 60%);
                opacity: 0.3;
                z-index: 1;
                border-radius: 50%;
            }
            
            /* The jar container with clipping */
            .jar-container {
                position: absolute;
                width: 260px;
                height: 340px;
                z-index: 2;
                border-radius: 40px; /* Smooth corners to fake cylinder */
                overflow: hidden;
                box-shadow: inset 0 0 20px rgba(0,0,0,1); /* Darken edges */
            }
            
            .jar-image {
                position: absolute;
                top: -30px; /* Adjust to crop out the black background margins */
                left: -70px;
                width: 400px;
                height: 400px;
                background-image: url('${baseJarUri}');
                background-size: cover;
                background-position: center;
            }
            
            .svg-overlay {
                position: absolute;
                top: 0;
                left: 0;
                z-index: 5;
                width: 260px;
                height: 340px;
                pointer-events: none;
            }
            
            .brand-text {
                font-family: 'Montserrat', sans-serif;
                font-weight: 800;
                font-size: 14px;
                fill: rgba(255,255,255,0.7);
                letter-spacing: 4px;
            }
            .flavor-text {
                font-family: 'Montserrat', sans-serif;
                font-weight: 900;
                font-size: 26px;
                fill: ${color}; /* Color the text itself! */
            }
        </style>
    </head>
    <body>
        <div class="container" id="capture">
            <div class="glow-bg"></div>
            <div class="jar-container">
                <div class="jar-image"></div>
                <svg class="svg-overlay" viewBox="0 0 260 340">
                    <defs>
                        <!-- Slight curve across the middle of the jar -->
                        <path id="curve-brand" d="M 20 180 Q 130 200 240 180" fill="transparent" />
                        <path id="curve-flavor" d="M 10 210 Q 130 230 250 210" fill="transparent" />
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
    await element.screenshot({ path: 'test_real_jar_clip.png', omitBackground: true });
    
    await browser.close();
    console.log('Test clipped jar saved to test_real_jar_clip.png');
}

testCSSJar();
