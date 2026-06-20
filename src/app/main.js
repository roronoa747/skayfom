import './styles/main.css';
import '../shared/ui/styles/typography.css';
import '../shared/ui/styles/buttons.css';
import '../shared/ui/styles/animations.css';
import '../widgets/map/style.css';
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
