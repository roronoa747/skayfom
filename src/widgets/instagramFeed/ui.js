export function initInstagramFeed() {
    const feed = document.getElementById('instagram-feed');
    if (!feed) return;
    
    // Pool of local hookah and tobacco product images
    const instaPool = [
        "./images/catalog/401.png",
        "./images/catalog/402.png",
        "./images/catalog/404.png",
        "./images/catalog/405.png",
        "./images/catalog/406.png",
        "./images/catalog/407.png",
        "./images/catalog/409.png",
        "./images/catalog/411.png",
        "./images/catalog/412.png",
        "./images/catalog/413.png",
        "./images/catalog/501.png",
        "./images/catalog/502.png",
        "./images/catalog/503.png",
        "./images/catalog/504.png",
        "./images/catalog/505.png",
        "./images/catalog/506.png",
        "./images/catalog/507.png",
        "./images/catalog/508.png",
        "./images/catalog/509.png",
        "./images/catalog/510.png"
    ];
    
    // Select 2 unique images
    const selected = [...instaPool].sort(() => 0.5 - Math.random()).slice(0, 2);
    const iconSvg = `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>`;
    
    let html = '';
    selected.forEach(src => {
        html += `
            <a href="https://instagram.com/s.kayfom" target="_blank" class="block aspect-square relative group overflow-hidden rounded-xl bg-neutral-900 border border-white/5">
                <img src="${src}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Instagram Post">
                <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white">
                    ${iconSvg}
                    <span class="mt-2 text-xs font-bold tracking-widest uppercase">Смотреть</span>
                </div>
            </a>
        `;
    });
    
    feed.innerHTML = html;
}
