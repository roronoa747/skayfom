export let state = {
    currentTab: 'Магазин', // Магазин | Аренда
    searchQuery: '',
    activeVibes: new Set(),
    activeBrand: null,
    activeStrength: null,
    activeProductCategory: 'Табаки'
};

const subscribers = [];

export function subscribeToFilters(callback) {
    subscribers.push(callback);
}

function notify() {
    subscribers.forEach(cb => cb(state));
}

export function setTab(tab) {
    state.currentTab = tab;
    // reset other filters? The original logic kept them sometimes, except when changing root cats
    notify();
}

export function setSearchQuery(query) {
    state.searchQuery = query;
    notify();
}

export function toggleVibe(vibe) {
    if (state.activeVibes.has(vibe)) {
        state.activeVibes.delete(vibe);
    } else {
        state.activeVibes.add(vibe);
    }
    notify();
}

export function setBrand(brand) {
    if (state.activeBrand === brand) {
        state.activeBrand = null;
    } else {
        state.activeBrand = brand;
    }
    notify();
}

export function setStrength(strength) {
    if (state.activeStrength === strength) {
        state.activeStrength = null;
    } else {
        state.activeStrength = strength;
    }
    notify();
}

export function setProductCategory(cat) {
    state.activeProductCategory = cat;
    // When switching root categories (Все / Hookah), clear sub-filters
    state.activeBrand = null;
    state.activeVibes.clear();
    notify();
}

export function clearFilters() {
    state.searchQuery = '';
    state.activeVibes.clear();
    state.activeBrand = null;
    state.activeStrength = null;
    state.activeProductCategory = 'Табаки';
    notify();
}

