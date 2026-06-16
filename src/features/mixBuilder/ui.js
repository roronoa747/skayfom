import { state, toggleIngredient } from '../filters/index.js';

export function initMixBuilderUI(DOM, { WHATSAPP_NUMBER, onIngredientToggle }) {
    if (DOM.ingredientBtns) {
        DOM.ingredientBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tag = e.target.dataset.tag;
                const success = toggleIngredient(tag);
                if (!success) {
                    alert('Вы не можете выбрать более 3-х ингредиентов');
                    return;
                }
                
                if (state.activeIngredients.has(tag)) {
                    e.target.classList.add('active');
                } else {
                    e.target.classList.remove('active');
                }
                onIngredientToggle();
            });
        });
    }

    // Custom Mix Button
    if (DOM.btnCustomMix) {
        DOM.btnCustomMix.addEventListener('click', () => {
            const ingredientsText = Array.from(state.activeIngredients).join(', ');
            const text = `Привет! Я с сайта S.KAYFOM STORE. Хочу создать кастомный микс. Мои предпочтения: ${ingredientsText}.`;
            const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
            window.open(waLink, '_blank');
        });
    }

    // Mix Builder Dropdown Toggle
    if (DOM.btnToggleMix && DOM.mixBuilder) {
        DOM.btnToggleMix.addEventListener('click', (e) => {
            e.stopPropagation();
            const isClosed = DOM.mixBuilder.classList.contains('opacity-0');
            if (isClosed) {
                DOM.mixBuilder.classList.remove('opacity-0', 'pointer-events-none', 'scale-95');
            } else {
                DOM.mixBuilder.classList.add('opacity-0', 'pointer-events-none', 'scale-95');
            }
        });
        
        // Close on click outside
        document.addEventListener('click', (e) => {
            if (!DOM.mixBuilder.contains(e.target)) {
                DOM.mixBuilder.classList.add('opacity-0', 'pointer-events-none', 'scale-95');
            }
        });
    }
}
