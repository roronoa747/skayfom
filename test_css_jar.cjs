const fs = require('fs');
const puppeteer = require('puppeteer');

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
            .glow-bg {
                position: absolute;
                width: 300px;
                height: 300px;
                background: radial-gradient(circle, ${color} 0%, transparent 60%);
                opacity: 0.6;
                z-index: 1;
            }
            .jar {
                position: absolute;
                width: 350px;
                height: 240px;
                z-index: 2;
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-top: 50px;
            }
            /* The lid of the jar */
            .lid-top {
                width: 350px;
                height: 100px;
                border-radius: 50%;
                background: radial-gradient(ellipse at top, #444 0%, #1a1a1a 80%);
                box-shadow: inset 0 2px 5px rgba(255,255,255,0.2);
                position: absolute;
                top: 0;
                z-index: 4;
            }
            /* The side of the jar */
            .jar-body {
                width: 350px;
                height: 140px;
                background: linear-gradient(90deg, #111 0%, #333 20%, #111 50%, #222 80%, #0a0a0a 100%);
                position: absolute;
                top: 50px;
                border-bottom-left-radius: 175px 50px;
                border-bottom-right-radius: 175px 50px;
                z-index: 3;
                box-shadow: inset 0 -10px 20px rgba(0,0,0,0.8), 0 20px 30px rgba(0,0,0,0.5);
            }
            .jar-rim {
                width: 354px;
                height: 104px;
                border-radius: 50%;
                background: linear-gradient(90deg, #222, #555, #222);
                position: absolute;
                top: -2px;
                left: -2px;
                z-index: 3;
            }
            
            .svg-overlay {
                position: absolute;
                top: 80px; /* Align with jar body */
                left: 0;
                z-index: 5;
                width: 350px;
                height: 140px;
                pointer-events: none;
            }
            
            /* Text glow */
            .brand-text {
                font-family: 'Montserrat', sans-serif;
                font-weight: 800;
                font-size: 14px;
                fill: rgba(255,255,255,0.6);
                letter-spacing: 4px;
            }
            .flavor-text {
                font-family: 'Montserrat', sans-serif;
                font-weight: 900;
                font-size: 24px;
                fill: #fff;
            }
        </style>
    </head>
    <body>
        <div class="container" id="capture">
            <div class="glow-bg"></div>
            <div class="jar">
                <div class="jar-rim"></div>
                <div class="lid-top"></div>
                <div class="jar-body"></div>
                <svg class="svg-overlay" viewBox="0 0 350 140">
                    <defs>
                        <!-- Curve matching the bottom border-radius (175px 50px) -->
                        <path id="curve" d="M 20 60 Q 175 110 330 60" fill="transparent" />
                        <path id="curve2" d="M 20 90 Q 175 140 330 90" fill="transparent" />
                        <filter id="neon">
                            <feGaussianBlur stdDeviation="3" result="blur"/>
                            <feMerge>
                                <feMergeNode in="blur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>
                    
                    <text class="brand-text">
                        <textPath href="#curve" startOffset="50%" text-anchor="middle" dominant-baseline="middle">
                            ${brandText}
                        </textPath>
                    </text>
                    
                    <text class="flavor-text" filter="url(#neon)">
                        <textPath href="#curve2" startOffset="50%" text-anchor="middle" dominant-baseline="middle">
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
    await element.screenshot({ path: 'test_css_jar.png', omitBackground: true });
    
    await browser.close();
    console.log('Test CSS jar saved to test_css_jar.png');
}

testCSSJar();
