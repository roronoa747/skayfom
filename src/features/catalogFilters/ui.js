import { filtersState, toggleSetFilter, setFilters } from './model.js';

// Constants could be imported from shared/lib/constants.js
// but we will inline them here for now until we refactor shared layer.
const VIBES = [
    'Сладкий', 'Кислый', 'Свежий', 'Пряный', 'Десертный',
    'Ягодный', 'Тропический', 'Цитрус', 'Напитки', 'Чай',
    'Травы', 'Цветочный', 'Гастрономия', 'Мята', 'Холодок',
    'Сытный', 'Фруктовый'
];

const INGREDIENTS = [
    'Ягоды', 'Фрукты', 'Выпечка', 'Специи', 'Напитки'
];

export function renderBrandFilters(DOM, catalogData) {
    if (!DOM.brandFilters) return;
    
    const brands = new Set();
    catalogData.forEach(item => {
        if ((item.category === 'Табак для кальяна' || item.category === 'Чайная смесь') && item.type === filtersState.currentTab) {
            if (item.brand) brands.add(item.brand);
        }
    });

    const sortedBrands = Array.from(brands).sort();
    
    // Add custom buttons manually for now
    let html = `
        <button class="brand-btn w-full text-left px-3 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-display 
transition-all border border-white/5 bg-black/40 text-white/50 hover:bg-white/10 hover:text-white group flex items-center 
justify-between" data-brand="">
            <span>Все бренды</span>
        </button>
    `;

    sortedBrands.forEach(brand => {
        const isActive = filtersState.activeBrand === brand;
        const activeClass = isActive 
            ? 'bg-sky-500/20 text-sky-400 border-sky-500/50 shadow-[0_0_15px_rgba(14,165,233,0.2)]' 
            : 'border-white/5 bg-black/40 text-white/50 hover:bg-white/10 hover:text-white';
            
        html += `
            <button class="brand-btn w-full text-left px-3 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-display 
transition-all border ${activeClass} group flex items-center justify-between" data-brand="${brand}">
                <span class="truncate pr-2">${brand}</span>
            </button>
        `;
    });

    DOM.brandFilters.innerHTML = html;

    DOM.brandFilters.querySelectorAll('.brand-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const brand = e.currentTarget.dataset.brand;
            setFilters({ activeBrand: brand || null });
        });
export function renderCategoryFilters(DOM) {
    if (!DOM.catBtns) return;
    
    DOM.catBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const cat = e.currentTarget.dataset.cat;
            
            // Remove active styles from all category buttons
            DOM.catBtns.forEach(b => {
                b.classList.remove('active', 'border-b-2', 'border-sky-400', 'text-white');
                b.classList.add('border', 'border-white/5', 'text-white/50');
            });
            
            // Add active styles to clicked button
            e.currentTarget.classList.remove('border', 'border-white/5', 'text-white/50');
            e.currentTarget.classList.add('active', 'border-b-2', 'border-sky-400', 'text-white');
            
            setFilters({ activeProductCategory: cat });
            
            // Scroll category container to keep button in view
            if (DOM.categoryContainer) {
                const containerRect = DOM.categoryContainer.getBoundingClientRect();
                const btnRect = e.currentTarget.getBoundingClientRect();
                
                if (btnRect.left < containerRect.left || btnRect.right > containerRect.right) {
                    DOM.categoryContainer.scrollTo({
                        left: e.currentTarget.offsetLeft - containerRect.width / 2 + e.currentTarget.offsetWidth / 2,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}
