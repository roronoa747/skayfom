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
    const existing = cart.find(c => c.item.flavor === item.flavor && c.item.brand === item.brand);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            item: item,
            quantity: 1,
            price: parseInt(item.price) || 0,
            cartId: cartIdCounter++
        });
    }
    notify();
}

export function updateQuantity(cartId, delta) {
    const cartItem = cart.find(c => c.cartId === cartId);
    if (!cartItem) return;
    
    cartItem.quantity += delta;
    if (cartItem.quantity <= 0) {
        cart = cart.filter(c => c.cartId !== cartId);
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
