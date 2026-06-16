import { triggerSmoke } from '../../shared/ui/loader.js';
import { isAdult, setAdult } from '../../entities/session/index.js';

export function initAgeGate(domElements) {
    const { ageGate, btn18Yes, btn18No, appWrapper } = domElements;
    
    if (!ageGate) return;

    const isAdultCheck = isAdult();
    if (isAdultCheck) {
        ageGate.style.display = 'none';
    } else if (appWrapper && !isAdultCheck) {
        appWrapper.classList.add('scale-105', 'opacity-50');
    }

    if (btn18Yes) {
        btn18Yes.addEventListener('click', () => {
            setAdult(true);
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
