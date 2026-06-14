const fs = require('fs');
let code = fs.readFileSync('src/app/main.js', 'utf8');

const vStart = code.indexOf('const VIBE_COLORS = {');
const vEnd = code.indexOf('let catalogData = [];');

if (vStart !== -1 && vEnd !== -1) {
    code = code.substring(0, vStart) + '// State\n' + code.substring(vEnd);
    fs.writeFileSync('src/app/main.js', code, 'utf8');
    console.log('Removed duplicate VIBE constants!');
} else {
    console.log('Could not find bounds: vStart=' + vStart + ', vEnd=' + vEnd);
}
