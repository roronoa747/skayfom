// S.KAYFOM STORE - Main Entry Point
import { initScrollReveal } from '../shared/ui/scroll.js';
import { initHome } from '../pages/home/ui.js';

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

function initApp() {
    try {
        initScrollReveal();
        initHome();
    } catch (error) {
        console.error("Initialization error:", error);
    }
}
