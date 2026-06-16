import { initJSMarquee } from '../../shared/ui/marquee.js';
import { state, setBrand, toggleVibe } from './model.js';
import { VIBE_COLORS } from '../../shared/lib/constants.js';
import { isB2BMode } from '../../entities/session/index.js';

export function renderBrandFilters(catalogData, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Get unique brands
    const brands = new Set();
    catalogData.forEach(item => {
        const isB2B = isB2BMode();
        if (item.category === 'Для заведения' && !isB2B) return;
        
        if (item.type === state.currentTab) {
            if (state.activeProductCategory && item.product_category !== state.activeProductCategory && state.activeProductCategory !== 'Все') return;
            if (item.brand) brands.add(item.brand.trim());
        }
    });
    
    let preservedScroll = 0;
    const oldContainer = document.getElementById('brand-marquee-container');
    if (oldContainer) {
        preservedScroll = oldContainer.scrollLeft;
    }
    
    if (brands.size === 0) {
        container.innerHTML = '';
        container.classList.add('hidden');
        return;
    } else {
        container.classList.remove('hidden');
    }
    
    let innerHtml = '';
    
    Array.from(brands).sort().forEach(brand => {
        const isActive = state.activeBrand === brand ? 'active bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'bg-[#111113]/80 text-white/50 border-white/10 hover:text-white/80 hover:bg-white/5';
        innerHtml += `
            <button class="brand-btn flex items-center flex-shrink-0 border rounded px-4 py-2 text-[10px] font-display tracking-[0.2em] whitespace-nowrap transition-all ${isActive}" data-brand="${brand}">
                ${brand}
            </button>
        `;
    });
    
    let repeatedHtml = innerHtml.repeat(3);
    
    container.innerHTML = `
        <span class="text-[10px] text-white/50 uppercase tracking-[0.2em] shrink-0 font-display mr-2 z-10 bg-[#070708] pr-2 relative">БРЕНД:</span>
        <div class="overflow-x-auto hide-scrollbar w-full mask-edges relative flex cursor-grab" id="brand-marquee-container">
            <div class="flex gap-2 w-max js-marquee-inner px-2">
                <div class="flex gap-2">${repeatedHtml}</div>
                <div class="flex gap-2">${repeatedHtml}</div>
            </div>
        </div>
    `;
    
    container.querySelectorAll('.brand-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const selectedBrand = e.currentTarget.dataset.brand;
            setBrand(selectedBrand);
        });
    });
    
    const newContainer = document.getElementById('brand-marquee-container');
    if (newContainer && preservedScroll > 0) {
        newContainer.scrollLeft = preservedScroll;
    }
    
    initJSMarquee('brand-marquee-container', state.activeBrand ? 0 : 0.5);
}

export function renderVibeFilters(catalogData, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const vibes = new Set();
    catalogData.forEach(item => {
        const isB2B = isB2BMode();
        if (item.category === 'Для заведения' && !isB2B) return;
        
        if (item.type === state.currentTab) {
            if (state.activeProductCategory && item.product_category !== state.activeProductCategory && state.activeProductCategory !== 'Все') return;
            if (item.vibes) {
                item.vibes.split(',').forEach(v => {
                    const vibe = v.trim().toLowerCase();
                    if (vibe) vibes.add(vibe);
                });
            }
        }
    });
    
    let preservedScroll = 0;
    const oldContainer = document.getElementById('vibe-marquee-container');
    if (oldContainer) {
        preservedScroll = oldContainer.scrollLeft;
    }
    
    if (vibes.size === 0) {
        container.innerHTML = '';
        container.classList.add('hidden');
        return;
    } else {
        container.classList.remove('hidden');
    }
    
    let innerHtml = '';
    
    Array.from(vibes).sort().forEach(vibe => {
        const colorClass = VIBE_COLORS[vibe] || 'bg-zinc-300 drop-shadow-[0_0_5px_rgba(212,212,216,0.8)]';
        const isActive = state.activeVibes.has(vibe) ? 'active bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)] border-white/30' : 'bg-[#111113]/80 text-white/50 border-white/10 hover:text-white/80 hover:bg-white/5';
        innerHtml += `
            <button class="vibe-btn flex items-center gap-2 flex-shrink-0 border rounded-full px-4 py-2 text-[10px] font-display tracking-[0.2em] whitespace-nowrap transition-all ${isActive}" data-vibe="${vibe}">
                <span class="w-1.5 h-1.5 rounded-full ${colorClass}"></span>
                ${vibe.toUpperCase()}
            </button>
        `;
    });
    
    let repeatedHtml = innerHtml.repeat(3);
    
    container.innerHTML = `
        <span class="text-[10px] text-white/50 uppercase tracking-[0.2em] shrink-0 font-display mr-2 z-10 bg-[#070708] pr-2 relative">ВАЙБ:</span>
        <div class="overflow-x-auto hide-scrollbar w-full mask-edges relative flex cursor-grab" id="vibe-marquee-container">
            <div class="flex gap-2 w-max js-marquee-inner px-2">
                <div class="flex gap-2">${repeatedHtml}</div>
                <div class="flex gap-2">${repeatedHtml}</div>
            </div>
        </div>
    `;
    
    container.querySelectorAll('.vibe-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const selectedVibe = e.currentTarget.dataset.vibe;
            toggleVibe(selectedVibe);
        });
    });
    
    const newContainer = document.getElementById('vibe-marquee-container');
    if (newContainer && preservedScroll > 0) {
        newContainer.scrollLeft = preservedScroll;
    }
    
    initJSMarquee('vibe-marquee-container', state.activeVibes.size > 0 ? 0 : -0.5);
}

export function initStaticFilters(DOM, { onTabChange, onSearch, onCategoryChange, onStrengthChange }) {
    if (DOM.searchInput) {
        DOM.searchInput.addEventListener('input', (e) => {
            onSearch(e.target.value.trim().toLowerCase());
        });
    }

    if (DOM.tabBtns) {
        DOM.tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                DOM.tabBtns.forEach(b => {
                    b.classList.remove('active', 'bg-white', 'text-black');
                    b.classList.add('text-white/50');
                });
                e.target.classList.remove('text-white/50');
                e.target.classList.add('active', 'bg-white', 'text-black');
                onTabChange(e.target.dataset.type);
            });
        });
    }

    if (DOM.catBtns) {
        DOM.catBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                DOM.catBtns.forEach(b => {
                    b.classList.remove('active', 'bg-white', 'text-black');
                    b.classList.add('text-white/50');
                });
                e.target.classList.remove('text-white/50');
                e.target.classList.add('active', 'bg-white', 'text-black');
                onCategoryChange(e.target.dataset.cat);
            });
        });
    }

    if (DOM.strengthBtns) {
        DOM.strengthBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const btnTarget = e.currentTarget;
                if (btnTarget.classList.contains('active')) {
                    btnTarget.classList.remove('active', 'bg-white/10', 'text-white', 'shadow-[0_0_15px_rgba(255,255,255,0.1)]');
                    btnTarget.classList.add('text-white/50');
                    onStrengthChange(null);
                } else {
                    DOM.strengthBtns.forEach(b => {
                        b.classList.remove('active', 'bg-white/10', 'text-white', 'shadow-[0_0_15px_rgba(255,255,255,0.1)]');
                        b.classList.add('text-white/50');
                    });
                    btnTarget.classList.remove('text-white/50');
                    btnTarget.classList.add('active', 'bg-white/10', 'text-white', 'shadow-[0_0_15px_rgba(255,255,255,0.1)]');
                    onStrengthChange(btnTarget.dataset.strength);
                }
            });
        });
    }
}
