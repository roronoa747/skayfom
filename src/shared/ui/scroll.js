let scrollObserver = null;

export function initScrollReveal() {
    if (scrollObserver) {
        scrollObserver.disconnect();
    }
    
    scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('reveal-hidden');
                entry.target.classList.add('reveal-visible');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05 });

    document.querySelectorAll('.reveal-hidden').forEach(el => scrollObserver.observe(el));
}
