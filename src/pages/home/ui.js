import { loadCatalogData, loadCitiesData } from '../../shared/api/catalog.js';
import { addToCart, subscribeToCart } from '../../entities/cart/index.js';
import { state as filterState, subscribeToFilters, setTab, setSearchQuery, setProductCategory, setStrength } from '../../features/filters/index.js';
import { renderBrandFilters, renderVibeFilters, initStaticFilters } from '../../features/filters/index.js';
import { initMixBuilderUI } from '../../features/mixBuilder/index.js';
import { renderCatalog as renderCatalogWidget } from '../../widgets/catalog/index.js';

import { initAgeGate } from '../../widgets/ageGate/index.js';
import { initReviewsSlider } from '../../widgets/reviews/index.js';
import { initInstagramFeed } from '../../widgets/instagramFeed/index.js';
import { initCartDrawer, openCartDrawer, renderCartUI, closeOrderModal } from '../../widgets/cartDrawer/index.js';
import { initCheckout } from '../../features/checkout/index.js';
import { initToast, showToast as showToastShared } from '../../shared/ui/toast/index.js';

const FALLBACK_CSV = 'catalog_template.csv';
const CITIES_CSV_URL = import.meta.env.VITE_CITIES_CSV_URL || 'cities_template.csv';

export let catalogData = [];
export let rawCatalogData = [];
export let citiesData = [];
export let currentCity = localStorage.getItem('skayfom_city');
export let currentCityConfig = null;

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
    // City Modal & Notification
    DOM.cityModal = document.getElementById('city-modal');
    DOM.cityModalContent = document.getElementById('city-modal-content');
    DOM.cityButtons = document.querySelectorAll('.city-select-btn');
    DOM.btnChangeCity = document.getElementById('btn-change-city');
    DOM.cityNotification = document.getElementById('city-notification');
    DOM.btnCityYes = document.getElementById('btn-city-yes');
    DOM.btnCityOther = document.getElementById('btn-city-other');
    DOM.btnCityModalClose = document.getElementById('btn-city-modal-close');
}

function handleAddToCart(item) {
    addToCart(item);
    const itemName = item.flavor || item.brand || 'Товар';
    showToastShared(`«${itemName}» добавлен в корзину`);
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
    initToast(DOM.toastContainer);
    
    // Initialize external widgets & features
    initAgeGate(DOM);
    initCartDrawer(DOM);
    initCheckout(DOM);
    
    initReviewsSlider();
    initInstagramFeed();

    // Event Listeners for local logic
    initLocalEventListeners();

    // Store Subscriptions
    subscribeToCart(renderCartUI);
    subscribeToFilters(() => {
        renderBrandFilters(catalogData, 'brand-filters');
        renderVibeFilters(catalogData, 'vibe-filters');
        renderCatalogWidget(catalogData, filterState, DOM, handleAddToCart);
    });

    // Load Cities First
    loadCitiesData(CITIES_CSV_URL).then(cities => {
        citiesData = cities;

        if (!currentCity) {
            // Apply default city in the background but don't save to localStorage yet
            applyCity(citiesData[0].city, false);
            // Show notification after a short delay for animation
            setTimeout(() => {
                DOM.cityNotification?.classList.remove('translate-y-24', 'opacity-0', 'pointer-events-none');
            }, 1000);
        } else {
            applyCity(currentCity, true);
        }
    }).catch(err => {
        console.error("Failed to load cities", err);
        showErrorState();
    });
}

function applyCity(cityName, save = true) {
    currentCity = cityName;
    if (save) {
        localStorage.setItem('skayfom_city', cityName);
    }
    currentCityConfig = citiesData.find(c => c.city === cityName) || citiesData[0];
    
    if (DOM.btnChangeCity) {
        DOM.btnChangeCity.textContent = cityName;
    }

    // Load catalog for this specific city
    const catalogUrl = currentCityConfig.catalog_url || FALLBACK_CSV;
    loadCatalogData(catalogUrl + (catalogUrl.includes('?') ? '&' : '?') + 't=' + new Date().getTime(), FALLBACK_CSV)
        .then(catalog => {
            rawCatalogData = catalog;
            catalogData = rawCatalogData; // No need to filter by city column anymore!
            
            renderBrandFilters(catalogData, 'brand-filters');
            renderVibeFilters(catalogData, 'vibe-filters');
            renderCatalogWidget(catalogData, filterState, DOM, handleAddToCart);
        })
        .catch(err => {
            showErrorState();
        });

    document.dispatchEvent(new CustomEvent('skayfom:city-changed', { detail: { city: currentCityConfig } }));

    // Update map if needed
    updateMap();
}

function updateMap() {
    if (!currentCityConfig) return;
    const { map_lat, map_lng, map_address, whatsapp } = currentCityConfig;
    
    // Update footer map
    const mapIframes = document.querySelectorAll('iframe[src*="yandex.ru/map-widget"]');
    mapIframes.forEach(iframe => {
        iframe.src = `https://yandex.ru/map-widget/v1/?ll=${map_lng},${map_lat}&z=17&pt=${map_lng},${map_lat},pm2rdm`;
    });

    // Update footer address
    const footerAddress = document.querySelector('p.text-xs.text-white\\/60.mb-3');
    if (footerAddress) {
        footerAddress.textContent = map_address;
    }

    // Update B2B WhatsApp link
    const b2bLink = document.querySelector('#b2b-modal-content a[href*="wa.me"]');
    if (b2bLink && whatsapp) {
        b2bLink.href = `https://wa.me/${whatsapp.replace(/\\D/g, '')}`;
    }
}

function initLocalEventListeners() {
    // City selection logic
    if (DOM.btnCityYes) {
        DOM.btnCityYes.addEventListener('click', () => {
            DOM.cityNotification?.classList.add('translate-y-24', 'opacity-0', 'pointer-events-none');
            applyCity(currentCity || citiesData[0].city, true);
        });
    }

    if (DOM.btnCityOther) {
        DOM.btnCityOther.addEventListener('click', () => {
            DOM.cityNotification?.classList.add('translate-y-24', 'opacity-0', 'pointer-events-none');
            DOM.btnCityModalClose?.classList.remove('hidden');
            DOM.cityModal?.classList.remove('hidden');
            setTimeout(() => {
                DOM.cityModal?.classList.remove('opacity-0', 'pointer-events-none');
                DOM.cityModalContent?.classList.remove('scale-95');
                DOM.cityModalContent?.classList.add('scale-100');
            }, 10);
        });
    }

    if (DOM.cityButtons) {
        DOM.cityButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const city = e.target.dataset.city;
                DOM.cityModal?.classList.add('opacity-0', 'pointer-events-none');
                DOM.cityModalContent?.classList.remove('scale-100');
                DOM.cityModalContent?.classList.add('scale-95');
                setTimeout(() => DOM.cityModal?.classList.add('hidden'), 500);
                applyCity(city, true);
            });
        });
    }

    if (DOM.btnChangeCity) {
        DOM.btnChangeCity.addEventListener('click', () => {
            DOM.btnCityModalClose?.classList.remove('hidden');
            DOM.cityModal?.classList.remove('hidden');
            setTimeout(() => {
                DOM.cityModal?.classList.remove('opacity-0', 'pointer-events-none');
                DOM.cityModalContent?.classList.remove('scale-95');
                DOM.cityModalContent?.classList.add('scale-100');
            }, 10);
        });
    }

    if (DOM.btnCityModalClose) {
        DOM.btnCityModalClose.addEventListener('click', () => {
            DOM.cityModal?.classList.add('opacity-0', 'pointer-events-none');
            DOM.cityModalContent?.classList.remove('scale-100');
            DOM.cityModalContent?.classList.add('scale-95');
            setTimeout(() => DOM.cityModal?.classList.add('hidden'), 500);
        });
    }

    initStaticFilters(DOM, {
        onTabChange: (tab) => {
            setTab(tab);
            if (tab === 'Аренда') {
                const catBtns = document.querySelectorAll('.cat-btn');
                catBtns.forEach(btn => {
                    if (btn.dataset.cat === 'Табаки') {
                        btn.click();
                    }
                });
            }
            if (DOM.mixBuilderContainer) {
                DOM.mixBuilderContainer.style.display = tab === 'Аренда' ? 'none' : 'block';
            }
        },
        onSearch: (q) => setSearchQuery(q),
        onCategoryChange: (cat) => setProductCategory(cat),
        onStrengthChange: (s) => setStrength(s)
    });

    initMixBuilderUI(DOM, {
        onAddToCart: handleAddToCart
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


