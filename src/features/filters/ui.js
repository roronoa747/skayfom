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
        const isActive = state.activeBrand === brand ? 'active bg-white/10 border-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]' : 'bg-transparent text-white/50 border-transparent hover:text-white hover:bg-white/5';
        innerHtml += `
            <button class="brand-btn flex items-center flex-shrink-0 border rounded-full px-4 py-1.5 text-xs font-sans font-semibold tracking-wide whitespace-nowrap transition-all ${isActive}" data-brand="${brand}">
                ${brand}
            </button>
        `;
    });
    
    let repeatedHtml = innerHtml.repeat(3);
    
    container.innerHTML = `
        <span class="text-[10px] text-white/40 uppercase tracking-widest shrink-0 font-sans font-semibold mr-2 z-10 bg-[#070708] pr-2 relative">БРЕНД:</span>
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
        const isActive = state.activeVibes.has(vibe) ? 'active bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)] border-white/20' : 'bg-transparent text-white/50 border-transparent hover:text-white hover:bg-white/5';
        innerHtml += `
            <button class="vibe-btn flex items-center gap-2 flex-shrink-0 border rounded-full px-4 py-1.5 text-xs font-sans font-semibold tracking-wide whitespace-nowrap transition-all ${isActive}" data-vibe="${vibe}">
                <span class="w-1.5 h-1.5 rounded-full ${colorClass}"></span>
                ${vibe.toUpperCase()}
            </button>
        `;
    });
    
    let repeatedHtml = innerHtml.repeat(3);
    
    container.innerHTML = `
        <span class="text-[10px] text-white/40 uppercase tracking-widest shrink-0 font-sans font-semibold mr-2 z-10 bg-[#070708] pr-2 relative">ВАЙБ:</span>
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
                const btnTarget = e.currentTarget;
                DOM.tabBtns.forEach(b => {
                    b.classList.remove('active', 'text-white', 'bg-white/15', 'shadow-[0_0_10px_rgba(255,255,255,0.1)]', 'border', 'border-white/20');
                    b.classList.add('text-white/50');
                });
                btnTarget.classList.remove('text-white/50');
                btnTarget.classList.add('active', 'text-white', 'bg-white/15', 'shadow-[0_0_10px_rgba(255,255,255,0.1)]', 'border', 'border-white/20');
                onTabChange(btnTarget.dataset.type);
            });
        });
    }

    if (DOM.catBtns) {
        DOM.catBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const btnTarget = e.currentTarget;
                DOM.catBtns.forEach(b => {
                    b.classList.remove('active', 'border-white/10', 'bg-white/5', 'backdrop-blur-md', 'text-white', 'shadow-[0_0_15px_rgba(255,255,255,0.05)]');
                    b.classList.add('border-transparent', 'bg-transparent', 'text-white/50');
                });
                btnTarget.classList.remove('border-transparent', 'bg-transparent', 'text-white/50');
                btnTarget.classList.add('active', 'border-white/10', 'bg-white/5', 'backdrop-blur-md', 'text-white', 'shadow-[0_0_15px_rgba(255,255,255,0.05)]');
                onCategoryChange(btnTarget.dataset.cat);
            });
        });
    }

    if (DOM.strengthBtns) {
        DOM.strengthBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const btnTarget = e.currentTarget;
                const activeBtns = Array.from(DOM.strengthBtns).filter(b => b.classList.contains('active'));
                let currentMaxStr = 0;
                if (activeBtns.length > 0) {
                    currentMaxStr = Math.max(...activeBtns.map(b => parseInt(b.dataset.strength, 10)));
                }
                const targetStrength = parseInt(btnTarget.dataset.strength, 10);

                if (targetStrength === currentMaxStr) {
                    // Deselect all
                    DOM.strengthBtns.forEach(b => {
                        b.classList.remove('active', 'bg-white/10', 'shadow-[0_0_15px_rgba(255,255,255,0.1)]', 'opacity-100', 'grayscale-0');
                        b.classList.add('opacity-30', 'grayscale');
                    });
                    onStrengthChange(null);
                } else {
                    // Select up to target
                    DOM.strengthBtns.forEach(b => {
                        const bStr = parseInt(b.dataset.strength, 10);
                        if (bStr <= targetStrength) {
                            b.classList.remove('opacity-30', 'grayscale');
                            b.classList.add('active', 'bg-white/10', 'opacity-100', 'grayscale-0', 'shadow-[0_0_15px_rgba(255,255,255,0.1)]');
                        } else {
                            b.classList.remove('active', 'bg-white/10', 'shadow-[0_0_15px_rgba(255,255,255,0.1)]', 'opacity-100', 'grayscale-0');
                            b.classList.add('opacity-30', 'grayscale');
                        }
                    });
                    onStrengthChange(btnTarget.dataset.strength);
                }
            });
        });
    }
}
