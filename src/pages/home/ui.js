import { loadCatalogData } from '../../shared/api/catalog.js';
import { addToCart, subscribeToCart } from '../../entities/cart/model.js';
import { state as filterState, subscribeToFilters, setTab, setSearchQuery, setProductCategory, setStrength } from '../../features/filters/model.js';
import { renderBrandFilters, renderVibeFilters, initStaticFilters } from '../../features/filters/ui.js';
import { initMixBuilderUI } from '../../features/mixBuilder/ui.js';
import { renderCatalog as renderCatalogWidget } from '../../widgets/catalog/ui.js';

import { initAgeGate } from '../../widgets/ageGate/ui.js';
import { initReviewsSlider } from '../../widgets/reviews/ui.js';
import { initInstagramFeed } from '../../widgets/instagramFeed/ui.js';
import { initCartDrawer, openCartDrawer, renderCartUI, closeOrderModal } from '../../widgets/cartDrawer/ui.js';
import { initCheckout } from '../../features/checkout/ui.js';

const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1EpBXaSdDobu1M5d2U2HNC7lflFHAD0bholw0uIsXoqU/export?format=csv';
const FALLBACK_CSV = 'catalog_template.csv';
const WHATSAPP_NUMBER = '+77066458965';

export let catalogData = [];
const DOM = {};

export function initDOM() {
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
    
    // Modal & Cart
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

    // B2B & App
    DOM.btnB2b = document.getElementById('btn-b2b');
    DOM.b2bModal = document.getElementById('b2b-modal');
    DOM.b2bModalContent = document.getElementById('b2b-modal-content');
    DOM.b2bModalClose = document.getElementById('b2b-modal-close');
    DOM.appWrapper = document.getElementById('app-wrapper');
    
    // Location
    DOM.btnDetectLocation = document.getElementById('btn-detect-location');
    DOM.locationError = document.getElementById('location-error');
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
    
    requestAnimationFrame(() => toast.classList.remove('translate-y-full', 'opacity-0'));
    setTimeout(() => {
        toast.classList.add('translate-y-full', 'opacity-0');
        setTimeout(() => toast.parentNode && toast.parentNode.removeChild(toast), 300);
    }, 3000);
}

function handleAddToCart(item) {
    addToCart(item);
    const itemName = item.flavor || item.brand || 'Товар';
    showToast(`«${itemName}» добавлен в корзину`);
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

export function initHome() {
    initDOM();
    
    // Initialize external widgets & features
    initAgeGate(DOM);
    initCartDrawer(DOM);
    initCheckout(DOM);
    
    initReviewsSlider();
    initInstagramFeed();
    initResponsiveMixBuilder();

    // Event Listeners for local logic
    initLocalEventListeners();

    // Store Subscriptions
    subscribeToCart(renderCartUI);
    subscribeToFilters(() => {
        renderBrandFilters(catalogData, 'brand-filters');
        renderVibeFilters(catalogData, 'vibe-filters');
        renderCatalogWidget(catalogData, filterState, DOM, handleAddToCart);
    });

    // Load Data
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
}

function initLocalEventListeners() {
    initStaticFilters(DOM, {
        onTabChange: (tab) => {
            setTab(tab);
            if (DOM.mixBuilderContainer) {
                DOM.mixBuilderContainer.style.display = tab === 'Аренда' ? 'none' : 'block';
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

    // Modal Actions
    if (DOM.modalClose) DOM.modalClose.addEventListener('click', closeOrderModal);
    if (DOM.orderModal) DOM.orderModal.addEventListener('click', (e) => {
        if(e.target === DOM.orderModal) closeOrderModal();
    });

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

    if (DOM.btnOpenCart) DOM.btnOpenCart.addEventListener('click', openCartDrawer);
    if (DOM.btnFloatingCart) DOM.btnFloatingCart.addEventListener('click', openCartDrawer);

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
}

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
    moveMixBuilder();
    window.addEventListener('resize', moveMixBuilder, { passive: true });
}
