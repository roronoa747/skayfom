const fs = require('fs');
let code = fs.readFileSync('src/app/main.js', 'utf8');

// 1. Remove let cart and cartIdCounter
code = code.replace(/let cart = \[\];.*?\nlet cartIdCounter = 0;.*?\n/s, '');

// 2. Remove addToCart
let addStart = code.indexOf('function addToCart(item)');
let addEnd = code.indexOf('function updateQuantity');
if (addStart !== -1 && addEnd !== -1) {
    code = code.substring(0, addStart) + code.substring(addEnd);
}

// 3. Remove updateQuantity
let upStart = code.indexOf('function updateQuantity');
let upEnd = code.indexOf('function removeFromCart');
if (upStart !== -1 && upEnd !== -1) {
    code = code.substring(0, upStart) + code.substring(upEnd);
}

// 4. Remove removeFromCart
let remStart = code.indexOf('function removeFromCart(cartId)');
let remEnd = code.indexOf('// Smooth Scroll');
if (remStart !== -1 && remEnd !== -1) {
    code = code.substring(0, remStart) + code.substring(remEnd);
}

fs.writeFileSync('src/app/main.js', code, 'utf8');
console.log('Final duplicates removed!');
