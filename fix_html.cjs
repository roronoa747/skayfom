const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/src=\"\/images\//g, 'src=\"./images/');
html = html.replace(/src=\"\/src\//g, 'src=\"./src/');
fs.writeFileSync('index.html', html, 'utf8');
console.log('Fixed paths in index.html');
