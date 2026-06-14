const fs = require('fs');
let code = fs.readFileSync('src/app/main.js', 'utf8');

const startStr = '}const VIBE_COLORS = {';
const endStr = 'function renderVibeFilters() {';

const startIndex = code.indexOf(startStr);
if (startIndex !== -1) {
    const endIndex = code.indexOf(endStr, startIndex);
    if (endIndex !== -1) {
        // preserve the '}' that got squashed with const VIBE_COLORS = {
        code = code.substring(0, startIndex) + '}\n\n' + code.substring(endIndex);
        fs.writeFileSync('src/app/main.js', code, 'utf8');
        console.log('Successfully removed VIBE constants!');
    }
} else {
    console.log('Start string not found.');
}
