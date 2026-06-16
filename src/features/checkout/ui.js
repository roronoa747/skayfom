import { cart } from '../../entities/cart/model.js';
import { triggerSmoke } from '../../shared/ui/loader.js';
import { closeOrderModal } from '../../widgets/cartDrawer/ui.js';

let DOM = {};
const WHATSAPP_NUMBER = '+77066458965';

export function initCheckout(domElements) {
    DOM = domElements;

    if (DOM.btnDetectLocation) {
        DOM.btnDetectLocation.addEventListener('click', handleDetectLocation);
    }
    
    if (DOM.btnConfirmOrder) {
        DOM.btnConfirmOrder.addEventListener('click', generateWhatsAppLink);
    }
    
    document.addEventListener('skayfom:init-yandex-suggest', initYandexSuggest);
}

let isYandexSuggestInitialized = false;
function initYandexSuggest() {
    if (isYandexSuggestInitialized) return;
    const addressInput = DOM.deliveryAddress || document.getElementById('delivery-address');
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
                        const rawDl = item.display_name.toLowerCase();
                        if (!rawDl.includes('\u0430\u0441\u0442\u0430\u043d\u0430') && !rawDl.includes('astana') && !rawDl.includes('\u043d\u0443\u0440-\u0441\u0443\u043b\u0442\u0430\u043d')) return;
                        
                        let street = item.address.road || item.address.residential || '';
                        let house = item.address.house_number || '';
                        let dname = `${street} ${house}`.trim();
                        if (!dname) dname = item.display_name.split(',')[0];
                        
                        const displayText = dname || item.display_name;
                        
                        // Strict query match against what the user ACTUALLY sees, handling kz letters
                        const normalize = (s) => s.toLowerCase().replace(/ұ/g, 'у').replace(/қ/g, 'к').replace(/ғ/g, 'г').replace(/і/g, 'и').replace(/ә/g, 'а').replace(/ң/g, 'н').replace(/ө/g, 'о');
                        const dl = normalize(displayText);
                        const qWords = normalize(query).split(' ').filter(w => w.trim().length > 0);
                        
                        const match = qWords.every(w => dl.includes(w));
                        if (!match) return;
                        
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

function handleDetectLocation() {
    if (!navigator.geolocation) {
        showLocationError('Геолокация не поддерживается вашим браузером.');
        return;
    }
    
    if (DOM.btnDetectLocation) DOM.btnDetectLocation.classList.add('animate-pulse');
    if (DOM.locationError) DOM.locationError.classList.add('hidden');
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            fallbackLocationDetection(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
            showLocationError('Разрешите доступ к геопозиции или истекло время ожидания.');
            if (DOM.btnDetectLocation) DOM.btnDetectLocation.classList.remove('animate-pulse');
        },
        { timeout: 10000, maximumAge: 0 }
    );
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

    triggerSmoke(DOM, 1000);

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
        
        closeOrderModal();
    }, 800);
}
