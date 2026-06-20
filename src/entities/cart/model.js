export let cart = [];
let cartIdCounter = 0;
const subscribers = [];

export function subscribeToCart(callback) {
    subscribers.push(callback);
}

function notify() {
    subscribers.forEach(cb => cb(cart));
}

export function addToCart(item) {
    const isRentMode = item.type === 'Аренда' || (item.product_category === 'Табаки' && document.querySelector('.tab-btn[data-type="Аренда"]')?.classList.contains('active'));
    const isTobacco = item.product_category === 'Табаки' || item.category === 'Табаки' || !item.product_category; // Fallback 

    const existing = cart.find(c => c.item.flavor === item.flavor && c.item.brand === item.brand && c.item.type === (isRentMode ? 'Аренда' : item.type));
    
    // Rent Pricing Logic for Tobaccos
    let itemPrice = isRentMode ? (parseInt(item.price_rent) || parseInt(item.price) || 0) : (parseInt(item.price_sale) || parseInt(item.price) || 0);
    if (isRentMode && isTobacco) {
        // Find how many tobacco bowls are already in the cart for rent
        const rentTobaccos = cart.filter(c => (c.item.product_category === 'Табаки' || c.item.category === 'Табаки') && c.item.type === 'Аренда');
        // If this is the very first rent tobacco, price is 0. Else it's extra bowl price.
        // For now, extra bowl price is 0, but can be changed via DB later.
        const EXTRA_BOWL_PRICE = 0; 
        if (rentTobaccos.length === 0 && !existing) {
            itemPrice = 0; // First bowl free
        } else {
            itemPrice = EXTRA_BOWL_PRICE; // Extra bowl
        }
    }

    if (existing) {
        existing.quantity += 1;
        // Keep the price of the existing item (either 0 or EXTRA_BOWL_PRICE)
    } else {
        const cartItem = { ...item };
        if (isRentMode) cartItem.type = 'Аренда'; // Force type to rent if added in rent mode
        
        cart.push({
            item: cartItem,
            quantity: 1,
            price: itemPrice,
            cartId: cartIdCounter++
        });
    }

    // Auto-add Kit Items if adding tobacco in Rent Mode
    if (isRentMode && isTobacco) {
        const hasKitItem = (flavor) => cart.find(c => c.item.category === 'Аренда' && c.item.flavor === flavor && c.item.brand === 'Комплект');

        if (!hasKitItem('Стандартный кальян')) {
            cart.push({
                item: { type: 'Аренда', category: 'Аренда', brand: 'Комплект', flavor: 'Стандартный кальян', description: 'В комплекте', media_url: '', price: 0, in_stock: 'true' },
                quantity: 1, price: 0, cartId: cartIdCounter++
            });
        }
        if (!hasKitItem('Уголь (шт)')) {
            cart.push({
                item: { type: 'Аренда', category: 'Аренда', brand: 'Комплект', flavor: 'Уголь (шт)', description: 'В комплекте', media_url: '', price: 0, in_stock: 'true' },
                quantity: 4, price: 0, cartId: cartIdCounter++
            });
        }
    }

    notify();
}

export function updateQuantity(cartId, delta) {
    const cartItem = cart.find(c => c.cartId === cartId);
    if (!cartItem) return;
    
    cartItem.quantity += delta;
    if (cartItem.quantity <= 0) {
        cart = cart.filter(c => c.cartId !== cartId);
    } else {
        // Special logic for Coals in Rent kit: first 4 are base price (0), each extra coal adds EXTRA_COAL_PRICE
        if (cartItem.item.category === 'Аренда' && cartItem.item.flavor === 'Уголь (шт)') {
            const EXTRA_COAL_PRICE = parseInt(cartItem.item.price_rent) || parseInt(cartItem.item.price_sale) || parseInt(cartItem.item.price) || 0;
            const baseQuantity = 4;
            if (cartItem.quantity > baseQuantity) {
                cartItem.price = EXTRA_COAL_PRICE; 
            } else {
                cartItem.price = 0; // Base quantity included
            }
        }
    }
    notify();
}

export function removeFromCart(cartId) {
    cart = cart.filter(c => c.cartId !== cartId);
    notify();
}

export function getCartTotal() {
    return cart.reduce((sum, current) => sum + (current.price * current.quantity), 0);
}

export function getCartCount() {
    return cart.reduce((sum, current) => sum + current.quantity, 0);
}
