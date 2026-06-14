export function createCartItemElement(c, onUpdateQuantity, onRemove) {
    const div = document.createElement('div');
    div.className = 'flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5';
    
    const imageSrc = c.item.media_url ? `/images/${c.item.media_url}` : '/images/logo.png';
    
    div.innerHTML = `
        <div class="w-16 h-16 bg-black/50 rounded-lg flex items-center justify-center p-2">
            <img src="${imageSrc}" class="w-full h-full object-contain" alt="">
        </div>
        <div class="flex-1">
            <div class="text-xs text-white/50">${c.item.brand}</div>
            <div class="text-sm font-bold text-white mb-2">${c.item.flavor}</div>
            <div class="flex items-center gap-3">
                <button class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors btn-minus">-</button>
                <span class="text-sm font-bold w-4 text-center">${c.quantity}</span>
                <button class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors btn-plus">+</button>
            </div>
        </div>
        <div class="flex flex-col items-end gap-2">
            <button class="text-white/30 hover:text-red-500 transition-colors btn-remove">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
            <div class="text-sm font-bold text-sky-400">${c.price * c.quantity} ₸</div>
        </div>
    `;
    
    div.querySelector('.btn-minus').addEventListener('click', () => onUpdateQuantity(c.cartId, -1));
    div.querySelector('.btn-plus').addEventListener('click', () => onUpdateQuantity(c.cartId, 1));
    div.querySelector('.btn-remove').addEventListener('click', () => onRemove(c.cartId));
    
    return div;
}
