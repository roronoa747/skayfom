export const filtersState = {
    searchQuery: '',
    currentTab: 'Магазин', // 'Магазин' | 'Аренда'
    activeVibes: new Set(),
    activeIngredients: new Set(),
    activeBrand: null,
    activeStrength: null,
    activeProductCategory: 'Табаки'
};

const listeners = [];

export function subscribeToFilters(listener) {
    listeners.push(listener);
}

export function notifyFiltersChanged() {
    listeners.forEach(fn => fn());
}

export function setFilters(updates) {
    let changed = false;
    for (const [key, value] of Object.entries(updates)) {
        if (filtersState[key] !== value) {
            filtersState[key] = value;
            changed = true;
        }
    }
    if (changed) {
        notifyFiltersChanged();
    }
}

export function toggleSetFilter(setName, item) {
    const set = filtersState[setName];
    if (set.has(item)) {
        set.delete(item);
    } else {
        set.add(item);
    }
    notifyFiltersChanged();
}
