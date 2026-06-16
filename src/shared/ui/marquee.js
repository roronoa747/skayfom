// Global map for marquees
const activeMarquees = {};
let globalMarqueeInteractionTime = 0;

export function initJSMarquee(containerId, speed) {
    if (activeMarquees[containerId]) {
        cancelAnimationFrame(activeMarquees[containerId].raf);
    }
    
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const inner = container.querySelector('.js-marquee-inner');
    if (!inner) return;

    let isDown = false;
    let startX;
    let scrollLeft;
    let isAutoScrolling = true;
    let exactScrollLeft = container.scrollLeft || 0;
    
    let hasDragged = false;
    let lastFrameTime = performance.now();
    const RESUME_DELAY = 2000; 
    
    let currentSpeed = speed; 
    
    function autoScroll(currentTime) {
        let deltaTime = currentTime - lastFrameTime;
        lastFrameTime = currentTime;
        
        if (deltaTime > 100) deltaTime = 16.666;
        let dt = deltaTime / 16.666;
        
        let isInteracting = Date.now() - globalMarqueeInteractionTime < RESUME_DELAY;
        let isMouseOver = window.matchMedia("(hover: hover)").matches && container.matches(':hover');
        let isActivelyDragging = isDown || !isAutoScrolling;
        
        let targetSpeed = (isActivelyDragging || isInteracting || isMouseOver || speed === 0) ? 0 : speed;
        
        if (isActivelyDragging) {
            currentSpeed = 0;
        } else {
            currentSpeed += (targetSpeed - currentSpeed) * 0.08 * dt;
        }
        
        if (Math.abs(currentSpeed) < 0.001 && targetSpeed === 0) {
            currentSpeed = 0;
        }

        // Optimize: avoid reading scrollWidth every frame
        let halfWidth = inner.dataset.halfWidth;
        if (!halfWidth) {
            halfWidth = inner.scrollWidth / 2;
            inner.dataset.halfWidth = halfWidth;
        }

        // Optimizing for mobile: don't force reflows if not actively moving automatically
        if (isActivelyDragging) {
            exactScrollLeft = container.scrollLeft;
            if (currentSpeed === 0 && inner.style.transform !== 'translateX(0px)') {
                inner.style.transform = `translateX(0px)`;
            }
        }

        if (currentSpeed !== 0) {
            let moveAmount = currentSpeed * dt;
            exactScrollLeft += moveAmount;
            
            while (exactScrollLeft >= halfWidth && halfWidth > 0) exactScrollLeft -= halfWidth;
            while (exactScrollLeft < 0 && halfWidth > 0) exactScrollLeft += halfWidth;
            
            let intScroll = Math.floor(exactScrollLeft);
            container.scrollLeft = intScroll;
            
            let subPixel = exactScrollLeft - intScroll;
            inner.style.transform = `translateX(${-subPixel}px)`;
        } else if (!isActivelyDragging) {
            if (exactScrollLeft < 0 && halfWidth > 0) {
                exactScrollLeft += halfWidth;
                if (container.scrollLeft !== exactScrollLeft) container.scrollLeft = exactScrollLeft;
            } else if (exactScrollLeft > halfWidth && halfWidth > 0) {
                exactScrollLeft -= halfWidth;
                if (container.scrollLeft !== exactScrollLeft) container.scrollLeft = exactScrollLeft;
            }
        }
        
        // On mobile touch, if it's purely scrolling natively, avoid running the rAF to save battery and prevent stutter
        if (!isActivelyDragging || isDown) {
            activeMarquees[containerId].raf = requestAnimationFrame(autoScroll);
        } else {
            // It's actively dragging via touch (native scroll). Let's wait until it stops.
            activeMarquees[containerId].raf = requestAnimationFrame(autoScroll);
        }
    }
    
    activeMarquees[containerId] = {
        raf: requestAnimationFrame(autoScroll)
    };
    
    if (window.matchMedia("(hover: hover)").matches) {
        container.addEventListener('mouseleave', () => {
            globalMarqueeInteractionTime = Date.now();
        });
    }
    
    container.addEventListener('mousedown', (e) => {
        isDown = true;
        hasDragged = false;
        container.classList.add('cursor-grabbing');
        container.classList.remove('cursor-grab');
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
        isAutoScrolling = false;
        globalMarqueeInteractionTime = Date.now();
    });
    
    window.addEventListener('mouseup', () => {
        if (isDown) {
            isDown = false;
            isAutoScrolling = true;
            container.classList.remove('cursor-grabbing');
            container.classList.add('cursor-grab');
            globalMarqueeInteractionTime = Date.now();
        }
    });
    
    container.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 1.0;
        if (Math.abs(x - startX) > 5) {
            hasDragged = true;
        }
        
        let targetScroll = scrollLeft - walk;
        let halfWidth = inner.dataset.halfWidth || (inner.scrollWidth / 2);
        
        while (targetScroll >= halfWidth && halfWidth > 0) {
            targetScroll -= halfWidth;
            scrollLeft -= halfWidth; 
        }
        while (targetScroll < 0 && halfWidth > 0) {
            targetScroll += halfWidth;
            scrollLeft += halfWidth;
        }
        
        container.scrollLeft = targetScroll;
        globalMarqueeInteractionTime = Date.now();
    });
    
    container.addEventListener('click', (e) => {
        if (hasDragged) {
            e.preventDefault();
            e.stopPropagation();
            hasDragged = false;
        }
    }, { capture: true });
    
    // Use passive listeners to prevent mobile scrolling blocks
    container.addEventListener('touchstart', () => {
        isAutoScrolling = false;
        globalMarqueeInteractionTime = Date.now();
    }, {passive: true});
    
    container.addEventListener('touchmove', () => {
        globalMarqueeInteractionTime = Date.now();
    }, {passive: true});
    
    container.addEventListener('touchend', () => {
        isAutoScrolling = true;
        globalMarqueeInteractionTime = Date.now();
    }, {passive: true});
    
    container.addEventListener('touchcancel', () => {
        isAutoScrolling = true;
        globalMarqueeInteractionTime = Date.now();
    }, {passive: true});
    
    container.addEventListener('wheel', () => {
        globalMarqueeInteractionTime = Date.now();
    }, {passive: true});
}
