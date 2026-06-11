const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, 'catalog_template.csv');
const sourceDir = 'C:\\Users\\ilyas\\Downloads\\Визуалы\\01_Chabacco';
const targetDir = path.join(__dirname, 'public', 'images', 'chabacco');

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

// 1. Read all files from source recursively
function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            if (file.endsWith('.png') || file.endsWith('.jpg')) {
                arrayOfFiles.push(path.join(dirPath, file));
            }
        }
    });

    return arrayOfFiles;
}

const allImages = getAllFiles(sourceDir);

// 2. Build normalized image map
const imageMap = {};
allImages.forEach(imgPath => {
    const basename = path.basename(imgPath, path.extname(imgPath));
    // Normalize: lowercase, remove "chabacco", remove extra spaces, remove punctuation
    let normalized = basename.toLowerCase()
        .replace(/chabacco/g, '')
        .replace(/[^a-zа-яё0-9]/gi, '')
        .trim();
    
    // We only keep the first one found or we can keep all
    if (normalized) {
        imageMap[normalized] = imgPath;
    }
});

// 3. Read CSV
const csvContent = fs.readFileSync(csvPath, 'utf8');
const lines = csvContent.split(/\r?\n/);
const header = lines[0].split(',');
const brandIdx = header.indexOf('brand');
const flavorIdx = header.indexOf('flavor');
const mediaUrlIdx = header.indexOf('media_url');

let matchCount = 0;

for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    // Simple split handling assuming no commas inside values (which works for this simple CSV)
    const cols = lines[i].split(',');
    
    if (cols[brandIdx] && cols[brandIdx].trim().toLowerCase() === 'chabacco') {
        const flavor = cols[flavorIdx].trim();
        let normFlavor = flavor.toLowerCase().replace(/[^a-zа-яё0-9]/gi, '').trim();
        
        // Exact match
        let matchedImg = imageMap[normFlavor];
        
        // Partial match fallback if not exact
        if (!matchedImg) {
            for (let key in imageMap) {
                if (key.includes(normFlavor) || normFlavor.includes(key)) {
                    matchedImg = imageMap[key];
                    break;
                }
            }
        }
        
        if (matchedImg) {
            const ext = path.extname(matchedImg);
            // Replace spaces with underscores for safe URL
            const safeFlavor = flavor.replace(/[^a-zA-Zа-яА-Я0-9]/g, '_');
            const targetFilename = `${safeFlavor}${ext}`;
            const targetPath = path.join(targetDir, targetFilename);
            
            fs.copyFileSync(matchedImg, targetPath);
            cols[mediaUrlIdx] = `images/chabacco/${targetFilename}`;
            matchCount++;
        }
    }
    
    lines[i] = cols.join(',');
}

fs.writeFileSync(csvPath, lines.join('\n'), 'utf8');
console.log(`Matched and copied ${matchCount} images for Chabacco.`);
