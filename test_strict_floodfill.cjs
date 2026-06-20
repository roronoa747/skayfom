const fs = require('fs');
const puppeteer = require('puppeteer');

const baseJarPath = 'C:\\Users\\ilyas\\.gemini\\antigravity-ide\\brain\\3d226963-4a66-4630-b499-145aa842bdcf\\deus_base_jar_1781987910633.png';
const baseJarBase64 = fs.readFileSync(baseJarPath).toString('base64');
const baseJarUri = `data:image/png;base64,${baseJarBase64}`;

async function testFloodFillStrict() {
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
            .container {
                width: 600px;
                height: 600px;
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            canvas {
                position: absolute;
                z-index: 2;
                width: 400px; /* Scale down the 1024x1024 jar */
                height: 400px;
            }
            .svg-overlay {
                position: absolute;
                top: 100px;
                left: 100px;
                z-index: 5;
                width: 400px;
                height: 400px;
                pointer-events: none;
            }
            .brand-text {
                font-family: 'Montserrat', sans-serif;
                font-weight: 800;
                font-size: 16px;
                fill: #ffffff;
                letter-spacing: 2px;
            }
            .flavor-text {
                font-family: 'Montserrat', sans-serif;
                font-weight: 900;
                font-size: 24px;
                fill: ${color}; 
            }
        </style>
    </head>
    <body>
        <div class="container" id="capture">
            <canvas id="jarCanvas" width="1024" height="1024"></canvas>
            <svg class="svg-overlay" viewBox="0 0 400 400">
                <defs>
                    <path id="curve-brand" d="M 60 170 Q 200 200 340 170" fill="transparent" />
                    <path id="curve-flavor" d="M 60 270 Q 200 300 340 270" fill="transparent" />
                </defs>
                <text class="brand-text">
                    <textPath href="#curve-brand" startOffset="50%" text-anchor="middle" dominant-baseline="middle">${brandText}</textPath>
                </text>
                <text class="flavor-text" textLength="240" lengthAdjust="spacingAndGlyphs">
                    <textPath href="#curve-flavor" startOffset="50%" text-anchor="middle" dominant-baseline="middle">${flavorText}</textPath>
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
                
                const width = canvas.width;
                const height = canvas.height;
                const imgData = ctx.getImageData(0, 0, width, height);
                const data = imgData.data;
                const visited = new Uint8Array(width * height);
                
                const stack = [[0, 0], [width-1, 0], [0, height-1], [width-1, height-1]];
                
                // STRICT TOLERANCE to prevent eating the jar
                const tolerance = 5; 
                
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
                    
                    // Also check for very dark grayscale pixels
                    if (r <= tolerance && g <= tolerance && b <= tolerance) {
                        data[i+3] = 0; // Make transparent
                        stack.push([x+1, y]);
                        stack.push([x-1, y]);
                        stack.push([x, y+1]);
                        stack.push([x, y-1]);
                    }
                }
                
                // A secondary pass to clean up semi-transparent anti-aliased black edges
                // using a simple alpha feathering technique
                for (let y = 1; y < height - 1; y++) {
                    for (let x = 1; x < width - 1; x++) {
                        const idx = y * width + x;
                        const i = idx * 4;
                        if (data[i+3] === 0) continue; // Already transparent
                        
                        // If it's a dark pixel AND adjacent to a transparent pixel, feather it
                        const r = data[i], g = data[i+1], b = data[i+2];
                        if (r < 25 && g < 25 && b < 25) {
                            let transNeighbors = 0;
                            if (data[((y-1)*width+x)*4+3] === 0) transNeighbors++;
                            if (data[((y+1)*width+x)*4+3] === 0) transNeighbors++;
                            if (data[(y*width+(x-1))*4+3] === 0) transNeighbors++;
                            if (data[(y*width+(x+1))*4+3] === 0) transNeighbors++;
                            
                            if (transNeighbors > 0) {
                                // Feather the edge based on darkness
                                data[i+3] = Math.max(0, (r+g+b)/3 * 5); // Very dark = mostly transparent
                            }
                        }
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
    await page.waitForFunction('window.jarLoaded === true', { timeout: 10000 });
    
    const element = await page.$('#capture');
    await element.screenshot({ path: 'test_strict_floodfill.png', omitBackground: true });
    
    await browser.close();
    console.log('Test strict floodfill saved.');
}

testFloodFillStrict();
