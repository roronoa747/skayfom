const fs = require('fs');

let code = fs.readFileSync('src/app/main.js', 'utf8');

// 1. Add imports
code = code.replace(
    "import { loadCatalogData } from '../shared/api/catalog.js';",
    `import { loadCatalogData } from '../shared/api/catalog.js';
import { createCard } from '../entities/product/ui.js';
import { cart, addToCart, updateQuantity, removeFromCart, getCartTotal, getCartCount, subscribeToCart } from '../entities/cart/model.js';
import { createCartItemElement } from '../entities/cart/ui.js';
import { VIBE_COLORS, VIBE_RGB_MAP } from '../shared/lib/constants.js';`
);

// 2. Remove cart state
code = code.replace(/let cart = \[\];\nlet cartIdCounter = 0;\n/, '');

// 3. Remove VIBE_COLORS and VIBE_RGB_MAP
const vStart = code.indexOf('const VIBE_COLORS = {');
const vEnd = code.indexOf('// 2. Initialization');
if (vStart !== -1 && vEnd !== -1) {
    code = code.substring(0, vStart) + code.substring(vEnd);
}

// 4. Remove createCard
const cStart = code.indexOf('function createCard(item)');
const cEnd = code.indexOf('// 5. Events & Interactivity');
if (cStart !== -1 && cEnd !== -1) {
    code = code.substring(0, cStart) + code.substring(cEnd);
}

// 5. Rewrite renderCart to use createCartItemElement
const rStart = code.indexOf('function renderCart() {');
const rEnd = code.indexOf('// Search Input');
if (rStart !== -1 && rEnd !== -1) {
    const newRenderCart = `function renderCart() {
    if (!DOM.cartItems) return;
    DOM.cartItems.innerHTML = '';
    
    let total = getCartTotal();
    let count = getCartCount();
    
    if (cart.length === 0) {
        DOM.cartItems.innerHTML = '<div class="text-white/50 text-center py-10">Корзина пуста</div>';
    } else {
        cart.forEach(c => {
            const el = createCartItemElement(c, updateQuantity, removeFromCart);
            DOM.cartItems.appendChild(el);
        });
    }
    
    if (DOM.cartTotal) DOM.cartTotal.textContent = \`\${total} ₸\`;
    if (DOM.cartBadge) {
        DOM.cartBadge.textContent = count;
        DOM.cartBadge.style.display = count > 0 ? 'flex' : 'none';
        
        const mobileBadge = document.getElementById('mobileCartBadge');
        if (mobileBadge) {
            mobileBadge.textContent = count;
            mobileBadge.style.display = count > 0 ? 'flex' : 'none';
        }
    }
    
    if (DOM.checkoutBtn) {
        DOM.checkoutBtn.disabled = cart.length === 0;
        if (cart.length === 0) {
            DOM.checkoutBtn.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            DOM.checkoutBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    }
}

`;
    code = code.substring(0, rStart) + newRenderCart + code.substring(rEnd);
}

// 6. Remove addToCart, updateQuantity, removeFromCart
const aStart = code.indexOf('function addToCart(item)');
const aEnd = code.indexOf('function renderCart()');
if (aStart !== -1 && aEnd !== -1) {
    code = code.substring(0, aStart) + code.substring(aEnd);
}

// 7. Initialize subscribeToCart in init()
code = code.replace(
    'initEventListeners();',
    'initEventListeners();\n        subscribeToCart(renderCart);'
);

// 8. Fix createCard calls in renderCatalog
// In renderCatalog, it was: const card = createCard(item);
// It should be: const card = createCard(item, addToCart);
code = code.replace(/createCard\(item\)/g, 'createCard(item, addToCart)');

fs.writeFileSync('src/app/main.js', code, 'utf8');
console.log('Successfully refactored main.js for Step 3');
