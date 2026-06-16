let toastContainer = null;

export function initToast(containerElement) {
    toastContainer = containerElement;
}

export function showToast(message, duration = 3000) {
    if (!toastContainer) {
        toastContainer = document.getElementById('toast-container');
        if (!toastContainer) return;
    }
    
    const toast = document.createElement('div');
    toast.className = 'bg-[#111113]/95 backdrop-blur-xl border border-sky-500/30 text-white px-6 py-4 rounded-xl shadow-[0_10px_30px_rgba(14,165,233,0.15)] flex items-center gap-3 transform translate-y-full opacity-0 transition-all duration-300 pointer-events-auto cursor-pointer hover:border-sky-400/50';
    toast.innerHTML = `
        <div class="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <div>
            <p class="font-display font-bold text-[10px] tracking-[0.1em] text-white/50 mb-0.5">СТАТУС</p>
            <p class="font-alt text-sm">${message}</p>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    let isRemoved = false;
    let removeTimeout;
    
    const removeToast = () => {
        if (isRemoved) return;
        isRemoved = true;
        clearTimeout(removeTimeout);
        
        toast.classList.add('translate-y-full', 'opacity-0');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    };

    // Close on click
    toast.addEventListener('click', removeToast);
    
    // Animate in
    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-full', 'opacity-0');
    });
    
    // Auto-remove
    removeTimeout = setTimeout(removeToast, duration);
}
