const fs = require('fs');
const puppeteer = require('puppeteer');

const baseJarPath = 'C:\\Users\\ilyas\\.gemini\\antigravity-ide\\brain\\3d226963-4a66-4630-b499-145aa842bdcf\\deus_base_jar_1781987910633.png';
const baseJarBase64 = fs.readFileSync(baseJarPath).toString('base64');
const baseJarUri = `data:image/png;base64,${baseJarBase64}`;

async function testCanvasClip() {
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
            canvas {
                position: absolute;
                z-index: 2;
                width: 300px; /* Scale down the 1024x1024 jar */
                height: 300px;
            }
            .svg-overlay {
                position: absolute;
                top: 100px; /* Match the canvas top */
                left: 100px; /* Match the canvas left */
                z-index: 5;
                width: 300px;
                height: 300px;
                pointer-events: none;
            }
            .brand-text {
                font-family: 'Montserrat', sans-serif;
                font-weight: 800;
                font-size: 14px;
                fill: #ffffff;
                letter-spacing: 2px;
                opacity: 0.8;
            }
            .flavor-text {
                font-family: 'Montserrat', sans-serif;
                font-weight: 900;
                font-size: 18px; /* SMALLER so it fits strictly inside the jar */
                fill: ${color}; /* Colored text */
            }
        </style>
    </head>
    <body>
        <div class="container" id="capture">
            <canvas id="jarCanvas" width="1024" height="1024"></canvas>
            <svg class="svg-overlay" viewBox="0 0 300 300">
                <defs>
                    <!-- Adjust curves so they fit inside the 300x300 jar display -->
                    <!-- The jar's metallic ring is roughly in the middle, around Y=150 in the 300x300 view. -->
                    <!-- We will put BRAND below the lid, ABOVE the ring (Y=100) -->
                    <path id="curve-brand" d="M 50 110 Q 150 130 250 110" fill="transparent" />
                    <!-- We will put FLAVOR BELOW the ring (Y=200) -->
                    <path id="curve-flavor" d="M 50 200 Q 150 220 250 200" fill="transparent" />
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
        
        <script>
            window.jarLoaded = false;
            const img = new Image();
            img.onload = () => {
                const canvas = document.getElementById('jarCanvas');
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                
                // Remove black background using flood fill
                const width = canvas.width;
                const height = canvas.height;
                const imgData = ctx.getImageData(0, 0, width, height);
                const data = imgData.data;
                const visited = new Uint8Array(width * height);
                
                const stack = [[0, 0], [width-1, 0], [0, height-1], [width-1, height-1]];
                
                // Increase tolerance to remove soft black edges
                const tolerance = 25; 
                
                let limit = width * height;
                while(stack.length > 0 && limit > 0) {
                    limit--;
                    const pt = stack.pop();
                    const x = pt[0], y = pt[1];
                    if (x < 0 || x >= width || y < 0 || y >= height) continue;
                    
                    const idx = y * width + x;
                    if (visited[idx]) continue;
                    visited[idx] = 1;
                    
                    const i = idx * 4;
                    const r = data[i], g = data[i+1], b = data[i+2];
                    
                    if (r <= tolerance && g <= tolerance && b <= tolerance) {
                        data[i+3] = 0; // Make transparent
                        stack.push([x+1, y]);
                        stack.push([x-1, y]);
                        stack.push([x, y+1]);
                        stack.push([x, y-1]);
                    }
                }
                
                ctx.putImageData(imgData, 0, 0);
                window.jarLoaded = true;
            };
            img.src = '${baseJarUri}';
        </script>
    </body>
    </html>
    `;
    
    await page.setContent(html);
    
    // Wait for the canvas to process
    await page.waitForFunction('window.jarLoaded === true', { timeout: 10000 });
    
    const element = await page.$('#capture');
    await element.screenshot({ path: 'test_perfect_jar.png', omitBackground: true });
    
    await browser.close();
    console.log('Test perfect jar saved to test_perfect_jar.png');
}

testCanvasClip();
