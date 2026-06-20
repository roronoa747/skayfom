const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'public', 'images', 'catalog');
const files = fs.readdirSync(outDir);

const threshold = Date.now() - 15 * 60 * 1000; // 15 minutes ago

let count = 0;
for (const file of files) {
    if (!file.endsWith('.png') && !file.endsWith('.jpg')) continue;
    const fullPath = path.join(outDir, file);
    const stat = fs.statSync(fullPath);
    if (stat.mtimeMs > threshold) {
        fs.unlinkSync(fullPath);
        count++;
    }
}
console.log(`Deleted ${count} recently created images.`);
