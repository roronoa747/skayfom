import { triggerSmoke } from '../../shared/ui/loader.js';

export function initAgeGate(domElements) {
    const { ageGate, btn18Yes, btn18No, appWrapper } = domElements;
    
    if (!ageGate) return;

    const isAdult = localStorage.getItem('skayfom_21plus');
    if (isAdult) {
        ageGate.style.display = 'none';
    } else if (appWrapper && !isAdult) {
        appWrapper.classList.add('scale-105', 'opacity-50');
    }

    if (btn18Yes) {
        btn18Yes.addEventListener('click', () => {
            localStorage.setItem('skayfom_21plus', 'true');
            ageGate.classList.add('opacity-0');
            
            if (appWrapper) {
                appWrapper.classList.remove('scale-105', 'opacity-50');
            }
            
            setTimeout(() => {
                ageGate.style.display = 'none';
                triggerSmoke(domElements, 1500);
            }, 700);
        });
    }

    if (btn18No) {
        btn18No.addEventListener('click', () => {
            window.location.href = 'https://google.com';
        });
    }
}
