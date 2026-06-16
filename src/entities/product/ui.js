import { VIBE_RGB_MAP } from '../../shared/lib/constants.js';

export function createCard(item, onAddToCart, onPreorder) {
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
    div.style.contentVisibility = 'auto';
    div.style.containIntrinsicSize = '350px';
    div.style.willChange = 'transform, opacity'; // help with reveal animations
    
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

    const imagePath = item.media_url ? item.media_url.replace(/^images\//, '') : `catalog/${item.id}.png`;
    const imageSrc = `images/${imagePath}`;
    const imageClass = 'absolute inset-0 w-full h-full p-[10%] object-contain z-10 drop-shadow-[0_15px_15px_rgba(0,0,0,0.8)] transition-transform duration-700 ease-out group-hover:scale-110';
    const logoClass = 'absolute inset-0 w-full h-full p-[25%] object-contain opacity-20 mix-blend-screen z-10 transition-transform duration-700 ease-out group-hover:scale-105';

    div.innerHTML = `
        <div class="absolute top-4 right-4 text-xs font-bold px-2 py-1 rounded ${badgeColor} border border-current/20 z-30">
            ${badgeText}
        </div>
        
        <div class="mb-4 aspect-square w-full block bg-[#050507] rounded-xl overflow-hidden border border-white/5 relative">
             <div class="absolute inset-0 opacity-20 pointer-events-none" style="background-image: radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px); background-size: 12px 12px;"></div>
             
             <div class="absolute top-0 left-0 w-[150%] h-[150%] pointer-events-none transform -translate-x-1/4 -translate-y-1/4" style="background: radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 60%);"></div>
             <div class="absolute bottom-0 right-0 w-[150%] h-[150%] pointer-events-none transform translate-x-1/4 translate-y-1/4" style="background: radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 60%);"></div>
             
             <img src="${imageSrc}" class="${imageClass}" alt="${item.flavor}" loading="lazy" decoding="async" onerror="this.onerror=null; this.src='images/logo.png'; this.className='${logoClass}';">
             
             <div class="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent z-20 pointer-events-none"></div>
        </div>
        
        <div class="flex-1 flex flex-col relative z-20">
            <h3 class="text-[10px] text-neutral-500 font-display tracking-[0.3em] uppercase mb-1">${item.brand}</h3>
            <h2 class="text-xl font-alt font-black text-white mb-2 uppercase">${item.flavor}</h2>
            <p class="text-xs text-white/50 mb-4 line-clamp-2 font-alt font-light leading-relaxed">${item.description || ''}</p>
            
            <div class="mt-auto flex flex-col gap-4">
                ${strengthDots}
                <button class="w-full py-3 rounded-lg text-xs font-display tracking-[0.2em] transition-all duration-500 border border-orange-500/20 bg-orange-950/20 text-orange-500/60 shadow-[0_0_10px_rgba(234,88,12,0.1)] group-hover:border-orange-500/40 group-hover:text-orange-400 group-hover:shadow-[0_0_20px_rgba(234,88,12,0.2)] hover:!bg-gradient-to-r hover:!from-orange-500 hover:!to-red-600 hover:!border-orange-400 hover:!text-white hover:!shadow-[0_0_40px_rgba(239,68,68,0.8),inset_0_0_20px_rgba(255,255,255,0.5)] btn-action">
                    ${inStock ? 'В КОРЗИНУ' : 'СООБЩИТЬ ПРИ ПОСТУПЛЕНИИ'}
                </button>
            </div>
        </div>
    `;

    const btnAction = div.querySelector('.btn-action');
    if (btnAction) {
        const originalText = btnAction.innerHTML;
        btnAction.addEventListener('click', () => {
            if (onAddToCart) {
                onAddToCart(item);
                
                // Visual feedback
                btnAction.innerHTML = 'ДОБАВЛЕНО ✔';
                btnAction.classList.add('bg-green-500/20', 'text-green-400', 'border-green-500/50');
                btnAction.classList.remove('text-orange-500/60', 'bg-orange-950/20', 'border-orange-500/20');
                
                setTimeout(() => {
                    btnAction.innerHTML = originalText;
                    btnAction.classList.remove('bg-green-500/20', 'text-green-400', 'border-green-500/50');
                    btnAction.classList.add('text-orange-500/60', 'bg-orange-950/20', 'border-orange-500/20');
                }, 2000);
            }
        });
    }

    return div;
}
