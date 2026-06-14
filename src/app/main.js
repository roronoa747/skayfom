// S.KAYFOM STORE - Main Logic
import { initJSMarquee } from '../shared/ui/marquee.js';
import { triggerSmoke } from '../shared/ui/loader.js';
import { initScrollReveal } from '../shared/ui/scroll.js';
import { loadCatalogData } from '../shared/api/catalog.js';

const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1EpBXaSdDobu1M5d2U2HNC7lflFHAD0bholw0uIsXoqU/export?format=csv';
// const GOOGLE_SHEET_CSV_URL = 'catalog_template.csv';
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
let cart = []; // Array of { item, quantity, price, cartId }
let cartIdCounter = 0;

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
    DOM.btnOpenCart = document.getElementById('btn-open-cart');
    DOM.cartBadge = document.getElementById('cart-badge');
    DOM.btnFloatingCart = document.getElementById('btn-floating-cart');
    DOM.floatingCartBadge = document.getElementById('floating-cart-badge');
    DOM.cartItemsContainer = document.getElementById('cart-items-container');
    DOM.cartEmptyState = document.getElementById('cart-empty-state');
    DOM.cartTotalPrice = document.getElementById('cart-total-price');
    DOM.toastContainer = document.getElementById('toast-container');
    DOM.modalTabBtns = document.querySelectorAll('.modal-tab-btn');
    DOM.deliveryBlock = document.getElementById('delivery-block');
    DOM.pickupBlock = document.getElementById('pickup-block');
    DOM.btnConfirmOrder = document.getElementById('btn-confirm-order');
    DOM.deliveryAddress = document.getElementById('delivery-address');
    DOM.deliveryEntrance = document.getElementById('delivery-entrance');
    DOM.deliveryFloor = document.getElementById('delivery-floor');
    DOM.deliveryApartment = document.getElementById('delivery-apartment');

    // B2B
    DOM.btnB2b = document.getElementById('btn-b2b');
    DOM.b2bModal = document.getElementById('b2b-modal');
    DOM.b2bModalContent = document.getElementById('b2b-modal-content');
    DOM.b2bModalClose = document.getElementById('b2b-modal-close');
    DOM.appWrapper = document.getElementById('app-wrapper');
    DOM.btnDetectLocation = document.getElementById('btn-detect-location');
    DOM.locationError = document.getElementById('location-error');
    
    // Address Detection
    DOM.btnDetectLocation = document.getElementById('btn-detect-location');
    DOM.locationError = document.getElementById('location-error');
}

// 1. Initialization
function init() {
    try {
        initDOM();
        checkAgeGate();
        initEventListeners();
        loadCatalogData(GOOGLE_SHEET_CSV_URL + '&t=' + new Date().getTime(), FALLBACK_CSV)
            .then(data => {
                catalogData = data;
                renderBrandFilters();
                renderVibeFilters();
                renderCatalog();
            })
            .catch(err => {
                showErrorState();
            });
    } catch (error) {
        console.error("Initialization error:", error);
    }
}

let isYandexSuggestInitialized = false;

function initYandexSuggest() {
    if (isYandexSuggestInitialized) return;
    const addressInput = document.getElementById('delivery-address');
    if (!addressInput) return;

    const autocompleteContainer = document.createElement('div');
    autocompleteContainer.className = 'absolute z-50 w-full bg-[#121214] border border-white/10 rounded-xl mt-1 overflow-hidden hidden shadow-2xl';
    addressInput.parentNode.appendChild(autocompleteContainer);

    let autocompleteTimeout;
    addressInput.addEventListener('input', (e) => {
        clearTimeout(autocompleteTimeout);
        const query = e.target.value.trim();
        if (query.length < 3) { autocompleteContainer.classList.add('hidden'); return; }
        
        autocompleteTimeout = setTimeout(async () => {
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=\u0410\u0441\u0442\u0430\u043d\u0430, ${encodeURIComponent(query)}&addressdetails=1&limit=5&accept-language=ru`);
                const data = await res.json();
                
                if (data && data.length > 0) {
                    autocompleteContainer.innerHTML = '';
                    let hasResults = false;
                    const seen = new Set();
                    data.forEach(item => {
                        const dl = item.display_name.toLowerCase();
                        if (!dl.includes('\u0430\u0441\u0442\u0430\u043d\u0430') && !dl.includes('astana') && !dl.includes('\u043d\u0443\u0440-\u0441\u0443\u043b\u0442\u0430\u043d')) return;
                        
                        let street = item.address.road || item.address.residential || '';
                        let house = item.address.house_number || '';
                        let dname = `${street} ${house}`.trim();
                        if (!dname) dname = item.display_name.split(',')[0];
                        
                        if (!seen.has(dname)) {
                            seen.add(dname);
                            hasResults = true;
                            const div = document.createElement('div');
                            div.className = 'p-3 hover:bg-white/10 cursor-pointer text-sm text-white border-b border-white/5 last:border-0';
                            div.textContent = dname || item.display_name;
                            div.addEventListener('click', () => { addressInput.value = dname || item.display_name; autocompleteContainer.classList.add('hidden'); });
                            autocompleteContainer.appendChild(div);
                        }
                    });
                    if (hasResults) autocompleteContainer.classList.remove('hidden');
                    else autocompleteContainer.classList.add('hidden');
                } else autocompleteContainer.classList.add('hidden');
            } catch(err) {}
        }, 400);
    });

    document.addEventListener('click', (e) => {
        if (!addressInput.contains(e.target) && !autocompleteContainer.contains(e.target)) autocompleteContainer.classList.add('hidden');
    });
    isYandexSuggestInitialized = true;
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
    } else if (DOM.appWrapper && !isAdult) {
        // Initial state for scale animation if age gate is visible
        DOM.appWrapper.classList.add('scale-105', 'opacity-50');
    }
}

// 3. Data Fetching with Error Handling (Rule 5)
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
    
    let preservedScroll = 0;
    const oldContainer = document.getElementById('brand-marquee-container');
    if (oldContainer) {
        preservedScroll = oldContainer.scrollLeft;
    }
    
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
    
    let repeatedHtml = innerHtml.repeat(3);
    
    DOM.brandFilters.innerHTML = `
        <span class="text-[10px] text-white/50 uppercase tracking-[0.2em] shrink-0 font-display mr-2 z-10 bg-[#070708] pr-2 relative">БРЕНД:</span>
        <div class="overflow-x-auto hide-scrollbar w-full mask-edges relative flex cursor-grab" id="brand-marquee-container">
            <div class="flex gap-2 w-max js-marquee-inner px-2">
                <div class="flex gap-2">${repeatedHtml}</div>
                <div class="flex gap-2">${repeatedHtml}</div>
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
    
    const newContainer = document.getElementById('brand-marquee-container');
    if (newContainer && preservedScroll > 0) {
        newContainer.scrollLeft = preservedScroll;
    }
    
    initJSMarquee('brand-marquee-container', activeBrand ? 0 : 0.5);
}

const VIBE_COLORS = {
    'летний': 'bg-orange-400 drop-shadow-[0_0_5px_rgba(251,146,60,0.8)]',
    'кислый': 'bg-lime-400 drop-shadow-[0_0_5px_rgba(163,230,53,0.8)]',
    'сладкий': 'bg-pink-400 drop-shadow-[0_0_5px_rgba(244,114,182,0.8)]',
    'выбор_команды': 'bg-sky-400 drop-shadow-[0_0_5px_rgba(56,189,248,0.8)]',
    'свежесть': 'bg-cyan-300 drop-shadow-[0_0_5px_rgba(103,232,249,0.8)]',
    'ягоды': 'bg-purple-500 drop-shadow-[0_0_5px_rgba(168,85,247,0.8)]',
    'лесные ягоды': 'bg-rose-500 drop-shadow-[0_0_5px_rgba(244,63,94,0.8)]',
    'десерты': 'bg-amber-700 drop-shadow-[0_0_5px_rgba(180,83,9,0.8)]',
    'фрукты': 'bg-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.8)]',
    'напитки': 'bg-blue-500 drop-shadow-[0_0_5px_rgba(59,130,246,0.8)]',
    'тропики': 'bg-teal-400 drop-shadow-[0_0_5px_rgba(45,212,191,0.8)]',
    'необычный': 'bg-fuchsia-500 drop-shadow-[0_0_5px_rgba(217,70,239,0.8)]',
    'цветы': 'bg-rose-400 drop-shadow-[0_0_5px_rgba(251,113,133,0.8)]',
    'аренда': 'bg-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]',
    'премиум': 'bg-yellow-600 drop-shadow-[0_0_5px_rgba(202,138,4,0.8)]',
    'чайный': 'bg-amber-600 drop-shadow-[0_0_5px_rgba(217,119,6,0.8)]',
    'холод': 'bg-blue-300 drop-shadow-[0_0_5px_rgba(147,197,253,0.8)]'
};

const VIBE_RGB_MAP = {
    'летний': '251, 146, 60',       // orange-400
    'кислый': '163, 230, 53',       // lime-400
    'сладкий': '244, 114, 182',     // pink-400
    'выбор_команды': '56, 189, 248',// sky-400
    'свежесть': '103, 232, 249',    // cyan-300
    'ягоды': '168, 85, 247',        // purple-500
    'лесные ягоды': '244, 63, 94',  // rose-500
    'десерты': '180, 83, 9',        // amber-700
    'фрукты': '250, 204, 21',       // yellow-400
    'напитки': '59, 130, 246',      // blue-500
    'тропики': '45, 212, 191',      // teal-400
    'необычный': '217, 70, 239',    // fuchsia-500
    'цветы': '251, 113, 133',       // rose-400
    'аренда': '52, 211, 153',       // emerald-400
    'премиум': '202, 138, 4',       // yellow-600
    'чайный': '217, 119, 6',        // amber-600
    'холод': '147, 197, 253'        // blue-300
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
    
    let preservedScroll = 0;
    const oldContainer = document.getElementById('vibe-marquee-container');
    if (oldContainer) {
        preservedScroll = oldContainer.scrollLeft;
    }
    
    if (vibes.size === 0) {
        DOM.vibeFilters.innerHTML = '';
        DOM.vibeFilters.classList.add('hidden');
        return;
    } else {
        DOM.vibeFilters.classList.remove('hidden');
    }
    
    let innerHtml = '';
    
    Array.from(vibes).sort().forEach(vibe => {
        const colorClass = VIBE_COLORS[vibe] || 'bg-zinc-300 drop-shadow-[0_0_5px_rgba(212,212,216,0.8)]';
        const isActive = activeVibes.has(vibe) ? 'active bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)] border-white/30' : 'bg-[#111113]/80 text-white/50 border-white/10 hover:text-white/80 hover:bg-white/5';
        innerHtml += `
            <button class="vibe-btn flex items-center gap-2 flex-shrink-0 border rounded-full px-4 py-2 text-[10px] font-display tracking-[0.2em] whitespace-nowrap transition-all ${isActive}" data-vibe="${vibe}">
                <span class="w-1.5 h-1.5 rounded-full ${colorClass}"></span>
                ${vibe.toUpperCase().replace('_', ' ')}
            </button>
        `;
    });
    
    let repeatedHtml = innerHtml.repeat(4);
    
    DOM.vibeFilters.innerHTML = `
        <span class="text-[10px] text-white/50 uppercase tracking-[0.2em] shrink-0 font-display mr-2 z-10 bg-[#070708] pr-2 relative">ВАЙБ:</span>
        <div class="overflow-x-auto hide-scrollbar w-full mask-edges relative flex cursor-grab" id="vibe-marquee-container">
            <div class="flex gap-3 w-max js-marquee-inner px-3">
                <div class="flex gap-3">${repeatedHtml}</div>
                <div class="flex gap-3">${repeatedHtml}</div>
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
    
    const newContainer = document.getElementById('vibe-marquee-container');
    if (newContainer && preservedScroll > 0) {
        newContainer.scrollLeft = preservedScroll;
    }
    
    initJSMarquee('vibe-marquee-container', activeVibes.size > 0 ? 0 : -0.5);
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
             const itemDesc = (item.description || '').toLowerCase();
             const itemFlavor = (item.flavor || '').toLowerCase();

             const hasIngredient = Array.from(activeIngredients).every(ing => {
                 if (ing === 'цитрусы') {
                     return itemVibes.includes('кислый') || 
                            itemDesc.includes('цитрус') || itemFlavor.includes('цитрус') ||
                            itemDesc.includes('лимон') || itemFlavor.includes('лимон') ||
                            itemDesc.includes('апельсин') || itemFlavor.includes('апельсин') ||
                            itemDesc.includes('грейпфрут') || itemFlavor.includes('грейпфрут') ||
                            itemDesc.includes('лайм') || itemFlavor.includes('лайм') ||
                            itemDesc.includes('мандарин') || itemFlavor.includes('мандарин');
                 }
                 return itemVibes.includes(ing);
             });
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

    filteredData.forEach((item, index) => {
        const card = createCard(item);
        // Stagger the reveal transition delay for a cascading effect
        card.style.transitionDelay = `${(index % 12) * 50}ms`;
        DOM.catalogGrid.appendChild(card);
    });

    // Use a small timeout to let the DOM settle before observing, prevents layout thrashing
    setTimeout(() => {
        initScrollReveal();
        
        // Init Vanilla Tilt (strictly desktop only, prevents iOS Safari GPU crash)
        if (window.innerWidth >= 1024 && window.matchMedia("(hover: hover)").matches && window.matchMedia("(pointer: fine)").matches && typeof VanillaTilt !== 'undefined') {
            const cards = Array.from(document.querySelectorAll(".glass-card:not(.tilt-initialized)"));
            if (cards.length > 0) {
                cards.forEach(c => c.classList.add('tilt-initialized'));
                VanillaTilt.init(cards, {
                    max: 8,
                    speed: 400,
                    glare: true,
                    "max-glare": 0.3,
                    scale: 1.02,
                    gyroscope: false
                });
            }
        }
    }, 50);
}

function createCard(item) {
    const div = document.createElement('div');
    const brandLower = (item.brand || '').toLowerCase().trim();
    div.className = `glass-card p-4 rounded-2xl flex flex-col h-full relative overflow-hidden default-neon group reveal-hidden`;
    div.setAttribute('data-brand', brandLower);
    
    let vibeColor = '255, 255, 255'; // default white
    if (item.vibes) {
        const vibesArray = item.vibes.split(',').map(v => v.trim().toLowerCase());
        if (vibesArray.length > 0) {
            const primaryVibe = vibesArray[0];
            if (VIBE_RGB_MAP[primaryVibe]) {
                vibeColor = VIBE_RGB_MAP[primaryVibe];
            }
        }
    }
    div.style.setProperty('--vibe-color', vibeColor);
    
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

    const imageSrc = item.media_url ? `public/${item.media_url}` : '/images/logo.png';
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
             
             <!-- Cyberpunk/Neon Spotlights (Optimized for Mobile GPU, NO blur() or mix-blend) -->
             <div class="absolute top-0 left-0 w-[150%] h-[150%] pointer-events-none transform -translate-x-1/4 -translate-y-1/4" style="background: radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 60%);"></div>
             <div class="absolute bottom-0 right-0 w-[150%] h-[150%] pointer-events-none transform translate-x-1/4 translate-y-1/4" style="background: radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 60%);"></div>
             
             <!-- Image -->
             <img src="${imageSrc}" loading="lazy" class="${imageClass}" alt="${item.flavor}">
             
             <!-- Grounding Shadow -->
             <div class="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent z-20 pointer-events-none"></div>
        </div>
        
        <div class="flex-1 flex flex-col relative z-20">
            <h3 class="text-[10px] text-neutral-500 font-display tracking-[0.3em] uppercase mb-1">${item.brand}</h3>
            <h2 class="text-xl font-alt font-black text-white mb-2 uppercase">${item.flavor}</h2>
            <p class="text-xs text-white/50 mb-4 line-clamp-2 font-alt font-light leading-relaxed">${item.description || ''}</p>
            
            <div class="mt-auto flex flex-col gap-4">
                ${strengthDots}
                <button class="w-full py-3 rounded-lg text-xs font-display tracking-[0.2em] transition-all duration-500 border border-orange-500/20 bg-orange-950/20 text-orange-500/60 shadow-[0_0_10px_rgba(234,88,12,0.1)] group-hover:border-orange-500/40 group-hover:text-orange-400 group-hover:shadow-[0_0_20px_rgba(234,88,12,0.2)] hover:!bg-gradient-to-r hover:!from-orange-500 hover:!to-red-600 hover:!border-orange-400 hover:!text-white hover:!shadow-[0_0_40px_rgba(239,68,68,0.8),inset_0_0_20px_rgba(255,255,255,0.5)] btn-add-cart">
                    В КОРЗИНУ
                </button>
            </div>
        </div>
    `;

    const btnAddCart = div.querySelector('.btn-add-cart');
    if (btnAddCart) {
        btnAddCart.addEventListener('click', () => addToCart(item));
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
            
            // Trigger dive-in animation
            if (DOM.appWrapper) {
                DOM.appWrapper.classList.remove('scale-105', 'opacity-50');
            }
            
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
    if (DOM.btnOpenCart) DOM.btnOpenCart.addEventListener('click', openCartDrawer);
    if (DOM.btnFloatingCart) DOM.btnFloatingCart.addEventListener('click', openCartDrawer);

    // Old location detection listener removed

    // Location detection
    if (DOM.btnDetectLocation) {
        DOM.btnDetectLocation.addEventListener('click', () => {
            if (!navigator.geolocation) {
                showLocationError('Геолокация не поддерживается вашим браузером.');
                return;
            }
            
            DOM.btnDetectLocation.classList.add('animate-pulse');
            if (DOM.locationError) DOM.locationError.classList.add('hidden');
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    fallbackLocationDetection(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    showLocationError('Разрешите доступ к геопозиции или истекло время ожидания.');
                    DOM.btnDetectLocation.classList.remove('animate-pulse');
                },
                { timeout: 10000, maximumAge: 0 }
            );
        });
    }
}

async function fallbackLocationDetection(lat, lon) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=ru`);
        const data = await response.json();
        const city = data.address.city || data.address.town || data.address.state || '';
        
        if (city.toLowerCase().includes('астана') || city.toLowerCase().includes('astana') || city.toLowerCase().includes('нур-султан')) {
            const road = data.address.road || '';
            const house = data.address.house_number || '';
            if (DOM.deliveryAddress) DOM.deliveryAddress.value = `Астана, ${road} ${house}`.trim();
        } else {
            showLocationError('Доставка работает только по городу Астана.');
        }
    } catch(e) {
        showLocationError('Не удалось определить адрес.');
    } finally {
        if (DOM.btnDetectLocation) DOM.btnDetectLocation.classList.remove('animate-pulse');
    }
}

function showLocationError(msg) {
    if (DOM.locationError) {
        DOM.locationError.textContent = msg;
        DOM.locationError.classList.remove('hidden');
    } else {
        alert(msg);
    }
}

// 6. Cart & Modal Logic
function addToCart(item) {
    let itemPrice = item.price ? parseInt(String(item.price).replace(/\D/g, '')) : 0;
    if (isNaN(itemPrice)) itemPrice = 0;

    const existingIndex = cart.findIndex(c => c.item.brand === item.brand && c.item.flavor === item.flavor && c.item.type === item.type);
    
    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({
            cartId: cartIdCounter++,
            item: item,
            quantity: 1,
            price: itemPrice
        });
    }

    updateCartBadge();
    showToast(item);
    renderCartUI();
}

function updateCartBadge() {
    const totalItems = cart.reduce((sum, c) => sum + c.quantity, 0);
    
    // Header Badge
    if (DOM.cartBadge) {
        DOM.cartBadge.textContent = totalItems;
        if (totalItems > 0) {
            DOM.cartBadge.classList.remove('scale-0');
            DOM.cartBadge.classList.add('scale-100');
        } else {
            DOM.cartBadge.classList.remove('scale-100');
            DOM.cartBadge.classList.add('scale-0');
        }
    }
    
    // Floating Mobile Badge
    if (DOM.floatingCartBadge) {
        DOM.floatingCartBadge.textContent = totalItems;
        if (totalItems > 0) {
            DOM.floatingCartBadge.classList.remove('scale-0');
            DOM.floatingCartBadge.classList.add('scale-100');
        } else {
            DOM.floatingCartBadge.classList.remove('scale-100');
            DOM.floatingCartBadge.classList.add('scale-0');
        }
    }
    
    // Floating Mobile Button Visibility
    if (DOM.btnFloatingCart) {
        if (totalItems > 0) {
            DOM.btnFloatingCart.classList.remove('hidden');
        } else {
            DOM.btnFloatingCart.classList.add('hidden');
        }
    }
}

function showToast(item) {
    if (!DOM.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'bg-[#111113]/95 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-2xl flex items-center gap-4 transform translate-y-full opacity-0 transition-all duration-500';
    
    const imgSrc = item.media_url ? `public/${item.media_url}` : '/images/logo.png';
    toast.innerHTML = `
        <div class="w-10 h-10 bg-black rounded border border-white/5 p-1 shrink-0">
            <img src="${imgSrc}" class="w-full h-full object-contain" onerror="this.src='/images/logo.png'">
        </div>
        <div class="flex-1">
            <p class="text-[10px] text-sky-400 font-display tracking-widest mb-0.5">ДОБАВЛЕНО</p>
            <p class="text-sm font-alt font-bold leading-tight line-clamp-1">${item.brand} - ${item.flavor}</p>
        </div>
    `;
    
    DOM.toastContainer.appendChild(toast);
    
    // Dismiss on click
    toast.addEventListener('click', () => {
        toast.classList.add('translate-y-full', 'opacity-0');
        setTimeout(() => toast.remove(), 500);
    });
    
    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-full', 'opacity-0');
    });
    
    setTimeout(() => {
        if (toast.parentNode) {
            toast.classList.add('translate-y-full', 'opacity-0');
            setTimeout(() => {
                if (toast.parentNode) toast.remove();
            }, 500);
        }
    }, 3000);
}

function removeFromCart(cartId) {
    cart = cart.filter(c => c.cartId !== cartId);
    updateCartBadge();
    renderCartUI();
}

function updateQuantity(cartId, delta) {
    const cartItem = cart.find(c => c.cartId === cartId);
    if (cartItem) {
        cartItem.quantity += delta;
        if (cartItem.quantity < 1) cartItem.quantity = 1;
        if (cartItem.quantity > 99) cartItem.quantity = 99;
        updateCartBadge();
        renderCartUI();
    }
}

function openCartDrawer() {
    renderCartUI();
    
    // Reset modal state
    if (DOM.deliveryAddress) DOM.deliveryAddress.value = '';
    if (DOM.modalTabBtns && DOM.modalTabBtns.length > 0) DOM.modalTabBtns[0].click(); 
    
    if (DOM.orderModal) {
        DOM.orderModal.classList.remove('hidden');
        if (typeof initYandexSuggest !== 'undefined') setTimeout(initYandexSuggest, 50);
        
        // Initialize Yandex Suggest now that the input is visible
        setTimeout(() => {
            initYandexSuggest();
        }, 50);

        setTimeout(() => {
            DOM.orderModal.classList.remove('opacity-0');
            if (DOM.orderModalContent) {
                DOM.orderModalContent.classList.remove('translate-y-full', 'md:translate-x-full');
            }
        }, 20);
    }
}

function renderCartUI() {
    if (!DOM.cartItemsContainer || !DOM.cartEmptyState) return;
    
    DOM.cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        DOM.cartItemsContainer.classList.add('hidden');
        DOM.cartEmptyState.classList.remove('hidden');
        if (DOM.btnConfirmOrder) DOM.btnConfirmOrder.classList.add('opacity-50', 'pointer-events-none');
        if (DOM.cartTotalPrice) DOM.cartTotalPrice.textContent = '0 ₸';
        return;
    }
    
    DOM.cartItemsContainer.classList.remove('hidden');
    DOM.cartEmptyState.classList.add('hidden');
    if (DOM.btnConfirmOrder) DOM.btnConfirmOrder.classList.remove('opacity-50', 'pointer-events-none');
    
    let grandTotal = 0;
    
    cart.forEach(c => {
        grandTotal += c.price * c.quantity;
        const item = c.item;
        const imgSrc = item.media_url ? `public/${item.media_url}` : '/images/logo.png';
        const badgeText = item.type === 'Аренда' ? 'Аренда' : 'Покупка';
        const priceText = c.price > 0 ? `${c.price.toLocaleString('ru-RU')} ₸` : 'Уточняется';
        
        const div = document.createElement('div');
        div.className = 'bg-[#111113]/80 border border-white/10 rounded-xl p-4 flex flex-col gap-4 relative overflow-hidden shrink-0';
        div.innerHTML = `
            <div class="absolute top-0 right-0 bg-white/10 text-[9px] font-display tracking-[0.2em] px-3 py-1 rounded-bl-xl border-b border-l border-white/10 text-white/80">${badgeText}</div>
            <button class="btn-remove absolute top-8 right-2 p-2 text-white/30 hover:text-red-400 transition-colors" data-id="${c.cartId}">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <div class="flex items-center gap-4">
                <div class="w-16 h-16 bg-[#050507] rounded-lg border border-white/5 flex items-center justify-center p-2 relative overflow-hidden shrink-0">
                    <img src="${imgSrc}" class="w-full h-full object-contain relative z-10" onerror="this.src='/images/logo.png'">
                </div>
                <div class="pr-8">
                    <h4 class="text-[9px] text-neutral-500 font-display tracking-[0.2em] uppercase mb-1">${item.brand || 'S.KAYFOM'}</h4>
                    <h3 class="text-sm font-alt font-bold leading-tight line-clamp-2">${item.flavor || ''}</h3>
                </div>
            </div>
            <div class="flex items-center justify-between mt-2 pt-4 border-t border-white/5">
                <div class="flex items-center bg-black/50 border border-white/10 rounded-lg overflow-hidden">
                    <button class="btn-qty-minus px-4 py-2 text-white/50 hover:text-white hover:bg-white/10 transition-colors font-bold text-lg leading-none select-none touch-manipulation">−</button>
                    <span class="px-2 py-2 text-sm font-bold min-w-[2.5rem] text-center font-alt">${c.quantity}</span>
                    <button class="btn-qty-plus px-4 py-2 text-white/50 hover:text-white hover:bg-white/10 transition-colors font-bold text-lg leading-none select-none touch-manipulation">+</button>
                </div>
                <div class="text-right">
                    <span class="text-[9px] text-white/40 block mb-0.5 font-display tracking-[0.2em]">ЦЕНА</span>
                    <span class="font-alt font-bold text-sm text-sky-400">${priceText}</span>
                </div>
            </div>
        `;
        
        div.querySelector('.btn-remove').addEventListener('click', () => removeFromCart(c.cartId));
        div.querySelector('.btn-qty-minus').addEventListener('click', () => updateQuantity(c.cartId, -1));
        div.querySelector('.btn-qty-plus').addEventListener('click', () => updateQuantity(c.cartId, 1));
        
        DOM.cartItemsContainer.appendChild(div);
    });
    
    if (DOM.cartTotalPrice) {
        DOM.cartTotalPrice.textContent = grandTotal > 0 ? `${grandTotal.toLocaleString('ru-RU')} ₸` : 'Уточняется';
    }
}

function closeOrderModal() {
    if (DOM.orderModal) DOM.orderModal.classList.add('opacity-0');
    if (DOM.orderModalContent) {
        DOM.orderModalContent.classList.add('translate-y-full', 'md:translate-x-full');
    }
    
    setTimeout(() => {
        if (DOM.orderModal) DOM.orderModal.classList.add('hidden');
        selectedItemForOrder = null;
    }, 300);
}

// 7. WhatsApp Logic
function generateWhatsAppLink() {
    if (cart.length === 0) return;

    let method = 'Доставка';
    if (DOM.modalTabBtns) {
        DOM.modalTabBtns.forEach(btn => {
            if (btn.classList.contains('active')) {
                method = btn.dataset.method;
            }
        });
    }

    let address = '';
    if (method === 'Доставка' && DOM.deliveryAddress) {
        address = DOM.deliveryAddress.value.trim();
        if (!address) {
            alert('Пожалуйста, укажите адрес доставки.');
            return;
        }
        if (DOM.deliveryEntrance && DOM.deliveryEntrance.value.trim()) address += `, подъезд ${DOM.deliveryEntrance.value.trim()}`;
        if (DOM.deliveryFloor && DOM.deliveryFloor.value.trim()) address += `, этаж ${DOM.deliveryFloor.value.trim()}`;
        if (DOM.deliveryApartment && DOM.deliveryApartment.value.trim()) address += `, кв. ${DOM.deliveryApartment.value.trim()}`;
    }

    // Trigger smoke effect for WOW factor on checkout
    triggerSmoke(1000);

    setTimeout(() => {
        let text = `Привет! Хочу оформить заказ:\n\n`;
        let grandTotal = 0;
        
        cart.forEach((c, index) => {
            const item = c.item;
            const lineTotal = c.price * c.quantity;
            grandTotal += lineTotal;
            
            const badge = item.type === 'Аренда' ? 'Аренда' : 'Магазин';
            const str = item.strength ? `(Крепость: ${item.strength}) ` : '';
            text += `${index + 1}. [${badge}] ${item.brand || 'S.KAYFOM'} - ${item.flavor || ''} ${str}(x${c.quantity})`;
            if (c.price > 0) text += ` = ${lineTotal.toLocaleString('ru-RU')} ₸`;
            text += `\n`;
        });
        
        text += `\n----------------\n`;
        if (grandTotal > 0) {
            text += `Итого: ${grandTotal.toLocaleString('ru-RU')} ₸ (без учета доставки)\n`;
        }
        
        if (method === 'Доставка') {
            text += `Способ получения: Доставка\nАдрес: ${address}`;
        } else {
            text += `Способ получения: Самовывоз`;
        }

        const encodedText = encodeURIComponent(text);
        const waUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}?text=${encodedText}`;
        window.open(waUrl, '_blank');
        
        // Optional: clear cart after opening WA
        // cart = [];
        // updateCartBadge();
        closeOrderModal();
    }, 800);
}// Ensure it initializes
document.addEventListener('DOMContentLoaded', () => {
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

function initReviewsSlider() {
    const track = document.getElementById('reviews-slider-track');
    if (!track) return;
    
    // We have 3 original slides
    const slides = Array.from(track.querySelectorAll('.review-slide'));
    if (slides.length <= 1) return;
    
    let currentIndex = 0;
    const totalSlides = slides.length - 1; // 3 original + 1 clone = 4 slides total. totalSlides original is 3.
    
    setInterval(() => {
        currentIndex++;
        
        // Calculate the height of one slide + margin
        // Typically p-4 + mb-4 = 16px padding + 16px margin. We can just use offsetHeight + 16 (for mb-4 gap)
        const slideHeight = slides[0].offsetHeight + 16;
        
        track.style.transition = 'transform 0.7s cubic-bezier(0.25, 1, 0.5, 1)';
        track.style.transform = `translateY(-${currentIndex * slideHeight}px)`;
        
        // If we reached the clone, jump back to start seamlessly
        if (currentIndex === totalSlides) {
            setTimeout(() => {
                track.style.transition = 'none';
                currentIndex = 0;
                track.style.transform = `translateY(0)`;
            }, 700); // wait for the transition to finish
        }
    }, 5000);
}

// Call on load
document.addEventListener('DOMContentLoaded', () => {
    initReviewsSlider();
});




// Custom autocomplete removed

let deliveryMap = null;
let deliveryPlacemark = null;

function initDeliveryMap() {
    if (typeof ymaps === 'undefined') return;
    ymaps.ready(() => {
        const container = document.getElementById('delivery-map-container');
        if (!container) return;
        const btnToggleMap = document.getElementById('btn-toggle-map');
        if (btnToggleMap) {
            btnToggleMap.addEventListener('click', () => {
                if (container.classList.contains('hidden')) {
                    container.classList.remove('hidden');
                    if (!deliveryMap) {
                        deliveryMap = new ymaps.Map('delivery-map', { center: [51.128207, 71.430411], zoom: 13, controls: ['zoomControl'] });
                        deliveryMap.events.add('click', function (e) {
                            var coords = e.get('coords');
                            updateAddressFromCoords(coords[0], coords[1]);
                        });
                    }
                } else { container.classList.add('hidden'); }
            });
        }
    });
}

function updateAddressFromCoords(lat, lon) {
    if (deliveryPlacemark) { deliveryPlacemark.geometry.setCoordinates([lat, lon]); }
    else { deliveryPlacemark = new ymaps.Placemark([lat, lon], {}, { preset: 'islands#redDotIcon' }); deliveryMap.geoObjects.add(deliveryPlacemark); }
    
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=ru`).then(r=>r.json()).then(data => {
        const city = data.address.city || data.address.town || data.address.state || '';
        if (city.toLowerCase().includes('\u0430\u0441\u0442\u0430\u043d\u0430') || city.toLowerCase().includes('astana') || city.toLowerCase().includes('\u043d\u0443\u0440-\u0441\u0443\u043b\u0442\u0430\u043d')) {
            const road = data.address.road || '';
            const house = data.address.house_number || '';
            if (document.getElementById('delivery-address')) document.getElementById('delivery-address').value = `\u0410\u0441\u0442\u0430\u043d\u0430, ${road} ${house}`.trim();
            if (document.getElementById('location-error')) document.getElementById('location-error').classList.add('hidden');
        } else {
            if (document.getElementById('location-error')) { document.getElementById('location-error').textContent = '\u0414\u043e\u0441\u0442\u0430\u0432\u043a\u0430 \u0440\u0430\u0431\u043e\u0442\u0430\u0435\u0442 \u0442\u043e\u043b\u044c\u043a\u043e \u043f\u043e \u0433\u043e\u0440\u043e\u0434\u0443 \u0410\u0441\u0442\u0430\u043d\u0430. \u0412\u0430\u0448 \u0432\u044b\u0431\u043e\u0440: ' + city; document.getElementById('location-error').classList.remove('hidden'); }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initDeliveryMap, 1000);
});
