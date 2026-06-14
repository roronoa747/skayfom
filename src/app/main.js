// S.KAYFOM STORE - Main Logic
import { initJSMarquee } from '../shared/ui/marquee.js';
import { triggerSmoke } from '../shared/ui/loader.js';
import { initScrollReveal } from '../shared/ui/scroll.js';
import { loadCatalogData } from '../shared/api/catalog.js';
import { createCard } from '../entities/product/ui.js';
import { cart, addToCart, updateQuantity, removeFromCart, getCartTotal, getCartCount, subscribeToCart } from '../entities/cart/model.js';
import { createCartItemElement } from '../entities/cart/ui.js';
import { VIBE_COLORS, VIBE_RGB_MAP } from '../shared/lib/constants.js';

import { state as filterState, subscribeToFilters, setTab, setSearchQuery, setProductCategory, setStrength } from '../features/filters/model.js';
import { renderBrandFilters, renderVibeFilters, initStaticFilters } from '../features/filters/ui.js';
import { initMixBuilderUI } from '../features/mixBuilder/ui.js';
import { renderCatalog as renderCatalogWidget } from '../widgets/catalog/ui.js';

const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1EpBXaSdDobu1M5d2U2HNC7lflFHAD0bholw0uIsXoqU/export?format=csv';
// const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1EpBXaSdDobu1M5d2U2HNC7lflFHAD0bholw0uIsXoqU/export?format=csv';
// const GOOGLE_SHEET_CSV_URL = 'catalog_template.csv';
const FALLBACK_CSV = 'catalog_template.csv';
const WHATSAPP_NUMBER = '+77066458965';

// State
export let catalogData = [];

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
        subscribeToCart(renderCartUI);
        
        subscribeToFilters(() => {
            renderBrandFilters(catalogData, 'brand-filters');
            renderVibeFilters(catalogData, 'vibe-filters');
            renderCatalogWidget(catalogData, filterState, DOM, handleAddToCart);
        });

        loadCatalogData(GOOGLE_SHEET_CSV_URL + '&t=' + new Date().getTime(), FALLBACK_CSV)
            .then(data => {
                catalogData = data;
                renderBrandFilters(catalogData, 'brand-filters');
                renderVibeFilters(catalogData, 'vibe-filters');
                renderCatalogWidget(catalogData, filterState, DOM, handleAddToCart);
            })
            .catch(err => {
                showErrorState();
            });
    } catch (error) {
        console.error("Initialization error:", error);
    }
}

export function showToast(message) {
    if (!DOM.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'bg-[#111113]/95 backdrop-blur-xl border border-sky-500/30 text-white px-6 py-4 rounded-xl shadow-[0_10px_30px_rgba(14,165,233,0.15)] flex items-center gap-3 transform translate-y-full opacity-0 transition-all duration-300 pointer-events-auto';
    toast.innerHTML = `
        <div class="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <div>
            <p class="font-display font-bold text-[10px] tracking-[0.1em] text-white/50 mb-0.5">СТАТУС</p>
            <p class="font-alt text-sm">${message}</p>
        </div>
    `;
    DOM.toastContainer.appendChild(toast);
    
    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-full', 'opacity-0');
    });
    
    setTimeout(() => {
        toast.classList.add('translate-y-full', 'opacity-0');
        setTimeout(() => {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 300);
    }, 3000);
}

function handleAddToCart(item) {
    addToCart(item);
    const itemName = item.flavor || item.brand || 'Товар';
    showToast(`«${itemName}» добавлен в корзину`);
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
// handlePreorder logic was moved to Cart logic

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
    const count = getCartCount();
    
    if (DOM.cartBadge) {
        DOM.cartBadge.textContent = count;
        if (count > 0) {
            DOM.cartBadge.classList.remove('scale-0');
            DOM.cartBadge.classList.add('scale-100');
        } else {
            DOM.cartBadge.classList.add('scale-0');
            DOM.cartBadge.classList.remove('scale-100');
        }
    }
    
    if (DOM.floatingCartBadge) {
        DOM.floatingCartBadge.textContent = count;
        if (count > 0) {
            DOM.floatingCartBadge.classList.remove('scale-0');
            DOM.floatingCartBadge.classList.add('scale-100');
            if (DOM.btnFloatingCart) DOM.btnFloatingCart.classList.remove('hidden');
        } else {
            DOM.floatingCartBadge.classList.add('scale-0');
            DOM.floatingCartBadge.classList.remove('scale-100');
            if (DOM.btnFloatingCart) DOM.btnFloatingCart.classList.add('hidden');
        }
    }

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
        const imagePath = item.media_url ? item.media_url.replace(/^images\//, '') : `catalog/${item.id}.png`;
        const imgSrc = `./images/${imagePath}`;
        const badgeText = item.type === 'Аренда' ? 'Аренда' : 'Покупка';
        const priceText = c.price > 0 ? `${c.price.toLocaleString('ru-RU')} ₸` : 'Уточняется';
        
        const inStock = String(item.in_stock).toLowerCase() === 'true' || String(item.in_stock).toLowerCase() === 'да';
        const priceTextHtml = inStock 
            ? `<span class="font-alt font-bold text-sm text-sky-400">${c.price > 0 ? `${(c.price * c.quantity).toLocaleString('ru-RU')} ₸` : 'Уточняется'}</span>`
            : `<div class="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5 mt-1 rounded text-center leading-tight">Предзаказ</div>`;
        
        const div = document.createElement('div');
        div.className = 'bg-[#111113]/80 border border-white/10 rounded-xl p-4 flex flex-col gap-4 relative overflow-hidden shrink-0';
        div.innerHTML = `
            <div class="absolute top-0 right-0 bg-white/10 text-[9px] font-display tracking-[0.2em] px-3 py-1 rounded-bl-xl border-b border-l border-white/10 text-white/80">${badgeText}</div>
            <button class="btn-remove absolute top-8 right-2 p-2 text-white/30 hover:text-red-400 transition-colors" data-id="${c.cartId}">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <div class="flex items-center gap-4">
                <div class="w-16 h-16 bg-[#050507] rounded-lg border border-white/5 flex items-center justify-center p-2 relative overflow-hidden shrink-0">
                    <img src="${imgSrc}" class="w-full h-full object-contain relative z-10" onerror="this.src='./images/logo.png'">
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
                    <span class="text-[9px] text-white/40 block font-display tracking-[0.2em]">ЦЕНА</span>
                    ${priceTextHtml}
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
            const inStock = String(item.in_stock).toLowerCase() === 'true' || String(item.in_stock).toLowerCase() === 'да';
            const preorderText = !inStock ? ' [Предзаказ / Сообщить при поступлении]' : '';
            text += `${index + 1}. [${badge}] ${item.brand || 'S.KAYFOM'} - ${item.flavor || ''} ${str}(x${c.quantity})${preorderText}`;
            if (c.price > 0 && inStock) text += ` = ${lineTotal.toLocaleString('ru-RU')} ₸`;
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
