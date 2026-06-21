const fs = require('fs');
const lines = fs.readFileSync('catalog_template.csv', 'utf8').split('\n');
const header = lines[0].trim() + ',"city"';
const astanaRows = [];
const tarazRows = [];
for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    astanaRows.push(line + ',"Астана"');
    tarazRows.push(line + ',"Тараз"');
}
const newContent = [header, ...astanaRows, ...tarazRows].join('\n') + '\n';
fs.writeFileSync('catalog_template.csv', newContent);
console.log('done');
