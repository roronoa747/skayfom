import { createCard } from '../../entities/product/index.js';
import { initScrollReveal } from '../../shared/ui/scroll.js';

export function renderCatalog(catalogData, filterState, DOM, handleAddToCart) {
    if (!DOM.catalogGrid) return;
    DOM.catalogGrid.innerHTML = '';
    
    const isB2B = localStorage.getItem('isB2BMode') === 'true';
    let filteredData = catalogData.filter(item => {
        if (item.category === 'Для заведения' && !isB2B) return false;
        
        // Filter by Tab (Магазин/Аренда)
        if (item.type !== filterState.currentTab) return false;
        
        // Filter by Product Category
        if (filterState.activeProductCategory && filterState.activeProductCategory !== 'Все') {
            if (item.product_category !== filterState.activeProductCategory) return false;
        }

        // Filter by Search
        if (filterState.searchQuery) {
            const query = filterState.searchQuery.toLowerCase();
            const brandMatch = (item.brand || '').toLowerCase().includes(query);
            const flavorMatch = (item.flavor || '').toLowerCase().includes(query);
            const descMatch = (item.description || '').toLowerCase().includes(query);
            if (!brandMatch && !flavorMatch && !descMatch) return false;
        }

        // Filter by Selected Brand
        if (filterState.activeBrand) {
            if ((item.brand || '').trim() !== filterState.activeBrand) return false;
        }
        
        // Filter by Vibes
        if (filterState.activeVibes.size > 0) {
            const itemVibes = (item.vibes || '').toLowerCase().split(',').map(v => v.trim());
            const hasVibe = Array.from(filterState.activeVibes).some(vibe => itemVibes.includes(vibe));
            if (!hasVibe) return false;
        }

        // Filter by Strength
        if (filterState.activeStrength) {
            if (String(item.strength) !== filterState.activeStrength) return false;
        }
        
        // Filter by Ingredients (Mix Builder)
        if (filterState.activeIngredients.size > 0) {
             const itemVibes = (item.vibes || '').toLowerCase().split(',').map(v => v.trim());
             const itemDesc = (item.description || '').toLowerCase();
             const itemFlavor = (item.flavor || '').toLowerCase();

             const hasIngredient = Array.from(filterState.activeIngredients).every(ing => {
                 if (ing === 'напитки') {
                     return itemVibes.includes('чай') || 
                            itemDesc.includes('напит') || itemFlavor.includes('напит') ||
                            itemDesc.includes('кола') || itemFlavor.includes('кола') ||
                            itemDesc.includes('лимонад') || itemFlavor.includes('лимонад') ||
                            itemDesc.includes('сок') || itemFlavor.includes('сок') ||
                            itemDesc.includes('кофе') || itemFlavor.includes('кофе');
                 }
                 return itemVibes.includes(ing);
             });
             if (!hasIngredient) return false;
        }

        return true;
    });

    // HIGHLIGHTS LOGIC
    let isHighlightsMode = false;
    if (filterState.currentTab === 'Магазин' && !filterState.activeBrand && filterState.activeVibes.size === 0 && !filterState.activeStrength && !filterState.searchQuery && filterState.activeIngredients.size === 0) {
        isHighlightsMode = true;
        // Limit to 12 random highlights for display on desktop, and 6 on mobile (to keep 3 rows in 2 columns)
        const limit = window.innerWidth < 768 ? 6 : 12;
        filteredData = [...filteredData].sort(() => 0.5 - Math.random()).slice(0, limit);
    }

    if (DOM.customMixPrompt) {
        if (filterState.activeIngredients.size > 0 && filteredData.length === 0) {
            DOM.customMixPrompt.classList.remove('hidden');
        } else {
            DOM.customMixPrompt.classList.add('hidden');
        }
    }

    if (filteredData.length === 0) {
        DOM.catalogGrid.innerHTML = '<div class="col-span-full py-20 text-center text-white/50">Ничего не найдено. Попробуйте изменить фильтры.</div>';
        return;
    }

    filteredData.forEach((item, index) => {
        const card = createCard(item, handleAddToCart);
        card.style.transitionDelay = `${(index % 12) * 50}ms`;
        DOM.catalogGrid.appendChild(card);
    });

    setTimeout(() => {
        initScrollReveal();
        if (window.innerWidth >= 1024 && window.matchMedia("(hover: hover)").matches && window.matchMedia("(pointer: fine)").matches && typeof VanillaTilt !== 'undefined') {
            const cards = Array.from(document.querySelectorAll(".glass-card:not(.tilt-initialized)"));
            if (cards.length > 0) {
                cards.forEach(c => c.classList.add('tilt-initialized'));
                VanillaTilt.init(cards, {
                    max: 8,
                    speed: 400,
                    glare: true,
                    "max-glare": 0.1,
                    scale: 1.02
                });
            }
        }
    }, 50);
}
