import { createCard } from '../../entities/product/index.js';
import { initScrollReveal } from '../../shared/ui/scroll.js';

export function renderCatalog(catalogData, filterState, DOM, handleAddToCart) {
    if (!DOM.catalogGrid) return;
    DOM.catalogGrid.innerHTML = '';
    
    const isB2B = localStorage.getItem('isB2BMode') === 'true';
    let filteredData = catalogData.filter(item => {
        if (item.category === 'Для заведения' && !isB2B) return false;
        
        // Filter by Tab (Магазин/Аренда)
        if (filterState.currentTab === 'Аренда') {
            if (item.type !== 'Аренда' && item.product_category !== 'Табаки') return false;
        } else {
            if (item.type === 'Аренда') return false;
        }
        
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
        
        // Removed Filter by Ingredients (Mix Builder)

        return true;
    });

    // HIGHLIGHTS LOGIC
    let isHighlightsMode = false;
    if (filterState.currentTab === 'Магазин' && !filterState.activeBrand && filterState.activeVibes.size === 0 && !filterState.activeStrength && !filterState.searchQuery) {
        isHighlightsMode = true;
        // Limit to 12 random highlights for display on desktop, and 6 on mobile (to keep 3 rows in 2 columns)
        const limit = window.innerWidth < 768 ? 6 : 12;
        filteredData = [...filteredData].sort(() => 0.5 - Math.random()).slice(0, limit);
    }

    // Custom Mix prompt is handled directly in Mix Builder widget now

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
