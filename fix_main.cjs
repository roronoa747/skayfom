const fs = require('fs');
let code = fs.readFileSync('src/app/main.js', 'utf8');

// 1. Remove initJSMarquee
const mStart = code.indexOf('// Global map for marquees');
const mEnd = code.indexOf('// DOM Elements Object');
if (mStart !== -1 && mEnd !== -1) {
    code = code.substring(0, mStart) + code.substring(mEnd);
}

// 2. Remove triggerSmoke
const sStart = code.indexOf('function triggerSmoke');
const sEnd = code.indexOf('// 3. Data Fetching');
if (sStart !== -1 && sEnd !== -1) {
    code = code.substring(0, sStart) + code.substring(sEnd);
}

// 3. Remove fetchCatalogData and fetchFallback
const fStart = code.indexOf('async function fetchCatalogData');
const fEnd = code.indexOf('function showErrorState');
if (fStart !== -1 && fEnd !== -1) {
    code = code.substring(0, fStart) + code.substring(fEnd);
}

// 4. Remove initScrollReveal
const rStart = code.indexOf('let scrollObserver = null;');
const rEnd = code.indexOf('function createCard');
if (rStart !== -1 && rEnd !== -1) {
    code = code.substring(0, rStart) + code.substring(rEnd);
}

fs.writeFileSync('src/app/main.js', code, 'utf8');
console.log('Fixed main.js via index-based deletion!');
