import { cart, updateQuantity, removeFromCart, getCartTotal, getCartCount } from '../../entities/cart/index.js';

let DOM = {};
let selectedItemForOrder = null;

export function initCartDrawer(domElements) {
    DOM = domElements;
}

export function openCartDrawer() {
    renderCartUI();
    
    if (DOM.deliveryAddress) DOM.deliveryAddress.value = '';
    if (DOM.modalTabBtns && DOM.modalTabBtns.length > 0) DOM.modalTabBtns[0].click(); 
    
    if (DOM.orderModal) {
        DOM.orderModal.classList.remove('hidden');
        
        // Initialize Yandex Suggest now that the input is visible (will be handled by checkout feature)
        const event = new CustomEvent('skayfom:init-yandex-suggest');
        document.dispatchEvent(event);

        setTimeout(() => {
            DOM.orderModal.classList.remove('opacity-0');
            if (DOM.orderModalContent) {
                DOM.orderModalContent.classList.remove('translate-y-full', 'md:translate-x-full');
            }
        }, 20);
    }
}

export function renderCartUI() {
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

export function closeOrderModal() {
    if (DOM.orderModal) DOM.orderModal.classList.add('opacity-0');
    if (DOM.orderModalContent) {
        DOM.orderModalContent.classList.add('translate-y-full', 'md:translate-x-full');
    }
    
    setTimeout(() => {
        if (DOM.orderModal) DOM.orderModal.classList.add('hidden');
        selectedItemForOrder = null;
    }, 300);
}
