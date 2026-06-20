export function createCartItemElement(c, onUpdateQuantity, onRemove) {
    const div = document.createElement('div');
    div.className = 'flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5';
    
    const imagePath = c.item.media_url ? c.item.media_url.replace(/^images\//, '') : `catalog/${c.item.id}.png`;
    const imageSrc = `./images/${imagePath}`;
    
    const inStock = String(c.item.in_stock).toLowerCase() === 'true' || String(c.item.in_stock).toLowerCase() === 'да';
    const priceDisplay = inStock 
        ? `<div class="text-sm font-bold text-sky-400">${c.price * c.quantity} ₸</div>`
        : `<div class="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-1 rounded text-center leading-tight whitespace-nowrap">Предзаказ</div>`;
    
    const brandLower = (c.item.brand || '').toLowerCase().trim();
    const isSarma = brandLower.includes('сарма') || brandLower.includes('sarma');
    const imageClass = isSarma ? 'w-full h-full object-cover' : 'w-full h-full object-contain';
    const containerClass = isSarma ? 'w-16 h-16 bg-black/50 rounded-lg flex items-center justify-center overflow-hidden' : 'w-16 h-16 bg-black/50 rounded-lg flex items-center justify-center p-2 overflow-hidden';

    div.innerHTML = `
        <div class="${containerClass}">
            <img src="${imageSrc}" class="${imageClass}" onerror="this.onerror=null; this.src='./images/logo.png';">
        </div>
        <div class="flex-1 min-w-0">
            <div class="text-xs text-white/50 truncate">${c.item.brand}</div>
            <div class="text-sm font-bold text-white mb-2 truncate">${c.item.flavor}</div>
            <div class="flex items-center gap-3">
                <button class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors btn-minus">-</button>
                <span class="text-sm font-bold w-4 text-center">${c.quantity}</span>
                <button class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors btn-plus">+</button>
            </div>
        </div>
        <div class="flex flex-col items-end justify-between self-stretch py-1">
            <button class="text-white/30 hover:text-red-500 transition-colors btn-remove">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
            ${priceDisplay}
        </div>
    `;
    
    div.querySelector('.btn-minus').addEventListener('click', () => onUpdateQuantity(c.cartId, -1));
    div.querySelector('.btn-plus').addEventListener('click', () => onUpdateQuantity(c.cartId, 1));
    div.querySelector('.btn-remove').addEventListener('click', () => onRemove(c.cartId));
    
    return div;
}
