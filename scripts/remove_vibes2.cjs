const fs = require('fs');
let code = fs.readFileSync('src/app/main.js', 'utf8');

// VIBE_COLORS and VIBE_RGB_MAP
const vStart = code.indexOf('const VIBE_COLORS = {');
const vEnd = code.indexOf('// 2. Initialization');

if (vStart !== -1 && vEnd !== -1) {
    code = code.substring(0, vStart) + '\n' + code.substring(vEnd);
    fs.writeFileSync('src/app/main.js', code, 'utf8');
    console.log('Removed duplicate VIBE constants again!');
} else {
    console.log('Could not find VIBE constants!');
}
