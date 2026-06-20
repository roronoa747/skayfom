const fs = require('fs');
const code = fs.readFileSync('src/app/main.js', 'utf8');

const first = code.indexOf('function initDOM()');
const second = code.indexOf('function initDOM()', first + 1);

let dupEnd = second;
for (let i = 0; i < code.length - second; i++) {
    if (code[first + i] !== code[second + i]) {
        dupEnd = second + i;
        break;
    }
}
console.log('Duplication ends at:', dupEnd);

let newCode = code.substring(0, second - (first - 1341)) + code.substring(dupEnd);
fs.writeFileSync('src/app/main.js', newCode, 'utf8');
console.log('Duplication successfully stripped! New length:', newCode.length);
