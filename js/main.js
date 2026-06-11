// S.KAYFOM STORE - Main Logic

// const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1EpBXaSdDobu1M5d2U2HNC7lflFHAD0bholw0uIsXoqU/export?format=csv';
const GOOGLE_SHEET_CSV_URL = 'catalog_template.csv';
const FALLBACK_CSV = 'catalog_template.csv';
const WHATSAPP_NUMBER = '+77066458965';

// State
let catalogData = [];
let currentTab = 'Магазин'; // Магазин | Аренда
let searchQuery = '';
let activeVibes = new Set();
let activeIngredients = new Set();
let activeBrand = null;
let activeStrength = null;
let activeProductCategory = 'Табаки';
let selectedItemForOrder = null;

// Global map for marquees
const activeMarquees = {};

function initJSMarquee(containerId, speed) {
    if (activeMarquees[containerId]) {
        cancelAnimationFrame(activeMarquees[containerId].raf);
    }
    
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const inner = container.querySelector('.js-marquee-inner');
    if (!inner) return;

    let isDown = false;
    let startX;
    let scrollLeft;
    let isAutoScrolling = true;
    let lastInteractionTime = 0;
    let exactScrollLeft = container.scrollLeft || 0;
    
    let currentSpeed = speed;
    let isHovered = false;
    const RESUME_DELAY = 800;
    
    function autoScroll() {
        let targetSpeed = speed;
        
        if (isDown) {
            targetSpeed = 0;
            currentSpeed = 0; // immediate stop when dragging
        } else if (isHovered) {
            targetSpeed = 0; // gradual stop
        } else if (!isAutoScrolling || Date.now() - lastInteractionTime < RESUME_DELAY) {
            targetSpeed = 0;
        }

        // Apply easing to speed
        currentSpeed += (targetSpeed - currentSpeed) * 0.05;
        
        // Only snap to 0 if the target is 0, otherwise it might get stuck when trying to accelerate from 0
        if (targetSpeed === 0 && Math.abs(currentSpeed) < 0.01) currentSpeed = 0;

        if (currentSpeed !== 0) {
            const halfWidth = inner.scrollWidth / 2;
            
            if (speed > 0) {
                if (exactScrollLeft >= halfWidth) {
                    exactScrollLeft -= halfWidth;
                }
                exactScrollLeft += currentSpeed;
            } else {
                if (exactScrollLeft <= 0) {
                    exactScrollLeft += halfWidth;
                }
                exactScrollLeft += currentSpeed;
            }
            container.scrollLeft = exactScrollLeft;
        } else {
            exactScrollLeft = container.scrollLeft;
        }
        activeMarquees[containerId].raf = requestAnimationFrame(autoScroll);
    }
    
    activeMarquees[containerId] = {
        raf: requestAnimationFrame(autoScroll)
    };
    
    container.addEventListener('mousedown', (e) => {
        isDown = true;
        container.classList.add('cursor-grabbing');
        container.classList.remove('cursor-grab');
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
        isAutoScrolling = false;
        lastInteractionTime = Date.now();
    });
    
    container.addEventListener('mouseenter', () => {
        isHovered = true;
    });
    
    container.addEventListener('mouseleave', () => {
        isHovered = false;
        isDown = false;
        container.classList.remove('cursor-grabbing');
        container.classList.add('cursor-grab');
        lastInteractionTime = Date.now();
    });
    
    container.addEventListener('mouseup', () => {
        isDown = false;
        container.classList.remove('cursor-grabbing');
        container.classList.add('cursor-grab');
        lastInteractionTime = Date.now();
    });
    
    container.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 0.8;
        container.scrollLeft = scrollLeft - walk;
        lastInteractionTime = Date.now();
    });
    
    container.addEventListener('touchstart', () => {
        isAutoScrolling = false;
        lastInteractionTime = Date.now();
    }, {passive: true});
    
    container.addEventListener('touchend', () => {
        lastInteractionTime = Date.now();
        isAutoScrolling = true;
    }, {passive: true});
    
    container.addEventListener('wheel', () => {
        lastInteractionTime = Date.now();
    }, {passive: true});
}

// DOM Elements Object (populated on init)
const DOM = {};

function initDOM() {
    DOM.catalogGrid = document.getElementById('catalog-grid');
    DOM.ageGate = document.getElementById('age-gate');
    DOM.btn18Yes = document.getElementById('btn-18-yes');
    DOM.btn18No = document.getElementById('btn-18-no');
    DOM.smokeLoader = document.getElementById('smoke-loader');
    DOM.searchInput = document.getElementById('search-input');
    DOM.brandFilters = document.getElementById('brand-filters');
    DOM.vibeFilters = document.getElementById('vibe-filters');
    DOM.strengthBtns = document.querySelectorAll('.strength-btn');
    DOM.tabBtns = document.querySelectorAll('.tab-btn');
    DOM.catBtns = document.querySelectorAll('.cat-btn');
    DOM.vibeBtns = document.querySelectorAll('.vibe-btn');
    DOM.ingredientBtns = document.querySelectorAll('.ingredient-btn');
    DOM.mixBuilder = document.getElementById('mix-builder');
    DOM.mixBuilderContainer = document.getElementById('mix-builder-dropdown-container');
    DOM.btnToggleMix = document.getElementById('btn-toggle-mix');
    DOM.customMixPrompt = document.getElementById('custom-mix-prompt');
    DOM.btnCustomMix = document.getElementById('btn-custom-mix');
    
    // Modal
    DOM.orderModal = document.getElementById('order-modal');
    DOM.orderModalContent = document.getElementById('order-modal-content');
    DOM.modalClose = document.getElementById('modal-close');
    DOM.modalTitle = document.getElementById('modal-title');
    DOM.modalSubtitle = document.getElementById('modal-subtitle');
    DOM.modalTabBtns = document.querySelectorAll('.modal-tab-btn');
    DOM.deliveryBlock = document.getElementById('delivery-block');
    DOM.pickupBlock = document.getElementById('pickup-block');
    DOM.btnConfirmOrder = document.getElementById('btn-confirm-order');
    DOM.deliveryAddress = document.getElementById('delivery-address');

    // B2B
    DOM.btnB2b = document.getElementById('btn-b2b');
    DOM.b2bModal = document.getElementById('b2b-modal');
    DOM.b2bModalContent = document.getElementById('b2b-modal-content');
    DOM.b2bModalClose = document.getElementById('b2b-modal-close');
}

// 1. Initialization
function init() {
    try {
        initDOM();
        checkAgeGate();
        initEventListeners();
        fetchCatalogData();
    } catch (error) {
        console.error("Initialization error:", error);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// 2. Age Gate & Loaders
function checkAgeGate() {
    const isAdult = localStorage.getItem('skayfom_21plus');
    if (isAdult && DOM.ageGate) {
        DOM.ageGate.style.display = 'none';
    }
}

function triggerSmoke(duration = 1500) {
    if (!DOM.smokeLoader) return;
    
    DOM.smokeLoader.classList.remove('hidden');
    
    // Allow display to apply before opacity transition
    setTimeout(() => {
        DOM.smokeLoader.classList.remove('opacity-0');
        DOM.smokeLoader.classList.add('opacity-100');
    }, 50);
    
    setTimeout(() => {
        DOM.smokeLoader.classList.remove('opacity-100');
        DOM.smokeLoader.classList.add('opacity-0');
        setTimeout(() => {
            DOM.smokeLoader.classList.add('hidden');
        }, 500); // Wait for CSS opacity transition
    }, duration);
}

// 3. Data Fetching with Error Handling (Rule 5)
async function fetchCatalogData() {
    try {
        Papa.parse(GOOGLE_SHEET_CSV_URL, {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                if (results.errors && results.errors.length > 0) {
                    console.warn("Google Sheet parsing errors, falling back.", results.errors);
                    fetchFallback();
                } else if (results.data && results.data.length > 0) {
                    catalogData = results.data;
                    renderBrandFilters();
                    renderVibeFilters();
                    renderCatalog();
                } else {
                    fetchFallback();
                }
            },
            error: function(err) {
                console.error("Network error fetching Google Sheet:", err);
                fetchFallback();
            }
        });
    } catch(e) {
        console.error("Exception during Google Sheet fetch:", e);
        fetchFallback();
    }
}

function fetchFallback() {
    try {
        Papa.parse(FALLBACK_CSV, {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                if (results.data) {
                    catalogData = results.data;
                    renderBrandFilters();
                    renderVibeFilters();
                    renderCatalog();
                } else {
                    showErrorState();
                }
            },
            error: function(err) {
                console.error("Failed to load fallback CSV:", err);
                showErrorState();
            }
        });
    } catch(e) {
        console.error("Exception during fallback fetch:", e);
        showErrorState();
    }
}

function showErrorState() {
    if (DOM.catalogGrid) {
        DOM.catalogGrid.innerHTML = `
            <div class="col-span-full py-20 text-center text-red-400 bg-red-900/20 rounded-2xl border border-red-500/20">
                <h3 class="text-xl font-bold mb-2">Ошибка загрузки каталога</h3>
                <p class="text-sm opacity-80">Не удалось загрузить данные. Пожалуйста, обновите страницу или попробуйте позже.</p>
            </div>
        `;
    }
}

// 4. Rendering
function renderBrandFilters() {
    if (!DOM.brandFilters) return;
    
    // Get unique brands
    const brands = new Set();
    catalogData.forEach(item => {
        if ((item.category === 'Для себя' || item.category === 'Все') && item.type === 'Магазин') {
            if (activeProductCategory && item.product_category !== activeProductCategory) return;
            if (item.brand) brands.add(item.brand.trim());
        }
    });
    
    if (brands.size === 0) {
        DOM.brandFilters.innerHTML = '';
        DOM.brandFilters.classList.add('hidden');
        return;
    } else {
        DOM.brandFilters.classList.remove('hidden');
    }
    
    let innerHtml = '';
    
    Array.from(brands).sort().forEach(brand => {
        const isActive = activeBrand === brand ? 'active bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'bg-[#111113]/80 text-white/50 border-white/10 hover:text-white/80 hover:bg-white/5';
        innerHtml += `
            <button class="brand-btn flex items-center flex-shrink-0 border rounded px-4 py-2 text-[10px] font-display tracking-[0.2em] whitespace-nowrap transition-all ${isActive}" data-brand="${brand}">
                ${brand}
            </button>
        `;
    });
    
    DOM.brandFilters.innerHTML = `
        <span class="text-[10px] text-white/50 uppercase tracking-[0.2em] shrink-0 font-display mr-2 z-10 bg-neutral-950 pr-2">БРЕНД:</span>
        <div class="overflow-hidden w-full mask-edges relative flex cursor-pointer">
            <div class="flex gap-2 w-max animate-marquee-left hover:[animation-play-state:paused] pl-2 pr-2">
                ${innerHtml}
                ${innerHtml}
                ${innerHtml}
                ${innerHtml}
            </div>
        </div>
    `;
    
    DOM.brandFilters.querySelectorAll('.brand-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const selectedBrand = e.target.dataset.brand;
            if (activeBrand === selectedBrand) {
                activeBrand = null;
            } else {
                activeBrand = selectedBrand;
            }
            renderBrandFilters();
            renderCatalog();
        });
    });
}

const VIBE_COLORS = {
    'летний': 'bg-orange-400 drop-shadow-[0_0_5px_rgba(251,146,60,0.8)]',
    'кислый': 'bg-lime-400 drop-shadow-[0_0_5px_rgba(163,230,53,0.8)]',
    'сладкий': 'bg-pink-400 drop-shadow-[0_0_5px_rgba(244,114,182,0.8)]',
    'выбор_команды': 'bg-sky-400 drop-shadow-[0_0_5px_rgba(56,189,248,0.8)]',
    'свежесть': 'bg-cyan-300 drop-shadow-[0_0_5px_rgba(103,232,249,0.8)]',
    'ягоды': 'bg-purple-500 drop-shadow-[0_0_5px_rgba(168,85,247,0.8)]',
    'десерты': 'bg-amber-700 drop-shadow-[0_0_5px_rgba(180,83,9,0.8)]',
    'фрукты': 'bg-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.8)]',
    'напитки': 'bg-blue-500 drop-shadow-[0_0_5px_rgba(59,130,246,0.8)]',
    'тропики': 'bg-teal-400 drop-shadow-[0_0_5px_rgba(45,212,191,0.8)]',
    'необычный': 'bg-fuchsia-500 drop-shadow-[0_0_5px_rgba(217,70,239,0.8)]',
    'цветы': 'bg-rose-400 drop-shadow-[0_0_5px_rgba(251,113,133,0.8)]',
    'аренда': 'bg-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]',
    'премиум': 'bg-yellow-600 drop-shadow-[0_0_5px_rgba(202,138,4,0.8)]'
};

function renderVibeFilters() {
    if (!DOM.vibeFilters) return;
    
    const vibes = new Set();
    catalogData.forEach(item => {
        if ((item.category === 'Для себя' || item.category === 'Все') && item.type === currentTab) {
            if (activeProductCategory && item.product_category !== activeProductCategory) return;
            if (item.vibes) {
                item.vibes.split(',').forEach(v => {
                    const vibe = v.trim().toLowerCase();
                    if (vibe) vibes.add(vibe);
                });
            }
        }
    });
    
    if (vibes.size === 0) {
        DOM.vibeFilters.innerHTML = '';
        DOM.vibeFilters.classList.add('hidden');
        return;
    } else {
        DOM.vibeFilters.classList.remove('hidden');
    }
    
    let innerHtml = '';
    
    Array.from(vibes).sort().forEach(vibe => {
        const colorClass = VIBE_COLORS[vibe] || 'bg-white/10';
        const isActive = activeVibes.has(vibe) ? 'active bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)] border-white/30' : 'bg-[#111113]/80 text-white/50 border-white/10 hover:text-white/80 hover:bg-white/5';
        innerHtml += `
            <button class="vibe-btn flex items-center gap-2 flex-shrink-0 border rounded-full px-4 py-2 text-[10px] font-display tracking-[0.2em] whitespace-nowrap transition-all ${isActive}" data-vibe="${vibe}">
                <span class="w-1.5 h-1.5 rounded-full ${colorClass}"></span>
                ${vibe.toUpperCase().replace('_', ' ')}
            </button>
        `;
    });
    
    DOM.vibeFilters.innerHTML = `
        <span class="text-[10px] text-white/50 uppercase tracking-[0.2em] shrink-0 font-display mr-2 z-10 bg-neutral-950 pr-2">ВАЙБ:</span>
        <div class="overflow-hidden w-full mask-edges relative flex cursor-pointer">
            <div class="flex gap-3 w-max animate-marquee-right hover:[animation-play-state:paused] pl-3 pr-3">
                ${innerHtml}
                ${innerHtml}
                ${innerHtml}
                ${innerHtml}
            </div>
        </div>
    `;
    
    DOM.vibeFilters.querySelectorAll('.vibe-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const btnTarget = e.currentTarget;
            const selectedVibe = btnTarget.dataset.vibe;
            if (activeVibes.has(selectedVibe)) {
                activeVibes.delete(selectedVibe);
            } else {
                activeVibes.add(selectedVibe);
            }
            renderVibeFilters();
            renderCatalog();
        });
    });
}

function renderCatalog() {
    if (!DOM.catalogGrid) return;
    DOM.catalogGrid.innerHTML = '';
    
    let filteredData = catalogData.filter(item => {
        // Must be for B2C
        if (item.category !== 'Для себя' && item.category !== 'Все') return false;
        
        // Filter by Tab (Купить/Аренда)
        if (item.type !== currentTab) return false;
        
        // Filter by Product Category
        if (activeProductCategory) {
            if (item.product_category !== activeProductCategory) return false;
        }

        // Filter by Search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const brandMatch = (item.brand || '').toLowerCase().includes(query);
            const flavorMatch = (item.flavor || '').toLowerCase().includes(query);
            const descMatch = (item.description || '').toLowerCase().includes(query);
            if (!brandMatch && !flavorMatch && !descMatch) return false;
        }

        // Filter by Selected Brand
        if (activeBrand) {
            if ((item.brand || '').trim() !== activeBrand) return false;
        }
        
        // Filter by Vibes
        if (activeVibes.size > 0) {
            const itemVibes = (item.vibes || '').toLowerCase().split(',').map(v => v.trim());
            const hasVibe = Array.from(activeVibes).some(vibe => itemVibes.includes(vibe));
            if (!hasVibe) return false;
        }

        // Filter by Strength
        if (activeStrength) {
            if (String(item.strength) !== activeStrength) return false;
        }
        
        // Filter by Ingredients (Mix Builder)
        if (activeIngredients.size > 0) {
             const itemVibes = (item.vibes || '').toLowerCase().split(',').map(v => v.trim());
             const hasIngredient = Array.from(activeIngredients).every(ing => itemVibes.includes(ing));
             if (!hasIngredient) return false;
        }

        return true;
    });

    // HIGHLIGHTS LOGIC
    let isHighlightsMode = false;
    if (currentTab === 'Магазин' && !activeBrand && activeVibes.size === 0 && !activeStrength && !searchQuery && activeIngredients.size === 0) {
        isHighlightsMode = true;
        // Limit to 12 random highlights for display
        filteredData = [...filteredData].sort(() => 0.5 - Math.random()).slice(0, 12);
    }

    if (DOM.customMixPrompt) {
        if (activeIngredients.size > 0 && filteredData.length === 0) {
            DOM.customMixPrompt.classList.remove('hidden');
        } else {
            DOM.customMixPrompt.classList.add('hidden');
        }
    }

    if (filteredData.length === 0) {
        DOM.catalogGrid.innerHTML = '<div class="col-span-full py-20 text-center text-white/50">Ничего не найдено. Попробуйте изменить фильтры.</div>';
        return;
    }

    if (isHighlightsMode) {
        // Just show the highlights without the banner
    }

    filteredData.forEach(item => {
        DOM.catalogGrid.appendChild(createCard(item));
    });
}

function createCard(item) {
    const div = document.createElement('div');
    const brandLower = (item.brand || '').toLowerCase().trim();
    div.className = `glass-card p-4 rounded-2xl flex flex-col h-full relative overflow-hidden default-neon group`;
    div.setAttribute('data-brand', brandLower);
    
    // Status badge (Strict Keys: in_stock)
    const inStock = String(item.in_stock).toLowerCase() === 'true' || String(item.in_stock).toLowerCase() === 'да';
    const badgeColor = inStock ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400';
    const badgeText = inStock ? 'В наличии' : 'Предзаказ';

    // Strength (Hookah Icons)
    let strengthDots = '';
    const strengthVal = parseInt(item.strength) || 0;
    const hookahSVG = `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><rect x="10" y="2" width="4" height="3" rx="1"></rect><rect x="8" y="5" width="8" height="1.5" rx="0.5"></rect><rect x="11" y="6.5" width="2" height="6"></rect><path d="M13 11.5l3-1.5 1.5 1.5-3 1.5z"></path><path d="M10.5 12.5h3l3.5 8.5a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1l3.5-8.5z"></path></svg>`;
    
    if (strengthVal > 0 && strengthVal <= 3) {
        strengthDots = `
            <div class="flex items-center gap-1 mt-3" title="Крепость: ${strengthVal}/3">
                <span class="${strengthVal >= 1 ? 'opacity-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] text-white' : 'opacity-20 grayscale text-white'}">${hookahSVG}</span>
                <span class="${strengthVal >= 2 ? 'opacity-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] text-white' : 'opacity-20 grayscale text-white'}">${hookahSVG}</span>
                <span class="${strengthVal >= 3 ? 'opacity-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] text-white' : 'opacity-20 grayscale text-white'}">${hookahSVG}</span>
            </div>
        `;
    }

    const imageSrc = item.media_url ? `public/${item.media_url}` : 'public/images/logo.png';
    const imageClass = item.media_url 
        ? 'w-4/5 h-4/5 object-contain relative z-10 drop-shadow-[0_15px_15px_rgba(0,0,0,0.8)] transition-transform duration-700 ease-out group-hover:scale-110' 
        : 'w-1/2 h-1/2 object-contain opacity-20 mix-blend-screen relative z-10 transition-transform duration-700 ease-out group-hover:scale-105';

    div.innerHTML = `
        <div class="absolute top-4 right-4 text-xs font-bold px-2 py-1 rounded ${badgeColor} border border-current/20 z-30">
            ${badgeText}
        </div>
        
        <div class="mb-4 aspect-square bg-[#050507] rounded-xl flex items-center justify-center overflow-hidden border border-white/5 relative">
             <!-- Subtle Dot Grid -->
             <div class="absolute inset-0 opacity-20 pointer-events-none" style="background-image: radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px); background-size: 12px 12px;"></div>
             
             <!-- Cyberpunk/Neon Spotlights -->
             <div class="absolute top-0 left-0 w-3/4 h-3/4 bg-sky-500/20 rounded-full blur-[50px] pointer-events-none mix-blend-screen transform -translate-x-1/4 -translate-y-1/4"></div>
             <div class="absolute bottom-0 right-0 w-3/4 h-3/4 bg-purple-500/15 rounded-full blur-[50px] pointer-events-none mix-blend-screen transform translate-x-1/4 translate-y-1/4"></div>
             <div class="absolute top-1/2 left-1/2 w-1/2 h-1/2 bg-white/5 rounded-full blur-[30px] pointer-events-none transform -translate-x-1/2 -translate-y-1/2"></div>
             
             <!-- Image -->
             <img src="${imageSrc}" loading="lazy" class="${imageClass}" alt="${item.flavor}">
             
             <!-- Grounding Shadow -->
             <div class="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-20 pointer-events-none"></div>
        </div>
        
        <div class="flex-1 flex flex-col relative z-20">
            <h3 class="text-[10px] text-neutral-500 font-display tracking-[0.3em] uppercase mb-1">${item.brand}</h3>
            <h2 class="text-xl font-alt font-black text-white mb-2 uppercase">${item.flavor}</h2>
            <p class="text-xs text-white/50 mb-4 line-clamp-2 font-alt font-light leading-relaxed">${item.description || ''}</p>
            
            <div class="mt-auto flex flex-col gap-4">
                ${strengthDots}
                <button class="w-full py-3 rounded-lg text-xs font-display tracking-[0.2em] transition-all duration-500 border border-orange-500/20 bg-orange-950/20 text-orange-500/60 shadow-[0_0_10px_rgba(234,88,12,0.1)] group-hover:border-orange-500/40 group-hover:text-orange-400 group-hover:shadow-[0_0_20px_rgba(234,88,12,0.2)] hover:!bg-gradient-to-r hover:!from-orange-500 hover:!to-red-600 hover:!border-orange-400 hover:!text-white hover:!shadow-[0_0_40px_rgba(239,68,68,0.8),inset_0_0_20px_rgba(255,255,255,0.5)] btn-order">
                    ЗАКАЗАТЬ
                </button>
            </div>
        </div>
    `;

    const btnOrder = div.querySelector('.btn-order');
    if (btnOrder) {
        btnOrder.addEventListener('click', () => openOrderModal(item));
    }

    return div;
}

// 5. Events & Interactivity
function initEventListeners() {
    // Age Gate Buttons
    if (DOM.btn18Yes && DOM.ageGate) {
        DOM.btn18Yes.addEventListener('click', () => {
            localStorage.setItem('skayfom_21plus', 'true');
            DOM.ageGate.classList.add('opacity-0');
            setTimeout(() => {
                DOM.ageGate.style.display = 'none';
                triggerSmoke(1500);
            }, 700);
        });
    }

    if (DOM.btn18No) {
        DOM.btn18No.addEventListener('click', () => {
            window.location.href = 'https://google.com';
        });
    }

    // Product Categories
    if (DOM.catBtns) {
        DOM.catBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                DOM.catBtns.forEach(b => {
                    b.classList.remove('active', 'border-b-2', 'border-sky-400', 'text-white');
                    b.classList.add('border', 'border-white/5', 'text-white/50', 'hover:text-white');
                });
                e.target.classList.remove('border', 'border-white/5', 'text-white/50', 'hover:text-white');
                e.target.classList.add('active', 'border-b-2', 'border-sky-400', 'text-white');
                
                const selectedCat = e.target.dataset.cat;
                console.log('Selected Category:', selectedCat);
                activeProductCategory = selectedCat;
                
                // Clear sub-filters when switching root categories
                activeBrand = null;
                activeVibes.clear();
                
                renderBrandFilters();
                renderVibeFilters();
                renderCatalog();
            });
        });
    }

    // Tabs
    if (DOM.tabBtns) {
        DOM.tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                DOM.tabBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                currentTab = e.target.dataset.type;
                
                if (DOM.mixBuilderContainer) {
                    if (currentTab === 'Аренда') {
                        DOM.mixBuilderContainer.style.display = 'none';
                    } else {
                        DOM.mixBuilderContainer.style.display = 'block';
                    }
                }
                
                renderCatalog();
            });
        });
    }
    // Search
    if (DOM.searchInput) {
        DOM.searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            renderCatalog();
        });
    }

    // Strength
    if (DOM.strengthBtns) {
        DOM.strengthBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const strength = e.currentTarget.dataset.strength;
                if (activeStrength === strength) {
                    activeStrength = null;
                } else {
                    activeStrength = strength;
                }
                
                DOM.strengthBtns.forEach(b => {
                    const s = b.dataset.strength;
                    if (activeStrength && parseInt(s) <= parseInt(activeStrength)) {
                        b.classList.remove('grayscale', 'opacity-30');
                        b.classList.add('opacity-100', 'drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]');
                    } else {
                        b.classList.add('grayscale', 'opacity-30');
                        b.classList.remove('opacity-100', 'drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]');
                    }
                });
                
                renderCatalog();
            });
        });
    }

    // Ingredients
    if (DOM.ingredientBtns) {
        DOM.ingredientBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tag = e.target.dataset.tag;
                if (activeIngredients.has(tag)) {
                    activeIngredients.delete(tag);
                    e.target.classList.remove('active');
                } else {
                    if (activeIngredients.size >= 3) {
                        alert('Можно выбрать не более 3-х ингредиентов');
                        return;
                    }
                    activeIngredients.add(tag);
                    e.target.classList.add('active');
                }
                renderCatalog();
            });
        });
    }

    // Custom Mix Button
    if (DOM.btnCustomMix) {
        DOM.btnCustomMix.addEventListener('click', () => {
            const ingredientsText = Array.from(activeIngredients).join(', ');
            const text = `Привет! Я с сайта S.KAYFOM STORE. Хочу создать кастомный микс. Мои предпочтения: ${ingredientsText}.`;
            const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
            window.open(waLink, '_blank');
        });
    }

    // Mix Builder Dropdown Toggle
    if (DOM.btnToggleMix && DOM.mixBuilder) {
        DOM.btnToggleMix.addEventListener('click', (e) => {
            e.stopPropagation();
            const isClosed = DOM.mixBuilder.classList.contains('opacity-0');
            if (isClosed) {
                DOM.mixBuilder.classList.remove('opacity-0', 'pointer-events-none', 'scale-95');
            } else {
                DOM.mixBuilder.classList.add('opacity-0', 'pointer-events-none', 'scale-95');
            }
        });
        
        // Close on click outside
        document.addEventListener('click', (e) => {
            if (!DOM.mixBuilder.contains(e.target)) {
                DOM.mixBuilder.classList.add('opacity-0', 'pointer-events-none', 'scale-95');
            }
        });
    }

    // B2B Modal
    if (DOM.btnB2b && DOM.b2bModal && DOM.b2bModalClose) {
        DOM.btnB2b.addEventListener('click', () => {
            DOM.b2bModal.classList.remove('hidden');
            setTimeout(() => {
                DOM.b2bModal.classList.remove('opacity-0');
                if(DOM.b2bModalContent) DOM.b2bModalContent.classList.remove('scale-95');
            }, 10);
        });

        DOM.b2bModalClose.addEventListener('click', () => {
            DOM.b2bModal.classList.add('opacity-0');
            if(DOM.b2bModalContent) DOM.b2bModalContent.classList.add('scale-95');
            setTimeout(() => DOM.b2bModal.classList.add('hidden'), 300);
        });
    }

    // Modal Actions
    if (DOM.modalClose) DOM.modalClose.addEventListener('click', closeOrderModal);
    if (DOM.orderModal) {
        DOM.orderModal.addEventListener('click', (e) => {
            if(e.target === DOM.orderModal) closeOrderModal();
        });
    }

    if (DOM.modalTabBtns) {
        DOM.modalTabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                DOM.modalTabBtns.forEach(b => {
                    b.classList.remove('active', 'bg-white/10', 'text-white');
                    b.classList.add('text-white/50');
                });
                e.target.classList.remove('text-white/50');
                e.target.classList.add('active', 'bg-white/10', 'text-white');
                
                const method = e.target.dataset.method;
                if (method === 'Доставка') {
                    if (DOM.deliveryBlock) DOM.deliveryBlock.classList.remove('hidden');
                    if (DOM.pickupBlock) DOM.pickupBlock.classList.add('hidden');
                } else {
                    if (DOM.deliveryBlock) DOM.deliveryBlock.classList.add('hidden');
                    if (DOM.pickupBlock) DOM.pickupBlock.classList.remove('hidden');
                }
            });
        });
    }

    if (DOM.btnConfirmOrder) DOM.btnConfirmOrder.addEventListener('click', generateWhatsAppLink);
}

// 6. Modal & WhatsApp Logic
function openOrderModal(item) {
    selectedItemForOrder = item;
    if (DOM.modalTitle) DOM.modalTitle.textContent = item.type === 'Аренда' ? 'Заявка на аренду' : 'Оформление заказа';
    if (DOM.modalSubtitle) DOM.modalSubtitle.textContent = `${item.brand} — ${item.flavor}`;
    
    // Reset modal state
    if (DOM.deliveryAddress) DOM.deliveryAddress.value = '';
    if (DOM.modalTabBtns && DOM.modalTabBtns.length > 0) DOM.modalTabBtns[0].click(); // Select default delivery
    
    if (DOM.orderModal) {
        DOM.orderModal.classList.remove('hidden');
        // slight delay for transition
        setTimeout(() => {
            DOM.orderModal.classList.remove('opacity-0');
            if (DOM.orderModalContent) DOM.orderModalContent.classList.remove('scale-95');
        }, 20);
    }
}

function closeOrderModal() {
    if (DOM.orderModal) DOM.orderModal.classList.add('opacity-0');
    if (DOM.orderModalContent) DOM.orderModalContent.classList.add('scale-95');
    
    setTimeout(() => {
        if (DOM.orderModal) DOM.orderModal.classList.add('hidden');
        selectedItemForOrder = null;
    }, 300);
}

function generateWhatsAppLink() {
    triggerSmoke(1000);
    
    setTimeout(() => {
        const item = selectedItemForOrder;
        const methodBtn = document.querySelector('.modal-tab-btn.active');
        const method = methodBtn ? methodBtn.dataset.method : 'Доставка';
        const address = DOM.deliveryAddress ? DOM.deliveryAddress.value.trim() : '';
        
        let text = '';
        
        if (item.category === 'Для заведения') {
             text = `Здравствуйте! Интересуют оптовые поставки для заведения. Вышлите прайс-лист.`;
        } else if (item.type === 'Аренда') {
             text = `Здравствуйте, интересует аренда кальяна, пакет: ${item.brand} - ${item.flavor}.`;
             if (method === 'Доставка' && address) {
                 text += ` Доставка по адресу: ${address}.`;
             } else if (method === 'Самовывоз') {
                 text += ` Выбран самовывоз.`;
             }
        } else {
             // Магазин - Покупка
             const inStock = String(item.in_stock).toLowerCase() === 'true' || String(item.in_stock).toLowerCase() === 'да';
             
             if (inStock) {
                 text = `Привет! Я с сайта S.KAYFOM STORE. Хочу купить: ${item.brand} — ${item.flavor}. Крепость: ${item.strength || '-'}.`;
                 if (method === 'Доставка') {
                     text += ` Доставка по адресу: ${address ? address : 'не указан'}.`;
                 } else {
                     text += ` Выбран самовывоз.`;
                 }
             } else {
                 text = `Привет! Когда ожидать поступление вкуса: ${item.brand} — ${item.flavor}?`;
             }
        }
        
        const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
        window.open(waLink, '_blank');
        closeOrderModal();
    }, 800);
}

function initHeaderScroll() {
    const header = document.getElementById('main-header');
    if (!header) return;
    
    let lastScroll = window.scrollY;
    let isHidden = false;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        
        // iOS bounce protection at the top
        if (currentScroll <= 0) {
            if (isHidden) {
                header.classList.remove('-translate-y-4', 'opacity-0', 'pointer-events-none');
                isHidden = false;
            }
            lastScroll = 0;
            return;
        }
        
        // Apply logic on mobile and tablets
        if (window.innerWidth < 1024) {
            const scrollDiff = currentScroll - lastScroll;
            
            // Threshold of 15px to prevent micro-jitter
            if (Math.abs(scrollDiff) > 15) {
                if (scrollDiff > 0 && currentScroll > 100) {
                    // Scrolling down -> hide softly
                    if (!isHidden) {
                        header.classList.add('-translate-y-4', 'opacity-0', 'pointer-events-none');
                        isHidden = true;
                    }
                } else if (scrollDiff < 0) {
                    // Scrolling up -> show
                    if (isHidden) {
                        header.classList.remove('-translate-y-4', 'opacity-0', 'pointer-events-none');
                        isHidden = false;
                    }
                }
                // Only update lastScroll when a significant movement happens
                lastScroll = currentScroll;
            }
        } else {
            // Always show on desktop
            if (isHidden) {
                header.classList.remove('-translate-y-4', 'opacity-0', 'pointer-events-none');
                isHidden = false;
            }
        }
    }, { passive: true });
}

// Ensure it initializes
document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initResponsiveMixBuilder();
});

// Responsive Mix Builder Mover
function initResponsiveMixBuilder() {
    const dropdown = document.getElementById('mix-builder-dropdown-container');
    const desktopContainer = document.getElementById('desktop-mix-container');
    const mobileContainer = document.getElementById('mobile-mix-container');
    
    if (!dropdown || !desktopContainer || !mobileContainer) return;
    
    function moveMixBuilder() {
        if (window.innerWidth < 768) {
            if (mobileContainer.children.length === 0) {
                mobileContainer.appendChild(dropdown);
            }
        } else {
            if (desktopContainer.children.length === 0) {
                desktopContainer.appendChild(dropdown);
            }
        }
    }
    
    // Initial check
    moveMixBuilder();
    
    // Check on resize
    window.addEventListener('resize', moveMixBuilder, { passive: true });
}
