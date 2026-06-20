const puppeteer = require('puppeteer');

async function testDDGPuppeteer(query) {
    console.log('Searching DDG for:', query);
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    try {
        await page.goto(`https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`);
        await new Promise(r => setTimeout(r, 5000));
        await page.screenshot({ path: 'ddg_screenshot.png' });
        
        const html = await page.content();
        const fs = require('fs');
        fs.writeFileSync('ddg_dom.html', html);
        
        console.log('Saved screenshot');
    } catch(e) {
        console.error('Error:', e.message);
    } finally {
        await browser.close();
    }
}

testDDGPuppeteer('Табак Deus Pina Colada');
