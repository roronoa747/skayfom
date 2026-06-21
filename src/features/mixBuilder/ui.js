export function initMixBuilderUI(DOM, { WHATSAPP_NUMBER }) {
    let selectedIngredients = []; // Array of { tag: string, value: number }
    const MAX_INGREDIENTS = 3;

    // Elements
    const btnToggleMix = document.getElementById('btn-toggle-mix');
    const mixBuilderPanel = document.getElementById('mix-builder');
    const ingredientsContainer = document.getElementById('ingredients-container');
    const proportionsContainer = document.getElementById('mix-proportions-container');
    const slidersContainer = document.getElementById('mix-sliders');
    const btnOrderMix = document.getElementById('btn-order-mix');
    
    // We get buttons inside ingredientsContainer directly because DOM.ingredientBtns might be stale
    const ingredientBtns = ingredientsContainer ? ingredientsContainer.querySelectorAll('.ingredient-btn') : [];

    function updateSlidersUI() {
        if (selectedIngredients.length === 0) {
            proportionsContainer.classList.add('hidden');
            btnOrderMix.disabled = true;
            return;
        }

        proportionsContainer.classList.remove('hidden');
        btnOrderMix.disabled = false;
        slidersContainer.innerHTML = '';

        selectedIngredients.forEach((ing, index) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'flex flex-col gap-1';
            
            wrapper.innerHTML = `
                <div class="flex justify-between items-end">
                    <span class="text-xs text-white font-sans font-medium">${ing.tag}</span>
                    <span class="text-[10px] text-white/50 font-display">${ing.value}%</span>
                </div>
                <input type="range" min="0" max="100" step="10" value="${ing.value}" 
                       class="w-full accent-white mix-slider" 
                       data-index="${index}"
                       ${selectedIngredients.length === 1 ? 'disabled' : ''}>
            `;
            
            const slider = wrapper.querySelector('input');
            
            // Listen to input changes
            slider.addEventListener('input', (e) => {
                const newValue = parseInt(e.target.value, 10);
                handleSliderChange(index, newValue);
            });
            
            slidersContainer.appendChild(wrapper);
        });
    }

    function handleSliderChange(changedIndex, newValue) {
        const oldVal = selectedIngredients[changedIndex].value;
        let diff = newValue - oldVal;
        
        if (diff === 0) return;

        // Apply change to the dragged slider
        selectedIngredients[changedIndex].value = newValue;

        // Distribute the inverse of the diff among other sliders round-robin
        let amountToDistribute = -diff;
        
        // While there is amount to distribute
        let loopGuard = 0;
        while (amountToDistribute !== 0 && loopGuard < 100) {
            loopGuard++;
            
            let didDistributeInLoop = false;
            
            // Try to distribute in turn (round-robin starting from the next index)
            for (let i = 1; i < selectedIngredients.length; i++) {
                let targetIndex = (changedIndex + i) % selectedIngredients.length;
                
                if (amountToDistribute > 0) { // We need to add to others
                    if (selectedIngredients[targetIndex].value < 100) {
                        selectedIngredients[targetIndex].value += 10;
                        amountToDistribute -= 10;
                        didDistributeInLoop = true;
                        if (amountToDistribute === 0) break;
                    }
                } else if (amountToDistribute < 0) { // We need to subtract from others
                    if (selectedIngredients[targetIndex].value > 0) {
                        selectedIngredients[targetIndex].value -= 10;
                        amountToDistribute += 10;
                        didDistributeInLoop = true;
                        if (amountToDistribute === 0) break;
                    }
                }
            }
            
            // If we couldn't distribute anything in a full loop, we hit bounds (shouldn't happen with proper logic but safety first)
            if (!didDistributeInLoop) break;
        }

        // If for some reason we couldn't balance perfectly (bounds hit), force balance by reverting the changed slider slightly
        if (amountToDistribute !== 0) {
            selectedIngredients[changedIndex].value += amountToDistribute;
        }

        // Re-render
        updateSlidersUI();
    }

    function setDefaultProportions() {
        const len = selectedIngredients.length;
        if (len === 1) {
            selectedIngredients[0].value = 100;
        } else if (len === 2) {
            selectedIngredients[0].value = 50;
            selectedIngredients[1].value = 50;
        } else if (len === 3) {
            selectedIngredients[0].value = 40;
            selectedIngredients[1].value = 30;
            selectedIngredients[2].value = 30;
        }
    }

    if (ingredientBtns.length > 0) {
        ingredientBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tag = e.target.dataset.tag;
                const existingIndex = selectedIngredients.findIndex(i => i.tag === tag);

                if (existingIndex !== -1) {
                    // Remove
                    selectedIngredients.splice(existingIndex, 1);
                    e.target.classList.remove('active', 'bg-white', 'text-black');
                    e.target.classList.add('bg-black/40', 'text-white');
                    setDefaultProportions();
                } else {
                    // Add
                    if (selectedIngredients.length >= MAX_INGREDIENTS) {
                        alert('Вы не можете выбрать более 3-х ингредиентов');
                        return;
                    }
                    selectedIngredients.push({ tag, value: 0 });
                    e.target.classList.remove('bg-black/40', 'text-white');
                    e.target.classList.add('active', 'bg-white', 'text-black');
                    setDefaultProportions();
                }
                updateSlidersUI();
            });
        });
    }

    // Order Button
    if (btnOrderMix) {
        btnOrderMix.addEventListener('click', () => {
            if (selectedIngredients.length === 0) return;

            const proportionsText = selectedIngredients
                .filter(i => i.value > 0)
                .map(i => `${i.tag} - ${i.value}%`)
                .join(', ');

            const text = `Привет! Я с сайта S.KAYFOM STORE. Хочу заказать кастомный микс. Мои предпочтения:\n${proportionsText}\nПодберите, пожалуйста, баночки для этого микса.`;
            
            const number = typeof WHATSAPP_NUMBER === 'function' ? WHATSAPP_NUMBER() : WHATSAPP_NUMBER;
            const waLink = `https://wa.me/${number.replace(/\\D/g, '')}?text=${encodeURIComponent(text)}`;
            window.open(waLink, '_blank');
        });
    }

    // Mix Builder Dropdown Toggle
    if (btnToggleMix && mixBuilderPanel) {
        btnToggleMix.addEventListener('click', (e) => {
            e.stopPropagation();
            const isClosed = mixBuilderPanel.classList.contains('opacity-0');
            if (isClosed) {
                mixBuilderPanel.classList.remove('opacity-0', 'pointer-events-none', 'scale-95');
                // Ensure initial state
                if (selectedIngredients.length === 0) {
                    btnOrderMix.disabled = true;
                }
            } else {
                mixBuilderPanel.classList.add('opacity-0', 'pointer-events-none', 'scale-95');
            }
        });
        
        // Close on click outside
        document.addEventListener('click', (e) => {
            if (!mixBuilderPanel.contains(e.target) && !btnToggleMix.contains(e.target)) {
                mixBuilderPanel.classList.add('opacity-0', 'pointer-events-none', 'scale-95');
            }
        });
    }
}
