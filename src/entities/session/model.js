export function isAdult() {
    return localStorage.getItem('skayfom_21plus') === 'true';
}

export function setAdult(value) {
    if (value) {
        localStorage.setItem('skayfom_21plus', 'true');
    } else {
        localStorage.removeItem('skayfom_21plus');
    }
}

export function isB2BMode() {
    return localStorage.getItem('isB2BMode') === 'true';
}

export function setB2BMode(value) {
    if (value) {
        localStorage.setItem('isB2BMode', 'true');
    } else {
        localStorage.removeItem('isB2BMode');
    }
}
