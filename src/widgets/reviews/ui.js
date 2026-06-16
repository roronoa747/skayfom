const reviewsData = [
    { name: "Алихан", initial: "А", text: "Отличный магазин, всегда свежий табак и огромный выбор. Консультанты топовые, помогли собрать классный микс!" },
    { name: "Ерлан", initial: "Е", text: "Брал кальян в аренду на выходные. Привезли быстро, аппарат чистый, забивка пушечная. Рекомендую всем!" },
    { name: "Madina", initial: "M", text: "Очень стильное место, всегда в наличии Chabacco и Deus. Цены приятные, обслуживание на уровне, ребята знают толк." },
    { name: "Данияр", initial: "Д", text: "Лучший сервис в Астане! Всегда быстро отвечают, доставка приезжает вовремя. Качество табака на высоте." },
    { name: "Айдана", initial: "А", text: "Приятная атмосфера в самом заведении и огромный выбор для дома. Теперь закупаюсь только здесь!" },
    { name: "Руслан", initial: "Р", text: "Топовые миксы! Ребята подсказали, что взять для вечеринки, гости были в восторге. Однозначно 5 звезд." },
    { name: "Зарина", initial: "З", text: "Арендовали кальян на день рождения. Привезли полный комплект, все чистое и красивое. Спасибо большое!" }
];

export function initReviewsSlider() {
    const track = document.getElementById('reviews-slider-track');
    if (!track) return;
    
    const selectedReviews = [...reviewsData].sort(() => 0.5 - Math.random()).slice(0, 4);
    
    let html = '';
    selectedReviews.forEach(r => {
        html += `
            <div class="review-slide p-4 bg-black/40 rounded-xl border border-white/5 mb-4 shrink-0 shadow-lg select-none">
                <div class="flex items-center gap-3 mb-2">
                    <div class="w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center font-bold text-xs">${r.initial}</div>
                    <div>
                        <div class="text-sm font-bold text-white/90">${r.name}</div>
                        <div class="flex text-[#A4D233] text-[10px]">★★★★★</div>
                    </div>
                </div>
                <p class="text-sm text-white/70 line-clamp-4 pointer-events-none">${r.text}</p>
            </div>
        `;
    });
    
    // Clone first element for infinite scroll illusion
    html += `
        <div class="review-slide p-4 bg-black/40 rounded-xl border border-white/5 mb-4 shrink-0 shadow-lg select-none">
            <div class="flex items-center gap-3 mb-2">
                <div class="w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center font-bold text-xs">${selectedReviews[0].initial}</div>
                <div>
                    <div class="text-sm font-bold text-white/90">${selectedReviews[0].name}</div>
                    <div class="flex text-[#A4D233] text-[10px]">★★★★★</div>
                </div>
            </div>
            <p class="text-sm text-white/70 line-clamp-4 pointer-events-none">${selectedReviews[0].text}</p>
        </div>
    `;
    track.innerHTML = html;
    
    const slides = Array.from(track.querySelectorAll('.review-slide'));
    if (slides.length <= 1) return;
    
    let currentIndex = 0;
    const totalOriginalSlides = 4;
    let autoScrollTimer = null;
    let autoScrollTimeout = null;
    
    const startAutoScroll = () => {
        clearInterval(autoScrollTimer);
        autoScrollTimer = setInterval(goToNext, 5000);
    };
    
    const pauseAutoScroll = () => {
        clearInterval(autoScrollTimer);
        clearTimeout(autoScrollTimeout);
        autoScrollTimeout = setTimeout(startAutoScroll, 10000);
    };
    
    const updatePosition = (instant = false) => {
        const slideHeight = slides[0].offsetHeight + 16;
        track.style.transition = instant ? 'none' : 'transform 0.7s cubic-bezier(0.25, 1, 0.5, 1)';
        track.style.transform = `translateY(-${currentIndex * slideHeight}px)`;
    };

    const goToNext = () => {
        currentIndex++;
        updatePosition();
        
        if (currentIndex === totalOriginalSlides) {
            setTimeout(() => {
                currentIndex = 0;
                updatePosition(true);
            }, 700);
        }
    };

    const goToPrev = () => {
        if (currentIndex === 0) {
            currentIndex = totalOriginalSlides;
            updatePosition(true);
            track.offsetHeight; // Force reflow
        }
        currentIndex--;
        updatePosition();
    };
    
    let startY = 0;
    let isDragging = false;
    let currentY = 0;
    
    const handleStart = (e) => {
        startY = e.type.includes('mouse') ? e.pageY : e.touches[0].pageY;
        isDragging = true;
        pauseAutoScroll();
    };
    
    const handleMove = (e) => {
        if (!isDragging) return;
        const y = e.type.includes('mouse') ? e.pageY : e.touches[0].pageY;
        currentY = y - startY;
        if (e.cancelable) e.preventDefault();
    };
    
    const handleEnd = (e) => {
        if (!isDragging) return;
        isDragging = false;
        
        if (currentY < -30) {
            goToNext();
        } else if (currentY > 30) {
            goToPrev();
        }
        currentY = 0;
    };
    
    track.addEventListener('mousedown', handleStart);
    track.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    
    track.addEventListener('touchstart', handleStart, {passive: true});
    track.addEventListener('touchmove', handleMove, {passive: false});
    track.addEventListener('touchend', handleEnd);

    startAutoScroll();
}
