const fs = require('fs');
let code = fs.readFileSync('src/app/main.js', 'utf8');

const first = code.indexOf('// State');
const second = code.indexOf('// State', first + 1);

if (second !== -1) {
    const endOfSecond = code.indexOf('function initDOM()', second);
    if (endOfSecond !== -1) {
        code = code.substring(0, second) + code.substring(endOfSecond);
        fs.writeFileSync('src/app/main.js', code, 'utf8');
        console.log('Removed duplicate state block!');
    } else {
        console.log('Could not find function initDOM()');
    }
} else {
    console.log('No duplicate // State found');
}
