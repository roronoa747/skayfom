const fs = require('fs');
let code = fs.readFileSync('src/app/main.js', 'utf8');

// 1. Fix Google Sheet URL
code = code.replace(
    `const GOOGLE_SHEET_CSV_URL = 'catalog_template.csv';`,
    `const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1EpBXaSdDobu1M5d2U2HNC7lflFHAD0bholw0uIsXoqU/export?format=csv';\n// const GOOGLE_SHEET_CSV_URL = 'catalog_template.csv';`
);

// Add cache-buster to the loadCatalogData call
code = code.replace(
    `loadCatalogData(GOOGLE_SHEET_CSV_URL, FALLBACK_CSV)`,
    `loadCatalogData(GOOGLE_SHEET_CSV_URL + '&t=' + new Date().getTime(), FALLBACK_CSV)`
);

// 2. Inject handlePreorder function
const injectPos = code.indexOf('function renderBrandFilters()');
if (injectPos !== -1) {
    const handlePreorderStr = `function handlePreorder(item) {
    const text = 'Здравствуйте! Хочу узнать когда поступит в наличие:\\n' + item.brand + ' - ' + item.flavor;
    const url = 'https://wa.me/' + WHATSAPP_NUMBER.replace(/\\D/g, '') + '?text=' + encodeURIComponent(text);
    window.open(url, '_blank');
}

`;
    code = code.substring(0, injectPos) + handlePreorderStr + code.substring(injectPos);
}

// 3. Update createCard calls
code = code.replace(/createCard\(item, addToCart\)/g, 'createCard(item, addToCart, handlePreorder)');

fs.writeFileSync('src/app/main.js', code, 'utf8');
console.log('Successfully applied all final fixes via Node!');
