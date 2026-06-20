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
    
    // We will use a CSS-based smoke effect using a mix of radial gradients and blur to simulate smoke/fog
    // or just a really nice glow for now if smoke is too complex. 
    // Actually, let's use a nice cloud of box-shadows for a smoke effect!
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
            
            /* SVG Fractal Smoke */
            .smoke-bg {
                position: absolute;
                width: 500px;
                height: 500px;
                z-index: 1;
                opacity: 0.6;
                background-image: radial-gradient(circle at center, ${color} 0%, transparent 60%);
                filter: url(#smoke-filter) blur(2px);
                mask-image: radial-gradient(circle at center, black 0%, transparent 60%);
                -webkit-mask-image: radial-gradient(circle at center, black 0%, transparent 60%);
            }
            
            /* Glow behind jar */
            .glow-bg {
                position: absolute;
                width: 350px;
                height: 350px;
                background: radial-gradient(circle, ${color} 0%, transparent 70%);
                opacity: 0.8;
                z-index: 1;
                border-radius: 50%;
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
                filter: drop-shadow(0 30px 25px rgba(0,0,0,0.8));
            }
            
            /* Metallic Rim */
            .jar-rim {
                width: 354px;
                height: 104px;
                border-radius: 50%;
                background: linear-gradient(100deg, #111 0%, #3a3a3a 15%, #5a5a5a 25%, #2a2a2a 35%, #151515 50%, #111 65%, #4a4a4a 85%, #111 100%);
                position: absolute;
                top: -2px;
                left: -2px;
                z-index: 3;
                box-shadow: inset 0 -2px 5px rgba(0,0,0,0.9);
            }
            
            /* Metallic Lid Top */
            .lid-top {
                width: 350px;
                height: 100px;
                border-radius: 50%;
                background: radial-gradient(ellipse at 40% 30%, #555 0%, #222 40%, #0a0a0a 100%);
                box-shadow: 
                    inset 0 1px 2px rgba(255,255,255,0.4),
                    inset 0 -2px 10px rgba(0,0,0,0.8);
                position: absolute;
                top: 0;
                z-index: 4;
            }
            
            /* Gap between lid and body */
            .lid-gap {
                width: 352px;
                height: 102px;
                border-radius: 50%;
                background: #000;
                position: absolute;
                top: 10px;
                z-index: 2;
                box-shadow: 0 5px 10px rgba(0,0,0,0.8);
            }
            
            /* Metallic Body */
            .jar-body {
                width: 350px;
                height: 140px;
                background: linear-gradient(100deg, #111 0%, #3a3a3a 15%, #5a5a5a 25%, #2a2a2a 35%, #151515 50%, #111 65%, #4a4a4a 85%, #111 100%);
                position: absolute;
                top: 50px;
                border-bottom-left-radius: 175px 50px;
                border-bottom-right-radius: 175px 50px;
                z-index: 2;
                box-shadow: inset 0 -15px 25px rgba(0,0,0,0.9);
            }
            
            /* Highlight overlay for realism */
            .highlight-overlay {
                width: 350px;
                height: 140px;
                position: absolute;
                top: 50px;
                border-bottom-left-radius: 175px 50px;
                border-bottom-right-radius: 175px 50px;
                background: linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.8) 100%);
                z-index: 4;
                pointer-events: none;
            }
            
            .svg-overlay {
                position: absolute;
                top: 30px; /* Moved UP as user requested */
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
                font-size: 16px;
                fill: rgba(255,255,255,0.8);
                letter-spacing: 5px;
            }
            .flavor-text {
                font-family: 'Montserrat', sans-serif;
                font-weight: 900;
                font-size: 26px;
                fill: #fff;
            }
        </style>
    </head>
    <body>
        <svg width="0" height="0">
            <filter id="smoke-filter">
                <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="5" result="noise" />
                <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  1 0 0 0 0" in="noise" result="coloredNoise" />
                <feComposite operator="in" in="SourceGraphic" in2="coloredNoise" />
            </filter>
        </svg>
        <div class="container" id="capture">
            <div class="smoke-bg"></div>
            <div class="glow-bg"></div>
            <div class="jar">
                <div class="jar-rim"></div>
                <div class="lid-gap"></div>
                <div class="lid-top"></div>
                <div class="jar-body"></div>
                <div class="highlight-overlay"></div>
                <svg class="svg-overlay" viewBox="0 0 350 140">
                    <defs>
                        <!-- Curve matching the bottom border-radius (175px 50px) -->
                        <path id="curve" d="M 20 50 Q 175 100 330 50" fill="transparent" />
                        <path id="curve2" d="M 20 80 Q 175 130 330 80" fill="transparent" />
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
    await element.screenshot({ path: 'test_realistic_jar.png', omitBackground: true });
    
    await browser.close();
    console.log('Test realistic jar saved to test_realistic_jar.png');
}

testCSSJar();
