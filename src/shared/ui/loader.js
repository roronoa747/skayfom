export function triggerSmoke(DOM, duration = 1500) {
    if (!DOM || !DOM.smokeLoader) return;
    
    DOM.smokeLoader.classList.remove('hidden');
    
    // Allow display to apply before opacity transition
    setTimeout(() => {
        DOM.smokeLoader.classList.remove('opacity-0');
        DOM.smokeLoader.classList.add('opacity-100');
    }, 50);
    
    setTimeout(() => {
        DOM.smokeLoader.classList.remove('opacity-100');
        DOM.smokeLoader.classList.add('opacity-0');
        setTimeout(() => {
            DOM.smokeLoader.classList.add('hidden');
        }, 500); // Wait for CSS opacity transition
    }, duration);
}
