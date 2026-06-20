const fs = require('fs');
let c = fs.readFileSync('src/app/main.js', 'utf8');

const replacement = `
    initStaticFilters(DOM, {
        onTabChange: (tab) => {
            setTab(tab);
            if (DOM.mixBuilderContainer) {
                if (tab === 'Аренда') {
                    DOM.mixBuilderContainer.style.display = 'none';
                } else {
                    DOM.mixBuilderContainer.style.display = 'block';
                }
            }
        },
        onSearch: (q) => setSearchQuery(q),
        onCategoryChange: (cat) => setProductCategory(cat),
        onStrengthChange: (s) => setStrength(s)
    });

    initMixBuilderUI(DOM, {
        WHATSAPP_NUMBER,
        onIngredientToggle: () => {
            renderCatalogWidget(catalogData, filterState, DOM, handleAddToCart);
        }
    });

    // B2B Modal`;

c = c.replace(/\/\/ Product Categories[\s\S]*?\/\/ B2B Modal/m, replacement);
fs.writeFileSync('src/app/main.js', c);
