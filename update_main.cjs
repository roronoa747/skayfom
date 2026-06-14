const fs = require('fs');

let content = fs.readFileSync('src/app/main.js', 'utf8');

// Add imports
content = content.replace(
    '// S.KAYFOM STORE - Main Logic',
    `// S.KAYFOM STORE - Main Logic
import { initJSMarquee } from '../shared/ui/marquee.js';
import { triggerSmoke } from '../shared/ui/loader.js';
import { initScrollReveal } from '../shared/ui/scroll.js';
import { loadCatalogData } from '../shared/api/catalog.js';`
);

// Remove initJSMarquee and its globals
content = content.replace(/\/\/ Global map for marquees[\s\S]*?function initJSMarquee[\s\S]*?\}\n/, '');

// Update init() function
content = content.replace(
    'fetchCatalogData();',
    `loadCatalogData(GOOGLE_SHEET_CSV_URL, FALLBACK_CSV)
            .then(data => {
                catalogData = data;
                renderBrandFilters();
                renderVibeFilters();
                renderCatalog();
            })
            .catch(err => {
                showErrorState();
            });`
);

// Remove triggerSmoke
content = content.replace(/function triggerSmoke[\s\S]*?\}\n/, '');

// Remove fetchCatalogData and fetchFallback
content = content.replace(/\/\/ 3\. Data Fetching with Error Handling \(Rule 5\)[\s\S]*?function fetchFallback[\s\S]*?\}\n/, '// 3. Data Fetching replaced by shared/api/catalog.js\n');

// Remove initScrollReveal
content = content.replace(/let scrollObserver = null;[\s\S]*?function initScrollReveal[\s\S]*?\}\n/, '');

fs.writeFileSync('src/app/main.js', content, 'utf8');
console.log('Successfully updated src/app/main.js');
