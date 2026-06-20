const fs = require('fs');
const code = fs.readFileSync('src/app/main.js', 'utf8');

const first = code.indexOf('function initDOM()');
const second = code.indexOf('function initDOM()', first + 1);

console.log('First initDOM:', first);
console.log('Second initDOM:', second);
console.log('Total length:', code.length);

const firstStr = code.substring(first, first + 100);
const secondStr = code.substring(second, second + 100);
console.log('First initDOM matches second:', firstStr === secondStr);

// Find where the duplication starts
let dupStart = -1;
for (let i = first; i >= 0; i--) {
    if (code[i] !== code[second - (first - i)]) {
        dupStart = i;
        break;
    }
}
console.log('Duplication starts roughly at offset:', dupStart);
