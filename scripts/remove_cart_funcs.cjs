const fs = require('fs');
let code = fs.readFileSync('src/app/main.js', 'utf8');

const funcs = ['updateQuantity', 'removeFromCart', 'addToCart'];

for (const fn of funcs) {
    const start = code.indexOf(`function ${fn}(`);
    if (start !== -1) {
        let end = code.indexOf('\nfunction ', start + 10);
        if (end === -1) end = code.indexOf('\n// ', start + 10); // next section
        if (end !== -1) {
            code = code.substring(0, start) + code.substring(end);
            console.log(`Removed ${fn}`);
        } else {
            console.log(`Could not find end of ${fn}`);
        }
    } else {
        console.log(`Could not find ${fn}`);
    }
}

fs.writeFileSync('src/app/main.js', code, 'utf8');
console.log('Done removing cart functions!');
